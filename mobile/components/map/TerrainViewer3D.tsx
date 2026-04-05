import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { View, Text, Pressable, useColorScheme } from 'react-native';
import {
  MapView,
  Camera,
  ShapeSource,
  LineLayer,
  CircleLayer,
  type CameraRef,
} from '@maplibre/maplibre-react-native';
import { colors } from '@/lib/theme/colors';
import { FlythroughControls } from './FlythroughControls';
import type { TrailGeometry } from '@/lib/types/api';
import type { ViewerCameraPosition } from '@saltgoat/shared/types/helpers';

const MAPTILER_KEY = process.env.EXPO_PUBLIC_MAPTILER_API_KEY ?? '';

const CLASS_COLORS: Record<number, string> = {
  1: '#5A9E78',
  2: '#4A7FB5',
  3: '#C4943F',
  4: '#B84C4C',
};

interface Props {
  trailGeometry: TrailGeometry | null;
  summitCoords: { lat: number; lng: number };
  trailheadCoords?: { lat: number; lng: number } | null;
  difficultyClass: number;
  peakName: string;
  isPro: boolean;
  onRequestUpgrade?: () => void;
}

type CameraPreset = 'overview' | 'birdsEye' | 'reset';

interface FlyRef {
  stop: () => void;
  pause: () => void;
  resume: () => void;
  animationId: number | null;
}

function computeTrailCenter(coords: [number, number, number][]): { center: [number, number]; zoom: number } {
  if (coords.length === 0) return { center: [-105.5, 39.1], zoom: 10 };

  let minLon = Infinity, maxLon = -Infinity, minLat = Infinity, maxLat = -Infinity;
  for (const [lon, lat] of coords) {
    if (lon < minLon) minLon = lon;
    if (lon > maxLon) maxLon = lon;
    if (lat < minLat) minLat = lat;
    if (lat > maxLat) maxLat = lat;
  }

  const center: [number, number] = [(minLon + maxLon) / 2, (minLat + maxLat) / 2];
  const maxSpan = Math.max(maxLon - minLon, maxLat - minLat);

  let zoom = 14;
  if (maxSpan > 0.1) zoom = 11;
  else if (maxSpan > 0.05) zoom = 12;
  else if (maxSpan > 0.02) zoom = 13;
  else if (maxSpan > 0.01) zoom = 13.5;

  return { center, zoom };
}

function computeTrailBearing(coords: [number, number, number][]): number {
  if (coords.length < 2) return 0;
  const sampleIndex = Math.min(Math.floor(coords.length * 0.1), coords.length - 1);
  const [lon1, lat1] = coords[0];
  const [lon2, lat2] = coords[sampleIndex];
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const lat1Rad = (lat1 * Math.PI) / 180;
  const lat2Rad = (lat2 * Math.PI) / 180;
  const y = Math.sin(dLon) * Math.cos(lat2Rad);
  const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) - Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLon);
  return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
}

function buildStyleJSON(mode: 'light' | 'dark'): string {
  const isDark = mode === 'dark';
  const style = {
    version: 8,
    sources: {
      'maptiler-satellite': {
        type: 'raster',
        url: `https://api.maptiler.com/tiles/satellite-v2/tiles.json?key=${MAPTILER_KEY}`,
        tileSize: 256,
      },
      'maptiler-terrain': {
        type: 'raster-dem',
        url: `https://api.maptiler.com/tiles/terrain-rgb-v2/tiles.json?key=${MAPTILER_KEY}`,
        tileSize: 256,
      },
      'maptiler-topo': {
        type: 'raster',
        url: `https://api.maptiler.com/maps/topo-v2/tiles.json?key=${MAPTILER_KEY}`,
        tileSize: 256,
      },
    },
    terrain: {
      source: 'maptiler-terrain',
      exaggeration: 1.3,
    },
    sky: isDark
      ? { 'sky-color': '#0f172a', 'horizon-color': '#1e293b', 'fog-color': '#1e293b' }
      : { 'sky-color': '#87CEEB', 'horizon-color': '#c9daea', 'fog-color': '#e8ecf1' },
    layers: [
      isDark
        ? {
            id: 'topo-base',
            type: 'raster',
            source: 'maptiler-topo',
            paint: { 'raster-brightness-max': 0.35, 'raster-saturation': -0.4 },
          }
        : {
            id: 'satellite-base',
            type: 'raster',
            source: 'maptiler-satellite',
            paint: {},
          },
    ],
  };
  return JSON.stringify(style);
}

