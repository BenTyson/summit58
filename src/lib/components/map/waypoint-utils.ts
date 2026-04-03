const COLORADO_TREELINE_FT = 11400;
const METERS_TO_FEET = 3.28084;

export interface TreelineWaypoint {
  index: number;
  elevation: number;
}

export interface CruxWaypoint {
  index: number;
  elevation: number;
  gradient: number;
}

function toFeet(elevMeters: number): number {
  return elevMeters * METERS_TO_FEET;
}

/** Haversine distance in miles between two [lng, lat] points */
function haversineDistMiles(
  lng1: number, lat1: number,
  lng2: number, lat2: number
): number {
  const R = 3958.8; // Earth radius in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Find the coordinate closest to Colorado treeline (~11,400ft).
 * Elevation in coordinates is meters; we convert internally.
 */
export function findTreelinePoint(
  coordinates: [number, number, number][]
): TreelineWaypoint | null {
  if (coordinates.length === 0) return null;

  let closestIndex = -1;
  let closestDiff = Infinity;

  for (let i = 0; i < coordinates.length; i++) {
    const elev = coordinates[i][2];
    if (elev === undefined) continue;
    const elevFt = toFeet(elev);
    const diff = Math.abs(elevFt - COLORADO_TREELINE_FT);
    if (diff < closestDiff) {
      closestDiff = diff;
      closestIndex = i;
    }
  }

  // Only return if the trail actually crosses near treeline (within 500ft)
  if (closestIndex < 0 || closestDiff > 500) return null;

  // Verify trail spans across treeline (has points both above and below)
  const elevations = coordinates
    .filter(c => c[2] !== undefined)
    .map(c => toFeet(c[2]));
  const hasBelow = elevations.some(e => e < COLORADO_TREELINE_FT);
  const hasAbove = elevations.some(e => e > COLORADO_TREELINE_FT);
  if (!hasBelow || !hasAbove) return null;

  return {
    index: closestIndex,
    elevation: Math.round(toFeet(coordinates[closestIndex][2]))
  };
}

/**
 * Find the steepest sustained section (~0.1mi window) for Class 2+ routes.
 * Returns null for Class 1 routes.
 */
export function findCruxPoint(
  coordinates: [number, number, number][],
  difficultyClass: number
): CruxWaypoint | null {
  if (difficultyClass < 2 || coordinates.length < 10) return null;

  const TARGET_WINDOW_MI = 0.1;
  let maxGradient = 0;
  let maxIndex = -1;

  for (let i = 0; i < coordinates.length; i++) {
    // Find the end of the ~0.1mi window starting at i
    let j = i + 1;
    let windowDist = 0;

    while (j < coordinates.length) {
      windowDist += haversineDistMiles(
        coordinates[j - 1][0], coordinates[j - 1][1],
        coordinates[j][0], coordinates[j][1]
      );
      if (windowDist >= TARGET_WINDOW_MI) break;
      j++;
    }

    if (j >= coordinates.length || windowDist < TARGET_WINDOW_MI * 0.5) continue;

    const elevGainFt = Math.abs(toFeet(coordinates[j][2]) - toFeet(coordinates[i][2]));
    const gradient = elevGainFt / (windowDist * 5280); // ft per ft (dimensionless)

    if (gradient > maxGradient) {
      maxGradient = gradient;
      // Place marker at midpoint of the steepest window
      maxIndex = Math.floor((i + j) / 2);
    }
  }

  if (maxIndex < 0 || maxGradient < 0.15) return null; // Skip if gradient is trivial

  return {
    index: maxIndex,
    elevation: Math.round(toFeet(coordinates[maxIndex][2])),
    gradient: Math.round(maxGradient * 1000) / 1000
  };
}
