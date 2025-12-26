<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import type { Map, Marker, Polyline } from 'leaflet';

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
  let L: typeof import('leaflet') | null = null;

  // Colorado 14ers center point
  const COLORADO_CENTER: [number, number] = [39.1, -106.2];
  const DEFAULT_ZOOM = 8;
  const SINGLE_PEAK_ZOOM = 12;

  // Difficulty class colors
  const classColors: Record<number, string> = {
    1: '#22c55e', // green
    2: '#3b82f6', // blue
    3: '#eab308', // yellow
    4: '#ef4444', // red
  };

  function getMarkerColor(peak: Peak): string {
    return classColors[peak.difficultyClass || 1] || classColors[1];
  }

  function createMarkerIcon(peak: Peak, isSummited: boolean) {
    if (!L) return null;

    const color = getMarkerColor(peak);
    const size = isSummited ? 12 : 10;
    const fillOpacity = isSummited ? 1 : 0.3;
    const strokeWidth = isSummited ? 2 : 1.5;

    const svgIcon = `
      <svg width="${size * 2}" height="${size * 2}" viewBox="0 0 ${size * 2} ${size * 2}" xmlns="http://www.w3.org/2000/svg">
        <circle
          cx="${size}"
          cy="${size}"
          r="${size - 2}"
          fill="${isSummited ? color : 'white'}"
          fill-opacity="${fillOpacity}"
          stroke="${color}"
          stroke-width="${strokeWidth}"
        />
        ${isSummited ? `
          <path
            d="M${size - 3} ${size}L${size - 1} ${size + 2}L${size + 3} ${size - 2}"
            stroke="white"
            stroke-width="1.5"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        ` : ''}
      </svg>
    `;

    return L.divIcon({
      html: svgIcon,
      className: 'peak-marker',
      iconSize: [size * 2, size * 2],
      iconAnchor: [size, size],
    });
  }

  function createPopupContent(peak: Peak, isSummited: boolean): string {
    const statusBadge = isSummited
      ? '<span style="background:#22c55e;color:white;padding:2px 6px;border-radius:4px;font-size:11px;margin-left:8px;">Summited</span>'
      : '';

    return `
      <div style="min-width:180px;font-family:system-ui,sans-serif;">
        <div style="font-weight:600;font-size:14px;margin-bottom:4px;">
          ${peak.name}${statusBadge}
        </div>
        <div style="color:#64748b;font-size:12px;margin-bottom:8px;">
          ${peak.elevation.toLocaleString()}' · Rank #${peak.rank}
        </div>
        <div style="color:#64748b;font-size:11px;margin-bottom:8px;">
          ${peak.range}
        </div>
        <a
          href="/peaks/${peak.slug}"
          style="display:inline-block;background:linear-gradient(to right,#f97316,#fb923c);color:white;padding:6px 12px;border-radius:6px;text-decoration:none;font-size:12px;font-weight:500;"
        >
          View Details →
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

    // Add OpenTopoMap tiles (topographic style - great for hiking)
    L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
      maxZoom: 17,
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
        <div style="font-family: system-ui, sans-serif; min-width: 160px;">
          <div style="font-weight: 600; font-size: 14px; margin-bottom: 4px;">${trail.peakName}</div>
          <div style="color: #64748b; font-size: 12px; margin-bottom: 8px;">${trail.routeName}</div>
          <a
            href="/peaks/${trail.peakSlug}/${trail.routeSlug}"
            style="display: inline-block; background: linear-gradient(to right, #f97316, #fb923c); color: white; padding: 6px 12px; border-radius: 6px; text-decoration: none; font-size: 12px; font-weight: 500;"
          >
            View Route →
          </a>
        </div>
      `);

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
  .map-container {
    width: 100%;
    height: 100%;
    min-height: 400px;
    border-radius: 0.75rem;
    overflow: hidden;
  }

  :global(.peak-marker) {
    background: transparent !important;
    border: none !important;
  }

  :global(.peak-popup .leaflet-popup-content-wrapper) {
    border-radius: 12px;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  }

  :global(.peak-popup .leaflet-popup-tip) {
    box-shadow: none;
  }

  :global(.leaflet-control-attribution) {
    font-size: 10px;
    background: rgba(255, 255, 255, 0.8) !important;
    backdrop-filter: blur(4px);
  }

  :global(.dark .leaflet-control-attribution) {
    background: rgba(30, 41, 59, 0.8) !important;
    color: #94a3b8;
  }

  :global(.dark .leaflet-control-attribution a) {
    color: #f97316;
  }
</style>

<div bind:this={mapContainer} class="map-container"></div>