const NOOP_FLY: FlyRef = { stop() {}, pause() {}, resume() {}, animationId: null };

export function TerrainViewer3D({
  trailGeometry,
  summitCoords,
  trailheadCoords,
  difficultyClass,
  peakName,
  isPro,
  onRequestUpgrade,
}: Props) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const cameraRef = useRef<CameraRef>(null);

  const [flyPlaying, setFlyPlaying] = useState(false);
  const [flyProgress, setFlyProgress] = useState(0);
  const [flySpeed, setFlySpeed] = useState(1);
  const [showTeaser, setShowTeaser] = useState(false);
  const flyRef = useRef<FlyRef>(NOOP_FLY);

  const coords = trailGeometry?.coordinates ?? [];
  const routeColor = CLASS_COLORS[difficultyClass] ?? CLASS_COLORS[1];

  const styleJSON = useMemo(() => buildStyleJSON(isDark ? 'dark' : 'light'), [isDark]);

  const initialCamera = useMemo((): ViewerCameraPosition => {
    if (coords.length > 0) {
      const { center, zoom } = computeTrailCenter(coords);
      const bearing = computeTrailBearing(coords);
      return { center, zoom: zoom - 0.5, pitch: 50, bearing };
    }
    return {
      center: [summitCoords.lng, summitCoords.lat],
      zoom: 13,
      pitch: 50,
      bearing: 0,
    };
  }, [coords, summitCoords]);

  const routeGeoJSON = useMemo(() => {
    if (!trailGeometry) return null;
    return {
      type: 'Feature' as const,
      geometry: {
        type: 'LineString' as const,
        coordinates: trailGeometry.coordinates,
      },
      properties: {},
    };
  }, [trailGeometry]);

  const trailheadCoord = useMemo((): [number, number] | null => {
    if (trailheadCoords) return [trailheadCoords.lng, trailheadCoords.lat];
    if (coords.length > 0) return [coords[0][0], coords[0][1]];
    return null;
  }, [trailheadCoords, coords]);

  const moveCamera = useCallback((pos: ViewerCameraPosition, duration = 1500) => {
    cameraRef.current?.setCamera({
      centerCoordinate: pos.center,
      zoomLevel: pos.zoom,
      pitch: pos.pitch,
      heading: pos.bearing,
      animationDuration: duration,
      animationMode: 'flyTo',
    });
  }, []);

  const handlePreset = useCallback((preset: CameraPreset) => {
    if (coords.length === 0) return;
    const { center, zoom } = computeTrailCenter(coords);
    const bearing = computeTrailBearing(coords);

    switch (preset) {
      case 'overview':
        moveCamera({ center, zoom: zoom - 0.5, pitch: 50, bearing });
        break;
      case 'birdsEye':
        moveCamera({ center, zoom: 14.5, pitch: 75, bearing });
        break;
      case 'reset':
        moveCamera(initialCamera);
        break;
    }
  }, [coords, initialCamera, moveCamera]);

  const startFlythrough = useCallback(() => {
    if (!isPro) {
      setShowTeaser(true);
      return;
    }
    if (coords.length < 2) return;

    setFlyPlaying(true);
    setFlyProgress(0);

    const msPerSegment = 120 / flySpeed;
    const totalSegments = coords.length - 1;
    let currentSegment = 0;
    let segmentT = 0;
    let lastTimestamp: number | null = null;
    let stopped = false;
    let paused = false;
    let currentBearing = computeTrailBearing(coords);

    function computeSmoothBearing(index: number): number {
      const endIndex = Math.min(index + 8, coords.length - 1);
      if (endIndex <= index) return 0;
      const [lon1, lat1] = coords[index];
      const [lon2, lat2] = coords[endIndex];
      const dLon = ((lon2 - lon1) * Math.PI) / 180;
      const lat1Rad = (lat1 * Math.PI) / 180;
      const lat2Rad = (lat2 * Math.PI) / 180;
      const y = Math.sin(dLon) * Math.cos(lat2Rad);
      const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) - Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLon);
      return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
    }

    function shortestAngleDelta(from: number, to: number): number {
      return ((to - from + 540) % 360) - 180;
    }

    function getCoord(i: number): [number, number, number] {
      return coords[Math.max(0, Math.min(i, coords.length - 1))];
    }

    function cubicInterp(
      p0: [number, number, number],
      p1: [number, number, number],
      p2: [number, number, number],
      p3: [number, number, number],
      t: number
    ): [number, number] {
      const t2 = t * t;
      const t3 = t2 * t;
      return [0, 1].map((i) => {
        const a = -0.5 * p0[i] + 1.5 * p1[i] - 1.5 * p2[i] + 0.5 * p3[i];
        const b = p0[i] - 2.5 * p1[i] + 2 * p2[i] - 0.5 * p3[i];
        const c = -0.5 * p0[i] + 0.5 * p2[i];
        const d = p1[i];
        return a * t3 + b * t2 + c * t + d;
      }) as [number, number];
    }

    function tick(timestamp: number) {
      if (stopped) return;
      if (paused) {
        lastTimestamp = null;
        flyRef.current.animationId = requestAnimationFrame(tick);
        return;
      }

      if (lastTimestamp === null) {
        lastTimestamp = timestamp;
        flyRef.current.animationId = requestAnimationFrame(tick);
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
        setFlyProgress(1);
        setFlyPlaying(false);
        stopped = true;
        return;
      }

      const t = Math.min(segmentT, 1);
      const [lng, lat] = cubicInterp(
        getCoord(currentSegment - 1),
        getCoord(currentSegment),
        getCoord(currentSegment + 1),
        getCoord(currentSegment + 2),
        t
      );

      const targetBearing = computeSmoothBearing(currentSegment);
      const delta = shortestAngleDelta(currentBearing, targetBearing);
      currentBearing = ((currentBearing + delta * 0.08) + 360) % 360;

      cameraRef.current?.setCamera({
        centerCoordinate: [lng, lat],
        zoomLevel: 15.5,
        pitch: 67,
        heading: currentBearing,
        animationDuration: 0,
      });

      setFlyProgress((currentSegment + t) / totalSegments);
      flyRef.current.animationId = requestAnimationFrame(tick);
    }

    const ref: FlyRef = {
      stop() {
        stopped = true;
        if (ref.animationId !== null) {
          cancelAnimationFrame(ref.animationId);
          ref.animationId = null;
        }
        setFlyPlaying(false);
        setFlyProgress(0);
      },
      pause() { paused = true; },
      resume() { paused = false; lastTimestamp = null; },
      animationId: requestAnimationFrame(tick),
    };
    flyRef.current = ref;
  }, [isPro, coords, flySpeed]);

  const handleFlyPause = useCallback(() => {
    flyRef.current.pause();
    setFlyPlaying(false);
  }, []);

  const handleFlyResume = useCallback(() => {
    flyRef.current.resume();
    setFlyPlaying(true);
  }, []);

  const handleFlyStop = useCallback(() => {
    flyRef.current.stop();
    handlePreset('overview');
  }, [handlePreset]);

  useEffect(() => {
    return () => { flyRef.current.stop(); };
  }, []);

  if (!MAPTILER_KEY) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: isDark ? colors.dark.bgPrimary : colors.light.bgPrimary }}>
        <Text style={{ fontFamily: 'Inter', fontSize: 14, color: isDark ? colors.dark.textMuted : colors.light.textMuted }}>
          3D viewer unavailable (missing API key)
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        mapStyle={styleJSON}
        logoEnabled={false}
        attributionEnabled={false}
        compassEnabled
        pitchEnabled
        rotateEnabled
      >
        <Camera
          ref={cameraRef}
          defaultSettings={{
            centerCoordinate: initialCamera.center,
            zoomLevel: initialCamera.zoom,
            pitch: initialCamera.pitch,
            heading: initialCamera.bearing,
          }}
        />

        {routeGeoJSON && (
          <ShapeSource id="route" shape={routeGeoJSON}>
            <LineLayer
              id="route-outline"
              style={{
                lineColor: '#ffffff',
                lineWidth: 5,
                lineOpacity: 0.8,
                lineCap: 'round',
                lineJoin: 'round',
              }}
            />
            <LineLayer
              id="route-line"
              style={{
                lineColor: routeColor,
                lineWidth: 3,
                lineOpacity: 1,
                lineCap: 'round',
                lineJoin: 'round',
              }}
              aboveLayerID="route-outline"
            />
          </ShapeSource>
        )}

        <ShapeSource
          id="summit-point"
          shape={{
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [summitCoords.lng, summitCoords.lat] },
            properties: {},
          }}
        >
          <CircleLayer
            id="summit-outer"
            style={{
              circleRadius: 10,
              circleColor: colors.accent.default,
              circleStrokeColor: '#ffffff',
              circleStrokeWidth: 2,
            }}
          />
        </ShapeSource>

        {trailheadCoord && (
          <ShapeSource
            id="trailhead-point"
            shape={{
              type: 'Feature',
              geometry: { type: 'Point', coordinates: trailheadCoord },
              properties: {},
            }}
          >
            <CircleLayer
              id="trailhead-circle"
              style={{
                circleRadius: 10,
                circleColor: '#3A8168',
                circleStrokeColor: '#ffffff',
                circleStrokeWidth: 2,
              }}
            />
          </ShapeSource>
        )}
      </MapView>

      {!flyPlaying && flyProgress === 0 && (
        <View style={{
          position: 'absolute',
          top: 12,
          right: 12,
          gap: 8,
        }}>
          <PresetButton label="Overview" onPress={() => handlePreset('overview')} />
          <PresetButton label="Bird's Eye" onPress={() => handlePreset('birdsEye')} />
          {coords.length > 1 && (
            <PresetButton
              label="Flythrough"
              onPress={startFlythrough}
              accent
            />
          )}
        </View>
      )}

      {(flyPlaying || flyProgress > 0) && flyProgress < 1 && (
        <FlythroughControls
          playing={flyPlaying}
          speed={flySpeed}
          progress={flyProgress}
          onPlay={handleFlyResume}
          onPause={handleFlyPause}
          onStop={handleFlyStop}
          onSpeedChange={setFlySpeed}
        />
      )}

      {showTeaser && (
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 32,
        }}>
          <Text style={{
            fontFamily: 'InstrumentSerif',
            fontSize: 24,
            color: '#ffffff',
            textAlign: 'center',
            marginBottom: 8,
          }}>
            Flythrough Animation
          </Text>
          <Text style={{
            fontFamily: 'Inter',
            fontSize: 14,
            color: 'rgba(255,255,255,0.8)',
            textAlign: 'center',
            marginBottom: 20,
            lineHeight: 20,
          }}>
            Experience an animated flyover of this route with SaltGoat Pro.
          </Text>
          <Pressable
            onPress={() => { setShowTeaser(false); onRequestUpgrade?.(); }}
            style={({ pressed }) => ({
              backgroundColor: pressed ? colors.accent.dark : colors.accent.default,
              paddingHorizontal: 28,
              paddingVertical: 14,
              borderRadius: 10,
            })}
          >
            <Text style={{ fontFamily: 'Inter-SemiBold', fontSize: 15, color: '#ffffff' }}>
              Upgrade to Pro
            </Text>
          </Pressable>
          <Pressable onPress={() => setShowTeaser(false)} style={{ marginTop: 16 }}>
            <Text style={{ fontFamily: 'Inter', fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>
              Maybe later
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

function PresetButton({
  label,
  onPress,
  accent,
}: {
  label: string;
  onPress: () => void;
  accent?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        backgroundColor: accent
          ? pressed ? colors.accent.dark : colors.accent.default
          : pressed
            ? 'rgba(0,0,0,0.5)'
            : 'rgba(0,0,0,0.35)',
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 8,
        minWidth: 90,
        alignItems: 'center',
      })}
    >
      <Text style={{
        fontFamily: 'Inter-Medium',
        fontSize: 13,
        color: '#ffffff',
      }}>
        {label}
      </Text>
    </Pressable>
  );
}
