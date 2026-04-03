<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { PUBLIC_MAPTILER_API_KEY } from '$env/static/public';
  import type { TrailGeometry } from '$lib/server/gpx';
  import type { ForecastResponse } from '$lib/types/database';
  import type { Map, Marker } from 'maplibre-gl';
  import {
    buildTerrainStyle,
    buildRouteLayerStyle,
    markerSvgs,
    computeTrailBearing,
    computeTrailCenter,
    classColors
  } from './terrain-styles';
  import { computeOverviewCamera, computeBirdsEyeCamera } from './camera-presets';
  import { findTreelinePoint, findCruxPoint } from './waypoint-utils';
  import { isWebGLSupported } from '$lib/utils/webgl';
  import { startFlythrough, type FlythroughControls as FlythroughHandle } from './flythrough';
  import { buildWeatherLayers } from './weather-overlay';
  import CameraControls from './CameraControls.svelte';
  import FlythroughControls from './FlythroughControls.svelte';
  import ProUpsellOverlay from './ProUpsellOverlay.svelte';

  interface TraceInfo {
    id: string;
    uploaderName: string;
    uploaderId: string;
    voteCount: number;
    userVoted: boolean;
    trailGeometry: TrailGeometry;
    storagePath: string;
    pointCount: number;
    distanceMiles: number | null;
    elevationGain: number | null;
  }

  interface Props {
    trailGeometry: TrailGeometry | null;
    summitCoords: { lat: number; lng: number };
    trailheadCoords?: { lat: number; lng: number } | null;
    difficultyClass?: number;
    peakName?: string;
    routeName?: string;
    hoveredIndex?: number | null;
    onPointHover?: (index: number | null) => void;
    isPro?: boolean;
    onWebGLUnsupported?: () => void;
    allTraces?: TraceInfo[];
    forecast?: ForecastResponse | null;
  }

  let {
    trailGeometry,
    summitCoords,
    trailheadCoords = null,
    difficultyClass = 1,
    peakName = '',
    routeName = '',
    hoveredIndex = null,
    onPointHover,
    isPro = false,
    onWebGLUnsupported,
    allTraces = [],
    forecast = null
  }: Props = $props();

  let mapContainer: HTMLDivElement;
  let map: Map | null = null;
  let summitMarker: Marker | null = null;
  let trailheadMarker: Marker | null = null;
  let hoverMarker: Marker | null = null;
  let waypointMarkers: Marker[] = [];
  let maplibregl: typeof import('maplibre-gl') | null = null;
  let isLoaded = $state(false);
  let loadError = $state<string | null>(null);

  // Store initial camera for reset
  let initialCamera: { center: [number, number]; zoom: number; pitch: number; bearing: number } | null = null;

  // Flythrough state
  let flythroughActive = $state(false);
  let flythroughPlaying = $state(false);
  let flythroughSpeed = $state(1);
  let flythroughProgress = $state(0);
  let flythroughHandle: FlythroughHandle | null = null;
  let showUpsell = $state(false);
  let upsellFeature = $state<'flythrough' | 'traces_3d' | 'weather_3d'>('flythrough');
  let teaserTimeoutId: ReturnType<typeof setTimeout> | null = null;

  // Traces + weather overlay state
  let tracesVisible = $state(false);
  let weatherVisible = $state(false);

  const traceColors = ['#E76F51', '#2A9D8F', '#E9C46A', '#264653', '#F4A261', '#8338EC', '#FF6B6B', '#06D6A0'];

  const hasTraces = $derived(allTraces.length > 0);
  const hasForecast = $derived(!!forecast);

  const waypointSvgs = {
    treeline: `<svg width="36" height="36" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="wp-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="1.5" flood-opacity="0.25"/>
        </filter>
      </defs>
      <g filter="url(#wp-shadow)">
        <circle cx="18" cy="18" r="14" fill="#2D6A4F" stroke="white" stroke-width="2.5"/>
        <path d="M18 8 L18 28 M14 14 L18 10 L22 14 M12 20 L18 14 L24 20 M10 26 L18 18 L26 26" stroke="white" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      </g>
    </svg>`,
    crux: `<svg width="36" height="36" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="crux-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="1.5" flood-opacity="0.25"/>
        </filter>
      </defs>
      <g filter="url(#crux-shadow)">
        <path d="M18 4 L32 28 L4 28 Z" fill="#D97706" stroke="white" stroke-width="2.5" stroke-linejoin="round"/>
        <path d="M18 13 L18 20" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
        <circle cx="18" cy="24" r="1.5" fill="white"/>
      </g>
    </svg>`
  };

  // Detect dark mode
  const isDark = $derived(
    typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
  );

  function createMarkerElement(svg: string, size: number): HTMLDivElement {
    const el = document.createElement('div');
    el.innerHTML = svg;
    el.style.width = `${size}px`;
    el.style.height = `${size}px`;
    el.style.cursor = 'pointer';
    return el;
  }

  function createHoverElement(): HTMLDivElement {
    const color = classColors[difficultyClass] || classColors[1];
    const el = document.createElement('div');
    el.innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
      <circle cx="8" cy="8" r="6" fill="${color}" stroke="white" stroke-width="2"/>
    </svg>`;
    el.style.width = '16px';
    el.style.height = '16px';
    return el;
  }

  async function initMap() {
    if (typeof window === 'undefined' || !mapContainer) return;

    if (!isWebGLSupported()) {
      onWebGLUnsupported?.();
      loadError = '3D terrain requires WebGL support';
      return;
    }

    if (!PUBLIC_MAPTILER_API_KEY) {
      loadError = 'MapTiler API key not configured';
      return;
    }

    try {
      maplibregl = await import('maplibre-gl');
      await import('maplibre-gl/dist/maplibre-gl.css');

      const mode = isDark ? 'dark' : 'light';
      const style = buildTerrainStyle(PUBLIC_MAPTILER_API_KEY, mode);

      // Compute initial camera from trail data
      const { center, zoom } = trailGeometry
        ? computeTrailCenter(trailGeometry.coordinates)
        : { center: [summitCoords.lng, summitCoords.lat] as [number, number], zoom: 13 };

      const bearing = trailGeometry
        ? computeTrailBearing(trailGeometry.coordinates)
        : 0;

      initialCamera = { center, zoom, pitch: 60, bearing };

      map = new maplibregl.Map({
        container: mapContainer,
        style,
        center,
        zoom,
        pitch: 60,
        bearing,
        maxPitch: 85
      });

      map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'top-right');

      map.on('load', () => {
        addRouteLayers();
        addMarkers();
        addWaypointMarkers();
        isLoaded = true;
      });

      map.on('error', (e) => {
        console.error('MapLibre error:', e.error?.message || e);
      });
    } catch (err) {
      console.error('Failed to initialize 3D viewer:', err);
      loadError = 'Failed to load 3D terrain viewer';
    }
  }

  function addRouteLayers() {
    if (!map || !trailGeometry) return;

    // Add route GeoJSON source
    map.addSource('route', {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: trailGeometry.coordinates
        }
      }
    });

    const { outlineLayer, lineLayer } = buildRouteLayerStyle(difficultyClass);
    map.addLayer(outlineLayer as Parameters<Map['addLayer']>[0]);
    map.addLayer(lineLayer as Parameters<Map['addLayer']>[0]);

    // Hover interaction on route line
    map.on('mousemove', 'route-line', (e) => {
      if (!trailGeometry || !onPointHover || !e.lngLat) return;

      const { lng, lat } = e.lngLat;
      let closestIndex = 0;
      let closestDist = Infinity;

      for (let i = 0; i < trailGeometry.coordinates.length; i++) {
        const [cLng, cLat] = trailGeometry.coordinates[i];
        const dist = (lng - cLng) ** 2 + (lat - cLat) ** 2;
        if (dist < closestDist) {
          closestDist = dist;
          closestIndex = i;
        }
      }

      onPointHover(closestIndex);
      if (map) map.getCanvas().style.cursor = 'pointer';
    });

    map.on('mouseleave', 'route-line', () => {
      onPointHover?.(null);
      if (map) map.getCanvas().style.cursor = '';
    });
  }

  function addMarkers() {
    if (!map || !maplibregl) return;

    // Summit marker
    const summitEl = createMarkerElement(markerSvgs.summit, 44);
    summitMarker = new maplibregl.Marker({ element: summitEl, anchor: 'bottom' })
      .setLngLat([summitCoords.lng, summitCoords.lat])
      .setPopup(
        new maplibregl.Popup({ offset: 25, className: 'terrain-popup' }).setHTML(`
          <div class="terrain-popup-content">
            <div class="terrain-popup-badge summit">Summit</div>
            <div class="terrain-popup-title">${peakName}</div>
          </div>
        `)
      )
      .addTo(map);

    // Trailhead marker
    if (trailheadCoords) {
      const trailheadEl = createMarkerElement(markerSvgs.trailhead, 40);
      trailheadMarker = new maplibregl.Marker({ element: trailheadEl, anchor: 'center' })
        .setLngLat([trailheadCoords.lng, trailheadCoords.lat])
        .setPopup(
          new maplibregl.Popup({ offset: 20, className: 'terrain-popup' }).setHTML(`
            <div class="terrain-popup-content">
              <div class="terrain-popup-badge trailhead">Trailhead</div>
              <div class="terrain-popup-title">${routeName}</div>
            </div>
          `)
        )
        .addTo(map);
    }
  }

  function addWaypointMarkers() {
    if (!map || !maplibregl || !trailGeometry) return;

    const coords = trailGeometry.coordinates;

    const treeline = findTreelinePoint(coords);
    if (treeline) {
      const [lng, lat] = coords[treeline.index];
      const el = createMarkerElement(waypointSvgs.treeline, 36);
      const marker = new maplibregl.Marker({ element: el, anchor: 'bottom' })
        .setLngLat([lng, lat])
        .setPopup(
          new maplibregl.Popup({ offset: 20, className: 'terrain-popup' }).setHTML(`
            <div class="terrain-popup-content">
              <div class="terrain-popup-badge treeline">Treeline</div>
              <div class="terrain-popup-title">${treeline.elevation.toLocaleString()}'</div>
            </div>
          `)
        )
        .addTo(map);
      waypointMarkers.push(marker);
    }

    const crux = findCruxPoint(coords, difficultyClass);
    if (crux) {
      const [lng, lat] = coords[crux.index];
      const el = createMarkerElement(waypointSvgs.crux, 36);
      const marker = new maplibregl.Marker({ element: el, anchor: 'bottom' })
        .setLngLat([lng, lat])
        .setPopup(
          new maplibregl.Popup({ offset: 20, className: 'terrain-popup' }).setHTML(`
            <div class="terrain-popup-content">
              <div class="terrain-popup-badge crux">Crux</div>
              <div class="terrain-popup-title">${crux.elevation.toLocaleString()}'</div>
            </div>
          `)
        )
        .addTo(map);
      waypointMarkers.push(marker);
    }
  }

  function addTraceLayers() {
    if (!map || !tracesVisible || allTraces.length === 0) return;

    for (let i = 0; i < allTraces.length; i++) {
      const trace = allTraces[i];
      const sourceId = `trace-${trace.id}`;
      const lineId = `trace-line-${trace.id}`;
      const color = traceColors[i % traceColors.length];

      if (map.getSource(sourceId)) continue;

      map.addSource(sourceId, {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: trace.trailGeometry.coordinates
          }
        }
      });

      map.addLayer({
        id: lineId,
        type: 'line',
        source: sourceId,
        paint: {
          'line-color': color,
          'line-width': 2.5,
          'line-opacity': i === 0 ? 0.9 : 0.3
        },
        layout: {
          'line-cap': 'round',
          'line-join': 'round'
        }
      });
    }
  }

  function removeTraceLayers() {
    if (!map) return;
    for (const trace of allTraces) {
      const lineId = `trace-line-${trace.id}`;
      const sourceId = `trace-${trace.id}`;
      if (map.getLayer(lineId)) map.removeLayer(lineId);
      if (map.getSource(sourceId)) map.removeSource(sourceId);
    }
  }

  function addWeatherLayers() {
    if (!map || !weatherVisible || !forecast || !trailGeometry) return;

    const { layers, sources } = buildWeatherLayers(forecast, trailGeometry);

    for (const src of sources) {
      if (map.getSource(src.id)) continue;
      map.addSource(src.id, { type: 'geojson', data: src.data });
    }

    for (const layer of layers) {
      if (map.getLayer(layer.id)) continue;
      map.addLayer({
        id: layer.id,
        type: layer.type,
        source: layer.source,
        paint: layer.paint
      } as Parameters<Map['addLayer']>[0]);
    }
  }

  function removeWeatherLayers() {
    if (!map || !forecast || !trailGeometry) return;
    const { layers, sources } = buildWeatherLayers(forecast, trailGeometry);
    for (const layer of layers) {
      if (map.getLayer(layer.id)) map.removeLayer(layer.id);
    }
    for (const src of sources) {
      if (map.getSource(src.id)) map.removeSource(src.id);
    }
  }

  function handleToggleTraces() {
    if (!isPro) {
      upsellFeature = 'traces_3d';
      showUpsell = true;
      return;
    }
    tracesVisible = !tracesVisible;
    if (tracesVisible) {
      addTraceLayers();
    } else {
      removeTraceLayers();
    }
  }

  function handleToggleWeather() {
    if (!isPro) {
      upsellFeature = 'weather_3d';
      showUpsell = true;
      return;
    }
    weatherVisible = !weatherVisible;
    if (weatherVisible) {
      addWeatherLayers();
    } else {
      removeWeatherLayers();
    }
  }

  function flyToPreset(preset: 'overview' | 'birdsEye' | 'reset') {
    if (!map || !trailGeometry) return;

    let camera: { center: [number, number]; zoom: number; pitch: number; bearing: number };

    if (preset === 'reset' && initialCamera) {
      camera = initialCamera;
    } else if (preset === 'overview') {
      camera = computeOverviewCamera(trailGeometry.coordinates);
    } else {
      camera = computeBirdsEyeCamera(trailGeometry.coordinates);
    }

    map.flyTo({
      center: camera.center,
      zoom: camera.zoom,
      pitch: camera.pitch,
      bearing: camera.bearing,
      duration: 1500,
      essential: true
    });
  }

  function returnToOverview() {
    if (!map || !trailGeometry) return;
    const camera = computeOverviewCamera(trailGeometry.coordinates);
    map.flyTo({
      center: camera.center,
      zoom: camera.zoom,
      pitch: camera.pitch,
      bearing: camera.bearing,
      duration: 1200,
      essential: true
    });
  }

  function stopFlythrough() {
    if (flythroughHandle) {
      flythroughHandle.stop();
      flythroughHandle = null;
    }
    if (teaserTimeoutId !== null) {
      clearTimeout(teaserTimeoutId);
      teaserTimeoutId = null;
    }
    flythroughActive = false;
    flythroughPlaying = false;
    flythroughProgress = 0;
    onPointHover?.(null);
  }

  function handleFlythroughRequest() {
    if (!map || !trailGeometry) return;

    if (isPro) {
      startFullFlythrough();
    } else {
      startTeaserFlythrough();
    }
  }

  function startFullFlythrough() {
    if (!map || !trailGeometry) return;

    stopFlythrough();
    flythroughActive = true;
    flythroughPlaying = true;
    flythroughSpeed = 1;
    flythroughProgress = 0;

    flythroughHandle = startFlythrough({
      map,
      coordinates: trailGeometry.coordinates,
      speed: flythroughSpeed,
      onProgress(progress, pointIndex) {
        flythroughProgress = progress;
        onPointHover?.(pointIndex);
      },
      onComplete() {
        flythroughPlaying = false;
        flythroughProgress = 1;
        setTimeout(() => {
          stopFlythrough();
          returnToOverview();
        }, 500);
      }
    });
  }

  function startTeaserFlythrough() {
    if (!map || !trailGeometry) return;

    stopFlythrough();
    flythroughActive = true;
    flythroughPlaying = true;

    const teaserCoords = trailGeometry.coordinates.slice(
      0,
      Math.min(20, trailGeometry.coordinates.length)
    ) as [number, number, number][];

    flythroughHandle = startFlythrough({
      map,
      coordinates: teaserCoords,
      speed: 0.8,
      onProgress(progress, pointIndex) {
        flythroughProgress = progress;
        onPointHover?.(pointIndex);
      },
      onComplete() {
        flythroughPlaying = false;
        showUpsell = true;
      }
    });

    // Safety fallback: show upsell after 3s regardless
    teaserTimeoutId = setTimeout(() => {
      if (flythroughHandle && !showUpsell) {
        flythroughHandle.stop();
        flythroughPlaying = false;
        showUpsell = true;
      }
    }, 3000);
  }

  function handleUpsellDismiss() {
    showUpsell = false;
    if (upsellFeature === 'flythrough') {
      stopFlythrough();
      returnToOverview();
    }
  }

  function handleFlythroughPlay() {
    if (flythroughHandle) {
      flythroughHandle.resume();
      flythroughPlaying = true;
    } else {
      startFullFlythrough();
    }
  }

  function handleFlythroughPause() {
    if (flythroughHandle) {
      flythroughHandle.pause();
      flythroughPlaying = false;
    }
  }

  function handleFlythroughStop() {
    stopFlythrough();
    returnToOverview();
  }

  function handleSpeedChange(newSpeed: number) {
    flythroughSpeed = newSpeed;
    // Restart with new speed (simplest approach — preserves position via fresh start)
    if (flythroughHandle && map && trailGeometry) {
      flythroughHandle.stop();
      flythroughHandle = startFlythrough({
        map,
        coordinates: trailGeometry.coordinates,
        speed: newSpeed,
        onProgress(progress, pointIndex) {
          flythroughProgress = progress;
          onPointHover?.(pointIndex);
        },
        onComplete() {
          flythroughPlaying = false;
          flythroughProgress = 1;
          setTimeout(() => {
            stopFlythrough();
            returnToOverview();
          }, 500);
        }
      });
    }
  }

  function updateHoverMarker(index: number | null) {
    if (!map || !maplibregl || !trailGeometry) return;

    if (hoverMarker) {
      hoverMarker.remove();
      hoverMarker = null;
    }

    if (index !== null && index >= 0 && index < trailGeometry.coordinates.length) {
      const [lng, lat] = trailGeometry.coordinates[index];
      const el = createHoverElement();
      hoverMarker = new maplibregl.Marker({ element: el, anchor: 'center' })
        .setLngLat([lng, lat])
        .addTo(map);
    }
  }

  // Sync hover marker with external hoveredIndex
  $effect(() => {
    if (isLoaded) {
      updateHoverMarker(hoveredIndex);
    }
  });

  // Handle dark mode toggle
  $effect(() => {
    if (map && isLoaded && PUBLIC_MAPTILER_API_KEY) {
      const mode = isDark ? 'dark' : 'light';
      const style = buildTerrainStyle(PUBLIC_MAPTILER_API_KEY, mode);
      map.setStyle(style);
      map.once('style.load', () => {
        addRouteLayers();
        addMarkers();
        addWaypointMarkers();
        if (tracesVisible) addTraceLayers();
        if (weatherVisible) addWeatherLayers();
      });
    }
  });

  onMount(() => {
    initMap();
  });

  onDestroy(() => {
    stopFlythrough();
    if (hoverMarker) hoverMarker.remove();
    if (summitMarker) summitMarker.remove();
    if (trailheadMarker) trailheadMarker.remove();
    for (const m of waypointMarkers) m.remove();
    waypointMarkers = [];
    if (map) {
      map.remove();
      map = null;
    }
  });
</script>

<style>
  .terrain-viewer-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .terrain-map-container {
    width: 100%;
    height: 100%;
    min-height: 300px;
    border-radius: 0.75rem;
    overflow: hidden;
  }

  /* Loading skeleton */
  .terrain-loading {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
    border-radius: 0.75rem;
    z-index: 10;
    transition: opacity 0.4s ease;
  }

  :global(.dark) .terrain-loading {
    background: linear-gradient(135deg, #1e293b, #0f172a);
  }

  .terrain-loading.loaded {
    opacity: 0;
    pointer-events: none;
  }

  .terrain-loading-spinner {
    width: 32px;
    height: 32px;
    border: 3px solid #cbd5e1;
    border-top-color: #C8A55C;
    border-radius: 50%;
    animation: terrain-spin 0.8s linear infinite;
  }

  :global(.dark) .terrain-loading-spinner {
    border-color: #475569;
    border-top-color: #C8A55C;
  }

  @keyframes terrain-spin {
    to { transform: rotate(360deg); }
  }

  .terrain-loading-text {
    font-size: 13px;
    color: #64748b;
    font-family: 'Inter', system-ui, sans-serif;
  }

  :global(.dark) .terrain-loading-text {
    color: #94a3b8;
  }

  /* Error state */
  .terrain-error {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
    border-radius: 0.75rem;
  }

  :global(.dark) .terrain-error {
    background: linear-gradient(135deg, #1e293b, #0f172a);
  }

  .terrain-error-text {
    font-size: 14px;
    color: #64748b;
    font-family: 'Inter', system-ui, sans-serif;
  }

  /* Popup styling (matches TrailMap) */
  :global(.terrain-popup .maplibregl-popup-content) {
    border-radius: 14px;
    padding: 0;
    box-shadow: 0 16px 32px -8px rgba(0, 0, 0, 0.2), 0 8px 16px -8px rgba(0, 0, 0, 0.1);
    background: white;
    overflow: hidden;
  }

  :global(.dark .terrain-popup .maplibregl-popup-content) {
    background: #1e293b;
    box-shadow: 0 16px 32px -8px rgba(0, 0, 0, 0.5);
  }

  :global(.terrain-popup .maplibregl-popup-tip) {
    border-top-color: white;
  }

  :global(.dark .terrain-popup .maplibregl-popup-tip) {
    border-top-color: #1e293b;
  }

  :global(.terrain-popup-content) {
    font-family: 'Inter', system-ui, sans-serif;
    padding: 14px 16px;
    min-width: 140px;
  }

  :global(.terrain-popup-badge) {
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

  :global(.terrain-popup-badge.trailhead) {
    background: linear-gradient(135deg, #5A9E78, #3A8168);
  }

  :global(.terrain-popup-badge.summit) {
    background: linear-gradient(135deg, #C8A55C, #A8873A);
  }

  :global(.terrain-popup-badge.treeline) {
    background: linear-gradient(135deg, #2D6A4F, #1B4332);
  }

  :global(.terrain-popup-badge.crux) {
    background: linear-gradient(135deg, #D97706, #B45309);
  }

  :global(.terrain-popup-title) {
    font-size: 16px;
    font-weight: 700;
    color: #0f172a;
    line-height: 1.2;
    font-family: 'Instrument Serif', Georgia, serif;
  }

  :global(.dark .terrain-popup-title) {
    color: white;
  }

  /* Navigation controls styling */
  :global(.terrain-map-container .maplibregl-ctrl-group) {
    border: none !important;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
    border-radius: 10px !important;
    overflow: hidden;
  }

  :global(.terrain-map-container .maplibregl-ctrl-group button) {
    background: white !important;
    border: none !important;
    width: 36px !important;
    height: 36px !important;
  }

  :global(.dark .terrain-map-container .maplibregl-ctrl-group button) {
    background: #1e293b !important;
  }

  :global(.terrain-map-container .maplibregl-ctrl-group button:hover) {
    background: #f8fafc !important;
  }

  :global(.dark .terrain-map-container .maplibregl-ctrl-group button:hover) {
    background: #334155 !important;
  }

  :global(.terrain-map-container .maplibregl-ctrl-group button .maplibregl-ctrl-icon) {
    filter: none;
  }

  :global(.dark .terrain-map-container .maplibregl-ctrl-group button .maplibregl-ctrl-icon) {
    filter: invert(1);
  }

  /* Attribution */
  :global(.terrain-map-container .maplibregl-ctrl-attrib) {
    font-size: 10px;
    background: rgba(255, 255, 255, 0.9) !important;
    backdrop-filter: blur(4px);
  }

  :global(.dark .terrain-map-container .maplibregl-ctrl-attrib) {
    background: rgba(30, 41, 59, 0.9) !important;
    color: #94a3b8;
  }
</style>

<div class="terrain-viewer-wrapper">
  <!-- Loading overlay -->
  <div class="terrain-loading" class:loaded={isLoaded && !loadError}>
    {#if loadError}
      <div class="terrain-error">
        <svg class="h-10 w-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <span class="terrain-error-text">{loadError}</span>
      </div>
    {:else}
      <div class="terrain-loading-spinner"></div>
      <span class="terrain-loading-text">Loading 3D terrain...</span>
    {/if}
  </div>

  <div bind:this={mapContainer} class="terrain-map-container"></div>

  {#if isLoaded && trailGeometry}
    {#if flythroughActive && !showUpsell && isPro}
      <FlythroughControls
        playing={flythroughPlaying}
        speed={flythroughSpeed}
        progress={flythroughProgress}
        onPlay={handleFlythroughPlay}
        onPause={handleFlythroughPause}
        onStop={handleFlythroughStop}
        onSpeedChange={handleSpeedChange}
      />
    {:else}
      <CameraControls
        onPreset={flyToPreset}
        {isPro}
        onFlythrough={handleFlythroughRequest}
        {tracesVisible}
        {weatherVisible}
        {hasTraces}
        {hasForecast}
        onToggleTraces={handleToggleTraces}
        onToggleWeather={handleToggleWeather}
      />
    {/if}
  {/if}

  {#if showUpsell}
    <ProUpsellOverlay feature={upsellFeature} onDismiss={handleUpsellDismiss} />
  {/if}
</div>
