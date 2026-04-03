import type { ForecastResponse, ElevationBandForecast, PeriodForecast } from '$lib/types/database';
import type { TrailGeometry } from '$lib/server/gpx';

interface WeatherLayerSpec {
  id: string;
  source: string;
  sourceData: GeoJSON.Feature;
  type: 'fill';
  paint: Record<string, unknown>;
}

interface WeatherBandResult {
  layers: WeatherLayerSpec[];
  sources: { id: string; data: GeoJSON.Feature }[];
}

const BAND_KEYS = ['base', 'mid', 'summit'] as const;

function getBandColor(band: ElevationBandForecast): string {
  const today = band.days[0];
  if (!today) return 'rgba(128, 128, 128, 0.2)';

  const periods: PeriodForecast[] = [today.morning, today.afternoon, today.night].filter(Boolean);
  if (periods.length === 0) return 'rgba(128, 128, 128, 0.2)';

  const avgTemp = periods.reduce((s, p) => s + p.temperature_f, 0) / periods.length;
  const maxWind = Math.max(...periods.map((p) => p.wind_gust_mph));
  const avgCloud = periods.reduce((s, p) => s + p.cloud_cover_percent, 0) / periods.length;
  const freezingLevel = periods[0].freezing_level_ft;
  const isFreezing = band.elevation_ft > freezingLevel || avgTemp <= 32;

  if (isFreezing) return 'rgba(59, 130, 246, 0.22)';
  if (maxWind >= 40) return 'rgba(239, 68, 68, 0.22)';
  if (maxWind >= 25) return 'rgba(249, 115, 22, 0.2)';
  if (avgCloud >= 70) return 'rgba(148, 163, 184, 0.2)';
  return 'rgba(128, 128, 128, 0.15)';
}

function buildBandPolygon(
  coordinates: [number, number, number][],
  elevLow: number,
  elevHigh: number
): GeoJSON.Feature<GeoJSON.Polygon> | null {
  const bandCoords: [number, number][] = [];

  for (let i = 0; i < coordinates.length; i++) {
    const elev = coordinates[i][2];
    if (elev >= elevLow && elev <= elevHigh) {
      bandCoords.push([coordinates[i][0], coordinates[i][1]]);
    }
  }

  if (bandCoords.length < 3) return null;

  const BUFFER = 0.002;
  const forward = bandCoords.map(([lng, lat]) => [lng, lat] as [number, number]);
  const backward = [...bandCoords]
    .reverse()
    .map(([lng, lat]) => [lng + BUFFER, lat + BUFFER * 0.5] as [number, number]);

  const ring = [...forward, ...backward, forward[0]];

  return {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'Polygon',
      coordinates: [ring]
    }
  };
}

export function buildWeatherLayers(
  forecast: ForecastResponse,
  trailGeometry: TrailGeometry
): WeatherBandResult {
  const coords = trailGeometry.coordinates;
  if (coords.length === 0) return { layers: [], sources: [] };

  const elevations = coords.map((c) => c[2]);
  const minElev = Math.min(...elevations);
  const maxElev = Math.max(...elevations);
  const range = maxElev - minElev;

  const bandRanges: Record<string, [number, number]> = {
    base: [minElev, minElev + range * 0.33],
    mid: [minElev + range * 0.33, minElev + range * 0.66],
    summit: [minElev + range * 0.66, maxElev + 100]
  };

  const layers: WeatherLayerSpec[] = [];
  const sources: { id: string; data: GeoJSON.Feature }[] = [];

  for (const key of BAND_KEYS) {
    const band = forecast.bands[key];
    if (!band) continue;

    const [lo, hi] = bandRanges[key];
    const polygon = buildBandPolygon(coords, lo, hi);
    if (!polygon) continue;

    const sourceId = `weather-band-${key}`;
    const layerId = `weather-band-${key}-fill`;
    const color = getBandColor(band);

    sources.push({ id: sourceId, data: polygon });
    layers.push({
      id: layerId,
      source: sourceId,
      sourceData: polygon,
      type: 'fill',
      paint: {
        'fill-color': color,
        'fill-opacity': 0.8
      }
    });
  }

  return { layers, sources };
}
