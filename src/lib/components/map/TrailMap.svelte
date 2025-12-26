<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import type { Map, Polyline, Marker, LatLngBounds } from 'leaflet';
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
  let L: typeof import('leaflet') | null = null;

  // Difficulty class colors
  const classColors: Record<number, string> = {
    1: '#22c55e',
    2: '#3b82f6',
    3: '#eab308',
    4: '#ef4444'
  };

  const color = $derived(classColors[difficultyClass] || classColors[1]);

  function createTrailheadIcon() {
    if (!L) return null;

    const svg = `
      <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="14" fill="#16a34a" stroke="white" stroke-width="2"/>
        <path d="M16 8v12M12 16l4 4 4-4M10 22h12" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      </svg>
    `;

    return L.divIcon({
      html: svg,
      className: 'trailhead-marker',
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });
  }

  function createSummitIcon() {
    if (!L) return null;

    const svg = `
      <svg width="36" height="36" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 4L4 32h28L18 4z" fill="#f97316" stroke="white" stroke-width="2"/>
        <path d="M18 14l-6 12h12l-6-12z" fill="white" opacity="0.3"/>
      </svg>
    `;

    return L.divIcon({
      html: svg,
      className: 'summit-marker',
      iconSize: [36, 36],
      iconAnchor: [18, 32]
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

    // Add OpenTopoMap tiles (topographic style - great for hiking)
    L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
      maxZoom: 17,
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
            <div style="font-family: system-ui, sans-serif;">
              <div style="font-weight: 600; font-size: 13px;">Trailhead</div>
              <div style="color: #64748b; font-size: 12px;">${routeName}</div>
            </div>
          `);
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
          <div style="font-family: system-ui, sans-serif;">
            <div style="font-weight: 600; font-size: 14px;">${peakName}</div>
            <div style="color: #64748b; font-size: 12px;">Summit</div>
          </div>
        `);
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
  .trail-map-container {
    width: 100%;
    height: 100%;
    min-height: 300px;
    border-radius: 0.75rem;
    overflow: hidden;
  }

  :global(.trailhead-marker),
  :global(.summit-marker),
  :global(.hover-marker) {
    background: transparent !important;
    border: none !important;
  }

  :global(.leaflet-popup-content-wrapper) {
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  :global(.dark .leaflet-control-attribution) {
    background: rgba(30, 41, 59, 0.8) !important;
    color: #94a3b8;
  }

  :global(.dark .leaflet-control-attribution a) {
    color: #f97316;
  }
</style>

<div bind:this={mapContainer} class="trail-map-container"></div>
