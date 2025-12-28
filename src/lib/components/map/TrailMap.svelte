<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import type { Map, Polyline, Marker, LatLngBounds, TileLayer } from 'leaflet';
  import type { TrailGeometry } from '$lib/server/gpx';

  interface Props {
    trailGeometry: TrailGeometry | null;
    trailheadCoords?: { lat: number; lng: number } | null;
    summitCoords: { lat: number; lng: number };
    difficultyClass?: number;
    peakName?: string;
    routeName?: string;
    hoveredIndex?: number | null;
    onPointHover?: (index: number | null) => void;
  }

  let {
    trailGeometry,
    trailheadCoords = null,
    summitCoords,
    difficultyClass = 1,
    peakName = '',
    routeName = '',
    hoveredIndex = null,
    onPointHover
  }: Props = $props();

  let mapContainer: HTMLDivElement;
  let map: Map | null = null;
  let trailLine: Polyline | null = null;
  let trailShadow: Polyline | null = null;
  let trailheadMarker: Marker | null = null;
  let summitMarker: Marker | null = null;
  let hoverMarker: Marker | null = null;
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

  // Difficulty class colors
  const classColors: Record<number, string> = {
    1: '#22c55e',
    2: '#3b82f6',
    3: '#eab308',
    4: '#ef4444'
  };

  const color = $derived(classColors[difficultyClass] || classColors[1]);

  function switchMapType(type: MapType) {
    if (!map || !L || type === currentMapType) return;

    if (currentTileLayer) {
      currentTileLayer.remove();
    }

    const config = mapTiles[type];
    currentTileLayer = L.tileLayer(config.url, {
      attribution: config.attribution,
      maxZoom: config.maxZoom,
      minZoom: 8
    }).addTo(map);

    currentMapType = type;
  }

  function createTrailheadIcon() {
    if (!L) return null;

    const svg = `
      <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="trailhead-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity="0.25"/>
          </filter>
        </defs>
        <g filter="url(#trailhead-shadow)">
          <circle cx="20" cy="20" r="16" fill="#16a34a" stroke="white" stroke-width="3"/>
          <text x="20" y="25" text-anchor="middle" font-size="16" font-weight="700" fill="white" font-family="system-ui, sans-serif">P</text>
        </g>
      </svg>
    `;

    return L.divIcon({
      html: svg,
      className: 'trailhead-marker',
      iconSize: [40, 40],
      iconAnchor: [20, 20],
      popupAnchor: [0, -18]
    });
  }

  function createSummitIcon() {
    if (!L) return null;

    const svg = `
      <svg width="44" height="44" viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="summit-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity="0.3"/>
          </filter>
          <linearGradient id="summit-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#fb923c"/>
            <stop offset="100%" stop-color="#ea580c"/>
          </linearGradient>
        </defs>
        <g filter="url(#summit-shadow)">
          <path d="M22 4 L40 38 L4 38 Z" fill="url(#summit-gradient)" stroke="white" stroke-width="3" stroke-linejoin="round"/>
          <path d="M22 4 L28 15 L16 15 Z" fill="rgba(255,255,255,0.9)" stroke="none"/>
          <circle cx="22" cy="26" r="6" fill="white" opacity="0.95"/>
          <path d="M19 26 L21 28 L25 23" stroke="#ea580c" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        </g>
      </svg>
    `;

    return L.divIcon({
      html: svg,
      className: 'summit-marker',
      iconSize: [44, 44],
      iconAnchor: [22, 38],
      popupAnchor: [0, -36]
    });
  }

  function createHoverIcon() {
    if (!L) return null;

    const svg = `
      <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
        <circle cx="8" cy="8" r="6" fill="${color}" stroke="white" stroke-width="2"/>
      </svg>
    `;

    return L.divIcon({
      html: svg,
      className: 'hover-marker',
      iconSize: [16, 16],
      iconAnchor: [8, 8]
    });
  }

  async function initMap() {
    if (typeof window === 'undefined') return;

    L = await import('leaflet');
    await import('leaflet/dist/leaflet.css');

    if (!mapContainer || map) return;

    // Create map centered on summit
    map = L.map(mapContainer, {
      center: [summitCoords.lat, summitCoords.lng],
      zoom: 13,
      zoomControl: true
    });

    // Add initial tile layer
    const config = mapTiles[currentMapType];
    currentTileLayer = L.tileLayer(config.url, {
      attribution: config.attribution,
      maxZoom: config.maxZoom,
      minZoom: 8
    }).addTo(map);

    // Draw trail if geometry exists
    if (trailGeometry) {
      drawTrail();
    } else {
      // Just show summit marker if no trail data
      addMarkers();
    }
  }

  function drawTrail() {
    if (!map || !L || !trailGeometry) return;

    // Convert GeoJSON coordinates to Leaflet LatLng array
    const latLngs = trailGeometry.coordinates.map(
      (coord) => L!.latLng(coord[1], coord[0])
    );

    // Add shadow line first (for contrast)
    trailShadow = L.polyline(latLngs, {
      color: 'white',
      weight: 5,
      opacity: 0.8,
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(map);

    // Add main trail line
    trailLine = L.polyline(latLngs, {
      color: color,
      weight: 3,
      opacity: 1,
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(map);

    // Add markers
    addMarkers();

    // Fit map to trail bounds with padding
    const bounds = trailLine.getBounds();
    map.fitBounds(bounds, {
      padding: [40, 40]
    });

    // Add hover interaction to trail line
    trailLine.on('mousemove', (e) => {
      if (!trailGeometry || !onPointHover) return;

      // Find closest point on trail
      const mouseLatLng = e.latlng;
      let closestIndex = 0;
      let closestDist = Infinity;

      for (let i = 0; i < trailGeometry.coordinates.length; i++) {
        const coord = trailGeometry.coordinates[i];
        const pointLatLng = L!.latLng(coord[1], coord[0]);
        const dist = mouseLatLng.distanceTo(pointLatLng);

        if (dist < closestDist) {
          closestDist = dist;
          closestIndex = i;
        }
      }

      onPointHover(closestIndex);
    });

    trailLine.on('mouseout', () => {
      onPointHover?.(null);
    });
  }

  function addMarkers() {
    if (!map || !L) return;

    // Add trailhead marker
    if (trailheadCoords) {
      const trailheadIcon = createTrailheadIcon();
      if (trailheadIcon) {
        trailheadMarker = L.marker([trailheadCoords.lat, trailheadCoords.lng], {
          icon: trailheadIcon
        })
          .addTo(map)
          .bindPopup(`
            <div class="trail-popup-content">
              <div class="trail-popup-badge trailhead">Trailhead</div>
              <div class="trail-popup-title">${routeName}</div>
              <div class="trail-popup-subtitle">Starting Point</div>
            </div>
          `, { className: 'trail-popup' });
      }
    }

    // Add summit marker
    const summitIcon = createSummitIcon();
    if (summitIcon) {
      summitMarker = L.marker([summitCoords.lat, summitCoords.lng], {
        icon: summitIcon
      })
        .addTo(map)
        .bindPopup(`
          <div class="trail-popup-content">
            <div class="trail-popup-badge summit">Summit</div>
            <div class="trail-popup-title">${peakName}</div>
            <div class="trail-popup-subtitle">Elevation ${summitCoords.lat ? 'varies' : ''}</div>
          </div>
        `, { className: 'trail-popup' });
    }
  }

  function updateHoverMarker(index: number | null) {
    if (!map || !L || !trailGeometry) return;

    // Remove existing hover marker
    if (hoverMarker) {
      hoverMarker.remove();
      hoverMarker = null;
    }

    // Add new hover marker if index is valid
    if (index !== null && index >= 0 && index < trailGeometry.coordinates.length) {
      const coord = trailGeometry.coordinates[index];
      const hoverIcon = createHoverIcon();

      if (hoverIcon) {
        hoverMarker = L.marker([coord[1], coord[0]], {
          icon: hoverIcon,
          interactive: false
        }).addTo(map);
      }
    }
  }

  // React to hoveredIndex changes from elevation profile
  $effect(() => {
    if (map && L) {
      updateHoverMarker(hoveredIndex);
    }
  });

  // React to trail geometry changes
  $effect(() => {
    if (map && L && trailGeometry) {
      // Clear existing trail
      if (trailLine) {
        trailLine.remove();
        trailLine = null;
      }
      if (trailShadow) {
        trailShadow.remove();
        trailShadow = null;
      }
      if (trailheadMarker) {
        trailheadMarker.remove();
        trailheadMarker = null;
      }
      if (summitMarker) {
        summitMarker.remove();
        summitMarker = null;
      }

      drawTrail();
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
  .trail-map-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .trail-map-container {
    width: 100%;
    height: 100%;
    min-height: 300px;
    border-radius: 0.75rem;
    overflow: hidden;
  }

  /* Map Type Toggle */
  .map-type-toggle {
    position: absolute;
    bottom: 16px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1000;
    display: flex;
    gap: 2px;
    padding: 3px;
    background: white;
    border-radius: 10px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }

  :global(.dark) .map-type-toggle {
    background: #1e293b;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
  }

  .map-type-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px 10px;
    border: none;
    border-radius: 7px;
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
    box-shadow: 0 2px 6px rgba(249, 115, 22, 0.3);
  }

  :global(.dark) .map-type-btn.active {
    background: linear-gradient(135deg, #f97316, #fb923c);
    color: white;
  }

  :global(.trailhead-marker),
  :global(.summit-marker),
  :global(.hover-marker) {
    background: transparent !important;
    border: none !important;
  }

  /* Popup wrapper */
  :global(.trail-popup .leaflet-popup-content-wrapper) {
    border-radius: 14px;
    padding: 0;
    box-shadow: 0 16px 32px -8px rgba(0, 0, 0, 0.2), 0 8px 16px -8px rgba(0, 0, 0, 0.1);
    background: white;
    overflow: hidden;
  }

  :global(.dark .trail-popup .leaflet-popup-content-wrapper) {
    background: #1e293b;
    box-shadow: 0 16px 32px -8px rgba(0, 0, 0, 0.5);
  }

  :global(.trail-popup .leaflet-popup-content) {
    margin: 0;
    width: auto !important;
  }

  :global(.trail-popup .leaflet-popup-tip) {
    background: white;
    box-shadow: none;
  }

  :global(.dark .trail-popup .leaflet-popup-tip) {
    background: #1e293b;
  }

  /* Popup content */
  :global(.trail-popup-content) {
    font-family: 'Inter', system-ui, sans-serif;
    padding: 14px 16px;
    min-width: 160px;
  }

  :global(.trail-popup-badge) {
    display: inline-flex;
    align-items: center;
    padding: 3px 10px;
    border-radius: 6px;
    font-size: 11px;
    font-weight: 600;
    color: white;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 8px;
  }

  :global(.trail-popup-badge.trailhead) {
    background: linear-gradient(135deg, #22c55e, #16a34a);
  }

  :global(.trail-popup-badge.summit) {
    background: linear-gradient(135deg, #f97316, #ea580c);
  }

  :global(.trail-popup-title) {
    font-size: 16px;
    font-weight: 700;
    color: #0f172a;
    margin: 0 0 4px 0;
    line-height: 1.2;
    font-family: 'Instrument Serif', Georgia, serif;
  }

  :global(.dark .trail-popup-title) {
    color: white;
  }

  :global(.trail-popup-subtitle) {
    font-size: 12px;
    color: #64748b;
  }

  :global(.dark .trail-popup-subtitle) {
    color: #94a3b8;
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
</style>

<div class="trail-map-wrapper">
  <div bind:this={mapContainer} class="trail-map-container"></div>

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
    </button>
  </div>
</div>
