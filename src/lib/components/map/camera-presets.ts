import { computeTrailBearing, computeTrailCenter } from './terrain-styles';

export interface CameraPosition {
  center: [number, number];
  zoom: number;
  pitch: number;
  bearing: number;
}

export function computeOverviewCamera(
  coordinates: [number, number, number][]
): CameraPosition {
  const { center, zoom } = computeTrailCenter(coordinates);
  const bearing = computeTrailBearing(coordinates);
  return { center, zoom: zoom - 0.5, pitch: 50, bearing };
}

export function computeBirdsEyeCamera(
  coordinates: [number, number, number][]
): CameraPosition {
  const { center } = computeTrailCenter(coordinates);
  const bearing = computeTrailBearing(coordinates);
  return { center, zoom: 14.5, pitch: 75, bearing };
}

export function computeHikerPOVCamera(
  coordinates: [number, number, number][],
  pointIndex: number
): CameraPosition {
  const idx = Math.max(0, Math.min(pointIndex, coordinates.length - 1));
  const [lng, lat] = coordinates[idx];

  // Compute bearing from this point looking ahead along the trail
  const lookAhead = Math.min(idx + Math.max(5, Math.floor(coordinates.length * 0.03)), coordinates.length - 1);
  let bearing = 0;
  if (lookAhead > idx) {
    const [lng2, lat2] = coordinates[lookAhead];
    const dLon = ((lng2 - lng) * Math.PI) / 180;
    const lat1Rad = (lat * Math.PI) / 180;
    const lat2Rad = (lat2 * Math.PI) / 180;
    const y = Math.sin(dLon) * Math.cos(lat2Rad);
    const x =
      Math.cos(lat1Rad) * Math.sin(lat2Rad) -
      Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLon);
    bearing = ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
  }

  return { center: [lng, lat], zoom: 15.5, pitch: 70, bearing };
}
