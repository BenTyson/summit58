import { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { colors } from '@/lib/theme/colors';
import { cachedApiFetch } from '@/lib/offline/cache';
import { useOffline } from '@/lib/offline/OfflineProvider';
import { CACHE_TIERS } from '@/lib/offline/types';
import { usePurchases } from '@/lib/purchases/PurchasesProvider';
import { LoadingState } from '@/components/ui/LoadingState';
import { ErrorState } from '@/components/ui/ErrorState';
import { ClassBadge } from '@/components/ui/ClassBadge';
import { TerrainViewer3D } from '@/components/map/TerrainViewer3D';
import type { RouteDetailResponse } from '@/lib/types/api';

type ViewMode = '2D' | '3D';

export default function RouteDetailScreen() {
  const { slug, route: routeSlug } = useLocalSearchParams<{ slug: string; route: string }>();
  const [data, setData] = useState<RouteDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('3D');
  const { isPro } = usePurchases();
  const { isOnline } = useOffline();

  const loadRoute = useCallback(async () => {
    try {
      setError(null);
      const { data: result } = await cachedApiFetch<RouteDetailResponse>(
        `/api/v1/peaks/${slug}/routes/${routeSlug}`,
        {
          cache: CACHE_TIERS.STATIC,
          fetchOptions: { auth: false },
        },
        isOnline
      );
      setData(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load route');
    } finally {
      setLoading(false);
    }
  }, [slug, routeSlug, isOnline]);

  useEffect(() => {
    loadRoute();
  }, [loadRoute]);

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.light.bgPrimary }}>
        <Stack.Screen options={{ title: '' }} />
        <LoadingState message="Loading route..." />
      </View>
    );
  }

  if (error || !data) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.light.bgPrimary }}>
        <Stack.Screen options={{ title: 'Route' }} />
        <ErrorState message={error || 'Route not found'} onRetry={loadRoute} />
      </View>
    );
  }

  const { peak, route, trailGeometry } = data;

  return (
    <View style={{ flex: 1, backgroundColor: colors.light.bgPrimary }}>
      <Stack.Screen
        options={{
          title: route.name,
          headerTransparent: false,
        }}
      />

      {viewMode === '3D' ? (
        <View style={{ flex: 1 }}>
          <TerrainViewer3D
            trailGeometry={trailGeometry}
            summitCoords={{ lat: peak.latitude, lng: peak.longitude }}
            difficultyClass={route.difficulty_class}
            peakName={peak.name}
            isPro={isPro}
            onRequestUpgrade={() => router.push('/(modals)/paywall')}
          />

          {/* Info strip at bottom */}
          <View style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            padding: 16,
          }}>
            <Text style={{
              fontFamily: 'InstrumentSerif',
              fontSize: 20,
              color: '#ffffff',
              marginBottom: 4,
            }}>
              {route.name}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <ClassBadge difficulty={route.difficulty_class} size="sm" />
              <Text style={{ fontFamily: 'Inter', fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>
                {route.distance_miles} mi
              </Text>
              <Text style={{ fontFamily: 'Inter', fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>
                {route.elevation_gain_ft.toLocaleString()} ft gain
              </Text>
              {route.typical_time_hours && (
                <Text style={{ fontFamily: 'Inter', fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>
                  {route.typical_time_hours} hrs
                </Text>
              )}
            </View>
          </View>

          {/* View toggle */}
          <ViewToggle mode={viewMode} onChange={setViewMode} />
        </View>
      ) : (
        <ScrollView style={{ flex: 1 }}>
          {/* 2D route info */}
          <View style={{ padding: 20 }}>
            <Text style={{
              fontFamily: 'InstrumentSerif',
              fontSize: 28,
              color: colors.light.textPrimary,
              marginBottom: 4,
            }}>
              {route.name}
            </Text>
            <Text style={{
              fontFamily: 'Inter',
              fontSize: 14,
              color: colors.light.textSecondary,
              marginBottom: 12,
            }}>
              {peak.name} ({peak.elevation.toLocaleString()} ft) &middot; {peak.range}
            </Text>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <ClassBadge difficulty={route.difficulty_class} size="md" />
              {route.is_standard && (
                <View style={{
                  backgroundColor: colors.accent.default + '20',
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  borderRadius: 4,
                }}>
                  <Text style={{ fontFamily: 'Inter-Medium', fontSize: 11, color: colors.accent.dark }}>
                    Standard Route
                  </Text>
                </View>
              )}
            </View>

            {/* Stats grid */}
            <View style={{
              backgroundColor: colors.light.bgSecondary,
              borderRadius: 12,
              padding: 16,
              borderWidth: 1,
              borderColor: colors.light.border,
              marginBottom: 20,
            }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                <StatItem label="Distance" value={`${route.distance_miles} mi`} />
                <StatItem label="Elevation Gain" value={`${route.elevation_gain_ft.toLocaleString()} ft`} />
                {route.typical_time_hours && (
                  <StatItem label="Est. Time" value={`${route.typical_time_hours} hrs`} />
                )}
              </View>
            </View>

            {/* Trail geometry stats */}
            {trailGeometry && (
              <View style={{
                backgroundColor: colors.light.bgSecondary,
                borderRadius: 12,
                padding: 16,
                borderWidth: 1,
                borderColor: colors.light.border,
                marginBottom: 20,
              }}>
                <Text style={{
                  fontFamily: 'Inter-SemiBold',
                  fontSize: 15,
                  color: colors.light.textPrimary,
                  marginBottom: 12,
                }}>
                  Trail Profile
                </Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                  <StatItem
                    label="Min Elev"
                    value={`${Math.round(trailGeometry.properties.minElevation * 3.28084).toLocaleString()} ft`}
                  />
                  <StatItem
                    label="Max Elev"
                    value={`${Math.round(trailGeometry.properties.maxElevation * 3.28084).toLocaleString()} ft`}
                  />
                  <StatItem
                    label="Track Dist"
                    value={`${trailGeometry.properties.totalDistanceMiles.toFixed(1)} mi`}
                  />
                </View>
              </View>
            )}

            {!trailGeometry && (
              <View style={{
                backgroundColor: colors.light.bgSecondary,
                borderRadius: 12,
                padding: 20,
                borderWidth: 1,
                borderColor: colors.light.border,
                alignItems: 'center',
              }}>
                <Text style={{
                  fontFamily: 'Inter',
                  fontSize: 14,
                  color: colors.light.textMuted,
                  textAlign: 'center',
                }}>
                  No trail geometry available for this route yet.
                </Text>
              </View>
            )}
          </View>

          {/* View toggle at bottom */}
          <View style={{ paddingHorizontal: 20, paddingBottom: 32 }}>
            <ViewToggle mode={viewMode} onChange={setViewMode} />
          </View>
        </ScrollView>
      )}
    </View>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ alignItems: 'center' }}>
      <Text style={{ fontFamily: 'Inter-SemiBold', fontSize: 16, color: colors.light.textPrimary }}>
        {value}
      </Text>
      <Text style={{ fontFamily: 'Inter', fontSize: 12, color: colors.light.textMuted, marginTop: 2 }}>
        {label}
      </Text>
    </View>
  );
}

function ViewToggle({ mode, onChange }: { mode: ViewMode; onChange: (m: ViewMode) => void }) {
  return (
    <View style={{
      position: mode === '3D' ? 'absolute' : 'relative',
      top: mode === '3D' ? 12 : undefined,
      left: mode === '3D' ? 12 : undefined,
      flexDirection: 'row',
      backgroundColor: 'rgba(0,0,0,0.35)',
      borderRadius: 8,
      overflow: 'hidden',
    }}>
      {(['2D', '3D'] as const).map((m) => (
        <Pressable
          key={m}
          onPress={() => onChange(m)}
          style={{
            paddingHorizontal: 16,
            paddingVertical: 10,
            backgroundColor: mode === m ? colors.accent.default : 'transparent',
            borderRadius: 8,
          }}
        >
          <Text style={{
            fontFamily: 'Inter-SemiBold',
            fontSize: 13,
            color: mode === m ? '#ffffff' : 'rgba(255,255,255,0.7)',
          }}>
            {m}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
