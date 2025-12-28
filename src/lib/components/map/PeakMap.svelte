<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import type { Map, Marker, Polyline, TileLayer } from 'leaflet';

  interface Peak {
    id: string;
    name: string;
    slug: string;
    elevation: number;
    latitude: number;
    longitude: number;
    rank: number;
    range: string;
    difficultyClass?: number;
  }

  interface Trail {
    routeId: string;
    routeName: string;
    routeSlug: string;
    peakSlug: string;
    peakName: string;
    difficultyClass: number;
    geometry: {
      type: string;
      coordinates: [number, number, number][];
      properties: Record<string, unknown>;
    };
  }

  interface Props {
    peaks: Peak[];
    summitedPeakIds?: Set<string>;
    selectedPeakId?: string | null;
    onPeakSelect?: (peakId: string) => void;
    trails?: Trail[];
    showTrails?: boolean;
  }

  let { peaks, summitedPeakIds = new Set(), selectedPeakId = null, onPeakSelect, trails = [], showTrails = false }: Props = $props();

  let mapContainer: HTMLDivElement;
  let map: Map | null = null;
  let markers: Map<string, Marker> = new Map();
  let trailPolylines: Polyline[] = [];
  let currentTileLayer: TileLayer | null = null;
  let L: typeof import('leaflet') | null = null;

  // Map type state
  type MapType = 'topo' | 'satellite' | 'street';
  let currentMapType = $state<MapType>('topo');

  // Map tile configurations
  const mapTiles: Record<MapType, { url: string; attribution: string; maxZoom: number }> = {
    topo: {
      url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
      attribution: '© <a href="https://opentopomap.org">OpenTopoMap</a>',
      maxZoom: 17
    },
    satellite: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: '© <a href="https://www.esri.com">Esri</a>',
      maxZoom: 18
    },
    street: {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19
    }
  };

  // Colorado 14ers center point
  const COLORADO_CENTER: [number, number] = [39.1, -106.2];
  const DEFAULT_ZOOM = 9;
  const SINGLE_PEAK_ZOOM = 12;

  // Difficulty class colors
  const classColors: Record<number, string> = {
    1: '#22c55e', // green
    2: '#3b82f6', // blue
    3: '#eab308', // yellow
    4: '#ef4444', // red
  };

  function switchMapType(type: MapType) {
    if (!map || !L || type === currentMapType) return;

    // Remove current tile layer
    if (currentTileLayer) {
      currentTileLayer.remove();
    }

    // Add new tile layer
    const config = mapTiles[type];
    currentTileLayer = L.tileLayer(config.url, {
      attribution: config.attribution,
      maxZoom: config.maxZoom,
      minZoom: 6
    }).addTo(map);

    currentMapType = type;
  }

  function getMarkerColor(peak: Peak): string {
    return classColors[peak.difficultyClass || 1] || classColors[1];
  }

  function createMarkerIcon(peak: Peak, isSummited: boolean) {
    if (!L) return null;

    const color = getMarkerColor(peak);
    const size = 32;
    const halfSize = size / 2;

    // Mountain-shaped marker with prominence
    const svgIcon = `
      <svg width="${size}" height="${size}" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <!-- Drop shadow -->
        <defs>
          <filter id="shadow-${peak.id}" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity="0.3"/>
          </filter>
        </defs>
        <!-- Mountain shape -->
        <g filter="url(#shadow-${peak.id})">
          <path
            d="M16 4 L28 26 L4 26 Z"
            fill="${isSummited ? color : 'white'}"
            stroke="${color}"
            stroke-width="2.5"
            stroke-linejoin="round"
          />
          <!-- Snow cap -->
          <path
            d="M16 4 L20 11 L12 11 Z"
            fill="${isSummited ? 'rgba(255,255,255,0.9)' : color}"
            stroke="none"
          />
          ${isSummited ? `
            <!-- Checkmark for summited -->
            <circle cx="16" cy="18" r="5" fill="white" opacity="0.95"/>
            <path
              d="M13 18 L15 20 L19 15"
              stroke="${color}"
              stroke-width="2"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          ` : `
            <!-- Class number for unsummited -->
            <text x="16" y="21" text-anchor="middle" font-size="9" font-weight="700" fill="${color}" font-family="system-ui, sans-serif">
              ${peak.difficultyClass || 1}
            </text>
          `}
        </g>
      </svg>
    `;

    return L.divIcon({
      html: svgIcon,
      className: 'peak-marker',
      iconSize: [size, size],
      iconAnchor: [halfSize, size - 4],
      popupAnchor: [0, -size + 8],
    });
  }

  function createPopupContent(peak: Peak, isSummited: boolean): string {
    const classColor = classColors[peak.difficultyClass || 1];

    return `
      <div class="peak-popup-content">
        <div class="popup-header">
          <span class="popup-class-badge" style="background:${classColor}">
            Class ${peak.difficultyClass || 1}
          </span>
          ${isSummited ? '<span class="popup-summited-badge">✓ Summited</span>' : ''}
        </div>
        <h3 class="popup-title">${peak.name}</h3>
        <div class="popup-stats">
          <span class="popup-elevation">${peak.elevation.toLocaleString()}'</span>
          <span class="popup-divider">·</span>
          <span class="popup-rank">Rank #${peak.rank}</span>
        </div>
        <div class="popup-range">${peak.range}</div>
        <a href="/peaks/${peak.slug}" class="popup-button">
          View Peak Details
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </a>
      </div>
    `;
  }

  async function initMap() {
    if (typeof window === 'undefined') return;

    // Dynamically import Leaflet (client-side only)
    L = await import('leaflet');
    await import('leaflet/dist/leaflet.css');

    if (!mapContainer || map) return;

    // Determine center and zoom based on number of peaks
    const isSinglePeak = peaks.length === 1;
    const center: [number, number] = isSinglePeak
      ? [peaks[0].latitude, peaks[0].longitude]
      : COLORADO_CENTER;
    const zoom = isSinglePeak ? SINGLE_PEAK_ZOOM : DEFAULT_ZOOM;

    // Create map
    map = L.map(mapContainer, {
      center,
      zoom,
      zoomControl: true,
    });

    // Add initial tile layer (topographic)
    const config = mapTiles[currentMapType];
    currentTileLayer = L.tileLayer(config.url, {
      attribution: config.attribution,
      maxZoom: config.maxZoom,
      minZoom: 6,
    }).addTo(map);

    // Add markers for all peaks
    updateMarkers();

    // Open popup for single peak
    if (isSinglePeak) {
      setTimeout(() => {
        const marker = markers.get(peaks[0].id);
        if (marker) marker.openPopup();
      }, 300);
    }
  }

  function updateMarkers() {
    if (!map || !L) return;

    // Clear existing markers
    markers.forEach(m => m.remove());
    markers.clear();

    // Add markers for each peak
    peaks.forEach(peak => {
      if (!L || !map) return;

      const isSummited = summitedPeakIds.has(peak.id);
      const icon = createMarkerIcon(peak, isSummited);
      if (!icon) return;

      const marker = L.marker([peak.latitude, peak.longitude], { icon })
        .addTo(map)
        .bindPopup(createPopupContent(peak, isSummited), {
          closeButton: true,
          className: 'peak-popup',
        });

      marker.on('click', () => {
        onPeakSelect?.(peak.id);
      });

      markers.set(peak.id, marker);
    });
  }

  function flyToPeak(peakId: string) {
    const peak = peaks.find(p => p.id === peakId);
    if (!peak || !map) return;

    map.flyTo([peak.latitude, peak.longitude], 12, {
      duration: 1,
    });

    const marker = markers.get(peakId);
    if (marker) {
      marker.openPopup();
    }
  }

  function updateTrailOverlays() {
    if (!map || !L) return;

    // Clear existing trail polylines
    trailPolylines.forEach(p => p.remove());
    trailPolylines = [];

    if (!showTrails || trails.length === 0) return;

    // Add trail polylines
    trails.forEach(trail => {
      if (!trail.geometry?.coordinates || !L || !map) return;

      const latLngs = trail.geometry.coordinates.map(
        coord => L!.latLng(coord[1], coord[0])
      );

      const color = classColors[trail.difficultyClass] || classColors[1];

      // Add shadow line first
      const shadow = L.polyline(latLngs, {
        color: 'white',
        weight: 5,
        opacity: 0.7,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(map);

      // Add main trail line
      const line = L.polyline(latLngs, {
        color: color,
        weight: 3,
        opacity: 0.9,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(map);

      // Add popup
      line.bindPopup(`
        <div class="peak-popup-content">
          <div class="popup-header">
            <span class="popup-class-badge" style="background:${color}">
              Class ${trail.difficultyClass}
            </span>
          </div>
          <h3 class="popup-title">${trail.peakName}</h3>
          <div class="popup-range">${trail.routeName}</div>
          <a href="/peaks/${trail.peakSlug}/${trail.routeSlug}" class="popup-button">
            View Route Details
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
        </div>
      `, { className: 'peak-popup' });

      trailPolylines.push(shadow, line);
    });
  }

  // React to summit status changes
  $effect(() => {
    if (map && L) {
      updateMarkers();
    }
  });

  // React to selected peak changes
  $effect(() => {
    if (selectedPeakId && map) {
      flyToPeak(selectedPeakId);
    }
  });

  // React to showTrails changes
  $effect(() => {
    if (map && L) {
      updateTrailOverlays();
    }
  });

  onMount(() => {
    initMap();
  });

  onDestroy(() => {
    if (map) {
      map.remove();
      map = null;
    }
  });
</script>

<style>
  .map-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .map-container {
    width: 100%;
    height: 100%;
    min-height: 400px;
    border-radius: 0.75rem;
    overflow: hidden;
  }

  /* Map Type Toggle */
  .map-type-toggle {
    position: absolute;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1000;
    display: flex;
    gap: 2px;
    padding: 4px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15), 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  :global(.dark) .map-type-toggle {
    background: #1e293b;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
  }

  .map-type-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 14px;
    border: none;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s ease;
    background: transparent;
    color: #64748b;
  }

  :global(.dark) .map-type-btn {
    color: #94a3b8;
  }

  .map-type-btn:hover {
    background: #f1f5f9;
    color: #334155;
  }

  :global(.dark) .map-type-btn:hover {
    background: #334155;
    color: #e2e8f0;
  }

  .map-type-btn.active {
    background: linear-gradient(135deg, #f97316, #fb923c);
    color: white;
    box-shadow: 0 2px 8px rgba(249, 115, 22, 0.3);
  }

  :global(.dark) .map-type-btn.active {
    background: linear-gradient(135deg, #f97316, #fb923c);
    color: white;
  }

  .map-type-btn span {
    display: none;
  }

  @media (min-width: 480px) {
    .map-type-btn span {
      display: inline;
    }
  }

  :global(.peak-marker) {
    background: transparent !important;
    border: none !important;
  }

  /* Popup wrapper */
  :global(.peak-popup .leaflet-popup-content-wrapper) {
    border-radius: 16px;
    padding: 0;
    box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.2), 0 10px 20px -10px rgba(0, 0, 0, 0.1);
    background: white;
    overflow: hidden;
  }

  :global(.dark .peak-popup .leaflet-popup-content-wrapper) {
    background: #1e293b;
    box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.5);
  }

  :global(.peak-popup .leaflet-popup-content) {
    margin: 0;
    width: auto !important;
  }

  :global(.peak-popup .leaflet-popup-tip) {
    background: white;
    box-shadow: none;
  }

  :global(.dark .peak-popup .leaflet-popup-tip) {
    background: #1e293b;
  }

  :global(.leaflet-popup-close-button) {
    color: #64748b !important;
    font-size: 20px !important;
    padding: 6px 8px !important;
    right: 4px !important;
    top: 4px !important;
  }

  :global(.dark .leaflet-popup-close-button) {
    color: #94a3b8 !important;
  }

  :global(.leaflet-popup-close-button:hover) {
    color: #0f172a !important;
  }

  :global(.dark .leaflet-popup-close-button:hover) {
    color: white !important;
  }

  /* Popup content */
  :global(.peak-popup-content) {
    font-family: 'Inter', system-ui, sans-serif;
    padding: 16px 18px;
    min-width: 220px;
  }

  :global(.popup-header) {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
  }

  :global(.popup-class-badge) {
    display: inline-flex;
    align-items: center;
    padding: 3px 10px;
    border-radius: 6px;
    font-size: 11px;
    font-weight: 600;
    color: white;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  :global(.popup-summited-badge) {
    display: inline-flex;
    align-items: center;
    padding: 3px 10px;
    border-radius: 6px;
    font-size: 11px;
    font-weight: 600;
    background: linear-gradient(135deg, #22c55e, #16a34a);
    color: white;
  }

  :global(.popup-title) {
    font-size: 18px;
    font-weight: 700;
    color: #0f172a;
    margin: 0 0 6px 0;
    line-height: 1.2;
    font-family: 'Instrument Serif', Georgia, serif;
  }

  :global(.dark .popup-title) {
    color: white;
  }

  :global(.popup-stats) {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    color: #475569;
    margin-bottom: 4px;
  }

  :global(.dark .popup-stats) {
    color: #94a3b8;
  }

  :global(.popup-elevation) {
    font-weight: 600;
    color: #0f172a;
  }

  :global(.dark .popup-elevation) {
    color: #e2e8f0;
  }

  :global(.popup-divider) {
    color: #cbd5e1;
  }

  :global(.dark .popup-divider) {
    color: #475569;
  }

  :global(.popup-rank) {
    color: #64748b;
  }

  :global(.dark .popup-rank) {
    color: #94a3b8;
  }

  :global(.popup-range) {
    font-size: 13px;
    color: #64748b;
    margin-bottom: 14px;
  }

  :global(.dark .popup-range) {
    color: #94a3b8;
  }

  :global(.popup-button) {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 10px 16px;
    border-radius: 10px;
    font-size: 13px;
    font-weight: 600;
    text-decoration: none !important;
    background: linear-gradient(135deg, #f97316, #fb923c);
    color: #ffffff !important;
    transition: all 0.2s ease;
    box-shadow: 0 2px 8px rgba(249, 115, 22, 0.3);
  }

  :global(.popup-button:visited),
  :global(.popup-button:link),
  :global(.popup-button:active) {
    color: #ffffff !important;
  }

  :global(.popup-button:hover) {
    color: #ffffff !important;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(249, 115, 22, 0.4);
  }

  :global(.popup-button svg) {
    transition: transform 0.2s ease;
  }

  :global(.popup-button:hover svg) {
    transform: translateX(2px);
  }

  /* Attribution */
  :global(.leaflet-control-attribution) {
    font-size: 10px;
    background: rgba(255, 255, 255, 0.9) !important;
    backdrop-filter: blur(4px);
    padding: 2px 6px;
    border-radius: 4px 0 0 0;
  }

  :global(.dark .leaflet-control-attribution) {
    background: rgba(30, 41, 59, 0.9) !important;
    color: #94a3b8;
  }

  :global(.dark .leaflet-control-attribution a) {
    color: #f97316;
  }

  /* Zoom controls */
  :global(.leaflet-control-zoom) {
    border: none !important;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
    border-radius: 10px !important;
    overflow: hidden;
  }

  :global(.leaflet-control-zoom a) {
    background: white !important;
    color: #475569 !important;
    border: none !important;
    width: 36px !important;
    height: 36px !important;
    line-height: 36px !important;
    font-size: 18px !important;
  }

  :global(.dark .leaflet-control-zoom a) {
    background: #1e293b !important;
    color: #e2e8f0 !important;
  }

  :global(.leaflet-control-zoom a:hover) {
    background: #f8fafc !important;
    color: #0f172a !important;
  }

  :global(.dark .leaflet-control-zoom a:hover) {
    background: #334155 !important;
    color: white !important;
  }

  :global(.leaflet-control-zoom-in) {
    border-radius: 10px 10px 0 0 !important;
  }

  :global(.leaflet-control-zoom-out) {
    border-radius: 0 0 10px 10px !important;
  }
</style>

<div class="map-wrapper">
  <div bind:this={mapContainer} class="map-container"></div>

  <!-- Map Type Toggle -->
  <div class="map-type-toggle">
    <button
      class="map-type-btn"
      class:active={currentMapType === 'topo'}
      onclick={() => switchMapType('topo')}
      title="Topographic"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
      <span>Topo</span>
    </button>
    <button
      class="map-type-btn"
      class:active={currentMapType === 'satellite'}
      onclick={() => switchMapType('satellite')}
      title="Satellite"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>Satellite</span>
    </button>
    <button
      class="map-type-btn"
      class:active={currentMapType === 'street'}
      onclick={() => switchMapType('street')}
      title="Street Map"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
      <span>Street</span>
    </button>
  </div>
</div>
