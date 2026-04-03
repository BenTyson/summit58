import type { Map } from 'maplibre-gl';

export interface FlythroughOptions {
  map: Map;
  coordinates: [number, number, number][];
  speed?: number;
  pitch?: number;
  altitude?: number;
  onProgress?: (progress: number, pointIndex: number) => void;
  onComplete?: () => void;
}

export interface FlythroughControls {
  stop: () => void;
  pause: () => void;
  resume: () => void;
}

function cubicInterpolate(
  p0: [number, number, number],
  p1: [number, number, number],
  p2: [number, number, number],
  p3: [number, number, number],
  t: number
): [number, number, number] {
  const t2 = t * t;
  const t3 = t2 * t;

  return [0, 1, 2].map((i) => {
    const a = -0.5 * p0[i] + 1.5 * p1[i] - 1.5 * p2[i] + 0.5 * p3[i];
    const b = p0[i] - 2.5 * p1[i] + 2 * p2[i] - 0.5 * p3[i];
    const c = -0.5 * p0[i] + 0.5 * p2[i];
    const d = p1[i];
    return a * t3 + b * t2 + c * t + d;
  }) as [number, number, number];
}

function computeSmoothBearing(
  coordinates: [number, number, number][],
  currentIndex: number,
  lookAheadCount: number = 8
): number {
  const endIndex = Math.min(currentIndex + lookAheadCount, coordinates.length - 1);
  if (endIndex <= currentIndex) return 0;

  const [lon1, lat1] = coordinates[currentIndex];
  const [lon2, lat2] = coordinates[endIndex];

  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const lat1Rad = (lat1 * Math.PI) / 180;
  const lat2Rad = (lat2 * Math.PI) / 180;

  const y = Math.sin(dLon) * Math.cos(lat2Rad);
  const x =
    Math.cos(lat1Rad) * Math.sin(lat2Rad) -
    Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLon);

  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

function shortestAngleDelta(from: number, to: number): number {
  let delta = ((to - from + 540) % 360) - 180;
  return delta;
}

export function startFlythrough(options: FlythroughOptions): FlythroughControls {
  const {
    map,
    coordinates,
    speed = 1,
    pitch = 67,
    onProgress,
    onComplete
  } = options;

  const totalSegments = coordinates.length - 1;
  if (totalSegments < 1) {
    onComplete?.();
    return { stop: () => {}, pause: () => {}, resume: () => {} };
  }

  // Base ms per segment — speed multiplier adjusts this
  const msPerSegment = 120 / speed;
  let currentSegment = 0;
  let segmentT = 0;
  let lastTimestamp: number | null = null;
  let animationId: number | null = null;
  let paused = false;
  let stopped = false;
  let currentBearing = computeSmoothBearing(coordinates, 0);

  function getClampedCoord(index: number): [number, number, number] {
    return coordinates[Math.max(0, Math.min(index, coordinates.length - 1))];
  }

  function tick(timestamp: number) {
    if (stopped) return;
    if (paused) {
      lastTimestamp = null;
      animationId = requestAnimationFrame(tick);
      return;
    }

    if (lastTimestamp === null) {
      lastTimestamp = timestamp;
      animationId = requestAnimationFrame(tick);
      return;
    }

    const elapsed = timestamp - lastTimestamp;
    lastTimestamp = timestamp;

    segmentT += elapsed / msPerSegment;

    while (segmentT >= 1 && currentSegment < totalSegments - 1) {
      segmentT -= 1;
      currentSegment++;
    }

    if (currentSegment >= totalSegments - 1 && segmentT >= 1) {
      onProgress?.(1, coordinates.length - 1);
      onComplete?.();
      stopped = true;
      return;
    }

    const p0 = getClampedCoord(currentSegment - 1);
    const p1 = getClampedCoord(currentSegment);
    const p2 = getClampedCoord(currentSegment + 1);
    const p3 = getClampedCoord(currentSegment + 2);

    const t = Math.min(segmentT, 1);
    const [lng, lat] = cubicInterpolate(p0, p1, p2, p3, t);

    const targetBearing = computeSmoothBearing(coordinates, currentSegment);
    const delta = shortestAngleDelta(currentBearing, targetBearing);
    currentBearing = ((currentBearing + delta * 0.08) + 360) % 360;

    const pointIndex = currentSegment + Math.floor(t);
    const progress = (currentSegment + t) / totalSegments;

    map.jumpTo({
      center: [lng, lat],
      zoom: 15.5,
      pitch,
      bearing: currentBearing
    });

    onProgress?.(progress, Math.min(pointIndex, coordinates.length - 1));
    animationId = requestAnimationFrame(tick);
  }

  animationId = requestAnimationFrame(tick);

  return {
    stop() {
      stopped = true;
      if (animationId !== null) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
    },
    pause() {
      paused = true;
    },
    resume() {
      paused = false;
      lastTimestamp = null;
    }
  };
}
