/**
 * Geographic utilities for client-side use
 */

/**
 * Haversine distance between two points (returns meters)
 */
export function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000; // Earth's radius in meters

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Get cumulative distance at each point for elevation profile (in miles)
 */
export function getCumulativeDistances(
  coords: [number, number, number][]
): number[] {
  const distances = [0];
  let cumulative = 0;

  for (let i = 1; i < coords.length; i++) {
    const [lon1, lat1] = coords[i - 1];
    const [lon2, lat2] = coords[i];

    const segmentMeters = haversineDistance(lat1, lon1, lat2, lon2);
    const segmentMiles = segmentMeters / 1609.344;

    cumulative += segmentMiles;
    distances.push(Math.round(cumulative * 100) / 100);
  }

  return distances;
}

/**
 * Calculate total distance in miles
 */
export function calculateTotalDistance(
  coords: [number, number, number][]
): number {
  let totalMeters = 0;

  for (let i = 1; i < coords.length; i++) {
    const [lon1, lat1] = coords[i - 1];
    const [lon2, lat2] = coords[i];

    totalMeters += haversineDistance(lat1, lon1, lat2, lon2);
  }

  const miles = totalMeters / 1609.344;
  return Math.round(miles * 10) / 10;
}
