import type { StyleSpecification } from 'maplibre-gl';

/** Difficulty class colors — matches TrailMap.svelte */
export const classColors: Record<number, string> = {
  1: '#5A9E78',
  2: '#4A7FB5',
  3: '#C4943F',
  4: '#B84C4C'
};

/**
 * Build a MapLibre style with MapTiler terrain DEM + satellite/topo imagery.
 * Returns a full StyleSpecification ready to pass to `new Map({ style })`.
 */
export function buildTerrainStyle(
  apiKey: string,
  mode: 'light' | 'dark'
): StyleSpecification {
  const isDark = mode === 'dark';

  return {
    version: 8,
    sources: {
      'maptiler-satellite': {
        type: 'raster',
        url: `https://api.maptiler.com/tiles/satellite-v2/tiles.json?key=${apiKey}`,
        tileSize: 256
      },
      'maptiler-terrain': {
        type: 'raster-dem',
        url: `https://api.maptiler.com/tiles/terrain-rgb-v2/tiles.json?key=${apiKey}`,
        tileSize: 256
      },
      'maptiler-topo': {
        type: 'raster',
        url: `https://api.maptiler.com/maps/topo-v2/tiles.json?key=${apiKey}`,
        tileSize: 256
      }
    },
    terrain: {
      source: 'maptiler-terrain',
      exaggeration: 1.3
    },
    sky: isDark
      ? { 'sky-color': '#0f172a', 'horizon-color': '#1e293b', 'fog-color': '#1e293b' }
      : { 'sky-color': '#87CEEB', 'horizon-color': '#c9daea', 'fog-color': '#e8ecf1' },
    layers: [
      // Base layer: satellite in light mode, dark topo in dark mode
      isDark
        ? {
            id: 'topo-base',
            type: 'raster' as const,
            source: 'maptiler-topo',
            paint: {
              'raster-brightness-max': 0.35,
              'raster-saturation': -0.4
            }
          }
        : {
            id: 'satellite-base',
            type: 'raster' as const,
            source: 'maptiler-satellite',
            paint: {}
          }
    ]
  };
}

/**
 * Build GeoJSON source + layer specs for the route line.
 */
export function buildRouteLayerStyle(difficultyClass: number) {
  const color = classColors[difficultyClass] || classColors[1];

  return {
    outlineLayer: {
      id: 'route-outline',
      type: 'line' as const,
      source: 'route',
      paint: {
        'line-color': '#ffffff',
        'line-width': 5,
        'line-opacity': 0.8
      },
      layout: {
        'line-cap': 'round' as const,
        'line-join': 'round' as const
      }
    },
    lineLayer: {
      id: 'route-line',
      type: 'line' as const,
      source: 'route',
      paint: {
        'line-color': color,
        'line-width': 3,
        'line-opacity': 1
      },
      layout: {
        'line-cap': 'round' as const,
        'line-join': 'round' as const
      }
    }
  };
}

/**
 * SVG data URIs for summit and trailhead markers.
 * These match the existing TrailMap.svelte marker designs.
 */
export const markerSvgs = {
  summit: `<svg width="44" height="44" viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="summit-shadow-3d" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity="0.3"/>
      </filter>
      <linearGradient id="summit-gradient-3d" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#D4BC7E"/>
        <stop offset="100%" stop-color="#A8873A"/>
      </linearGradient>
    </defs>
    <g filter="url(#summit-shadow-3d)">
      <path d="M22 4 L40 38 L4 38 Z" fill="url(#summit-gradient-3d)" stroke="white" stroke-width="3" stroke-linejoin="round"/>
      <path d="M22 4 L28 15 L16 15 Z" fill="rgba(255,255,255,0.9)" stroke="none"/>
      <circle cx="22" cy="26" r="6" fill="white" opacity="0.95"/>
      <path d="M19 26 L21 28 L25 23" stroke="#A8873A" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    </g>
  </svg>`,

  trailhead: `<svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="trailhead-shadow-3d" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity="0.25"/>
      </filter>
    </defs>
    <g filter="url(#trailhead-shadow-3d)">
      <circle cx="20" cy="20" r="16" fill="#3A8168" stroke="white" stroke-width="3"/>
      <text x="20" y="25" text-anchor="middle" font-size="16" font-weight="700" fill="white" font-family="system-ui, sans-serif">P</text>
    </g>
  </svg>`
};

/**
 * Compute initial camera bearing aligned to trail direction.
 * Uses first ~10% of trail coordinates to determine heading.
 */
export function computeTrailBearing(
  coordinates: [number, number, number][]
): number {
  if (coordinates.length < 2) return 0;

  // Sample a point ~10% along the trail for a stable heading
  const sampleIndex = Math.min(
    Math.floor(coordinates.length * 0.1),
    coordinates.length - 1
  );

  const [lon1, lat1] = coordinates[0];
  const [lon2, lat2] = coordinates[sampleIndex];

  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const lat1Rad = (lat1 * Math.PI) / 180;
  const lat2Rad = (lat2 * Math.PI) / 180;

  const y = Math.sin(dLon) * Math.cos(lat2Rad);
  const x =
    Math.cos(lat1Rad) * Math.sin(lat2Rad) -
    Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLon);

  const bearing = (Math.atan2(y, x) * 180) / Math.PI;
  return (bearing + 360) % 360;
}

/**
 * Compute bounding box center + appropriate zoom for the trail.
 */
export function computeTrailCenter(
  coordinates: [number, number, number][]
): { center: [number, number]; zoom: number } {
  if (coordinates.length === 0) {
    return { center: [-105.5, 39.1], zoom: 10 }; // Colorado fallback
  }

  let minLon = Infinity,
    maxLon = -Infinity,
    minLat = Infinity,
    maxLat = -Infinity;

  for (const [lon, lat] of coordinates) {
    if (lon < minLon) minLon = lon;
    if (lon > maxLon) maxLon = lon;
    if (lat < minLat) minLat = lat;
    if (lat > maxLat) maxLat = lat;
  }

  const center: [number, number] = [(minLon + maxLon) / 2, (minLat + maxLat) / 2];

  // Rough zoom from bbox span (works well for 14er routes)
  const lonSpan = maxLon - minLon;
  const latSpan = maxLat - minLat;
  const maxSpan = Math.max(lonSpan, latSpan);

  let zoom = 14;
  if (maxSpan > 0.1) zoom = 11;
  else if (maxSpan > 0.05) zoom = 12;
  else if (maxSpan > 0.02) zoom = 13;
  else if (maxSpan > 0.01) zoom = 13.5;

  return { center, zoom };
}
