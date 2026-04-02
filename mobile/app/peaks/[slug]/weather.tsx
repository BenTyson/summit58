import { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, ScrollView, RefreshControl, Pressable, Animated } from 'react-native';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { colors } from '@/lib/theme/colors';
import { cachedApiFetch } from '@/lib/offline/cache';
import { useOffline } from '@/lib/offline/OfflineProvider';
import { usePurchases } from '@/lib/purchases/PurchasesProvider';
import { CACHE_TIERS } from '@/lib/offline/types';
import { ErrorState } from '@/components/ui/ErrorState';
import { OfflineBanner } from '@/components/ui/OfflineBanner';
import { StaleDataIndicator } from '@/components/ui/StaleDataIndicator';
import { ElevationBandSelector, type ElevationBand } from '@/components/weather/ElevationBandSelector';
import { WeatherSummaryText } from '@/components/weather/WeatherSummaryText';
import { HikerInsightsPanel } from '@/components/weather/HikerInsightsPanel';
import { WeatherHero } from '@/components/weather/WeatherHero';
import { ForecastGrid } from '@/components/weather/ForecastGrid';
import { SymbolView } from 'expo-symbols';
import type { ForecastResponse } from '@/lib/types/api';

function SkeletonBlock({ width, height, style }: { width: number | string; height: number; style?: any }) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.7, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius: 6,
          backgroundColor: colors.light.border,
          opacity,
        },
        style,
      ]}
    />
  );
}

function WeatherSkeleton() {
  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 20 }}>
      {/* Header */}
      <View style={{ gap: 4 }}>
        <SkeletonBlock width={180} height={28} />
        <SkeletonBlock width={160} height={14} />
      </View>

      {/* Band selector */}
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {[0, 1, 2].map((i) => (
          <SkeletonBlock key={i} width={100} height={44} style={{ borderRadius: 10 }} />
        ))}
      </View>

      {/* Summary */}
      <View style={{ gap: 6 }}>
        <SkeletonBlock width="100%" height={14} />
        <SkeletonBlock width="85%" height={14} />
      </View>

      {/* Hero */}
      <View style={{ alignItems: 'center', padding: 20, backgroundColor: colors.light.bgSecondary, borderRadius: 14, gap: 8 }}>
        <SkeletonBlock width={100} height={12} />
        <SkeletonBlock width={48} height={48} style={{ borderRadius: 24 }} />
        <SkeletonBlock width={80} height={40} />
        <SkeletonBlock width={120} height={14} />
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
          {[0, 1, 2, 3].map((i) => (
            <SkeletonBlock key={i} width={70} height={36} style={{ borderRadius: 8 }} />
          ))}
        </View>
      </View>

      {/* Forecast cards */}
      <View style={{ gap: 6 }}>
        <SkeletonBlock width={120} height={16} />
        <View style={{ flexDirection: 'row', gap: 10 }}>
          {[0, 1, 2].map((i) => (
            <SkeletonBlock key={i} width={200} height={180} style={{ borderRadius: 12 }} />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

export default function WeatherScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { isPro } = usePurchases();
  const [forecast, setForecast] = useState<ForecastResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedBand, setSelectedBand] = useState<ElevationBand>('summit');
  const [cachedAt, setCachedAt] = useState<number | null>(null);
  const { isOnline } = useOffline();

  const loadForecast = useCallback(async () => {
    try {
      setError(null);
      const { data, cachedAt: ts } = await cachedApiFetch<ForecastResponse>(
        `/api/v1/peaks/${slug}/forecast`,
        {
          cache: CACHE_TIERS.WEATHER,
          fetchOptions: { auth: false },
          onRefresh: (fresh) => {
            setForecast(fresh as ForecastResponse);
            setCachedAt(null);
          },
        },
        isOnline
      );
      setForecast(data);
      setCachedAt(ts);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load forecast');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [slug, isOnline]);

  useEffect(() => {
    loadForecast();
  }, [loadForecast]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadForecast();
  }, [loadForecast]);

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.light.bgPrimary }}>
        <Stack.Screen options={{ title: 'Weather' }} />
        <WeatherSkeleton />
      </View>
    );
  }

  if (error || !forecast) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.light.bgPrimary }}>
        <Stack.Screen options={{ title: 'Weather' }} />
        <ErrorState message={error || 'Forecast not available'} onRetry={loadForecast} />
      </View>
    );
  }

  if (!isPro) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.light.bgPrimary }}>
        <Stack.Screen options={{ title: `${forecast.peak.name} Weather` }} />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
          <SymbolView
            name="lock.fill"
            size={36}
            tintColor={colors.light.textMuted}
            style={{ width: 36, height: 36, marginBottom: 16 }}
          />
          <Text style={{ fontFamily: 'InstrumentSerif', fontSize: 24, color: colors.light.textPrimary, textAlign: 'center' }}>
            Full Forecast
          </Text>
          <Text style={{ fontFamily: 'Inter', fontSize: 14, color: colors.light.textMuted, textAlign: 'center', marginTop: 8, lineHeight: 20 }}>
            Upgrade to Pro for elevation-banded forecasts, sub-daily detail, hiker insights, and more.
          </Text>
          <Pressable
            onPress={() => router.push('/(modals)/paywall')}
            style={({ pressed }) => ({
              marginTop: 24,
              paddingHorizontal: 32,
              paddingVertical: 14,
              borderRadius: 12,
              backgroundColor: colors.accent.default,
              opacity: pressed ? 0.85 : 1,
            })}
          >
            <Text style={{ fontFamily: 'Inter-SemiBold', fontSize: 16, color: '#ffffff' }}>
              Upgrade to Pro
            </Text>
          </Pressable>
          <Pressable
            onPress={() => router.back()}
            style={{ marginTop: 12, paddingVertical: 8 }}
          >
            <Text style={{ fontFamily: 'Inter', fontSize: 14, color: colors.light.textMuted }}>
              Not Now
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const band = forecast.bands[selectedBand];
  const today = band.days[0];

  // Current period based on time of day
  const hour = new Date().getHours();
  const currentPeriod = today
    ? hour < 12
      ? today.morning
      : hour < 18
        ? today.afternoon
        : today.night
    : null;

  const bandOptions = [
    { key: 'summit' as const, label: 'Summit', elevation: forecast.bands.summit.elevation_ft },
    { key: 'mid' as const, label: 'Mid Mountain', elevation: forecast.bands.mid.elevation_ft },
    { key: 'base' as const, label: 'Trailhead', elevation: forecast.bands.base.elevation_ft },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.light.bgPrimary }}>
      <Stack.Screen
        options={{
          title: `${forecast.peak.name} Weather`,
        }}
      />

      <OfflineBanner />

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        contentContainerStyle={{ padding: 16, gap: 20 }}
      >
        {/* Header */}
        <View>
          <Text
            style={{
              fontFamily: 'InstrumentSerif',
              fontSize: 26,
              color: colors.light.textPrimary,
            }}
          >
            {forecast.peak.name}
          </Text>
          <Text
            style={{
              fontFamily: 'Inter',
              fontSize: 13,
              color: colors.light.textMuted,
              marginTop: 2,
            }}
          >
            7-Day Mountain Forecast
          </Text>
        </View>

        <StaleDataIndicator cachedAt={cachedAt} />

        {/* Elevation Band Selector */}
        <ElevationBandSelector
          bands={bandOptions}
          selected={selectedBand}
          onSelect={setSelectedBand}
        />

        {/* NL Summary */}
        <WeatherSummaryText summary={band.summary} />

        {/* Hiker Insights */}
        <HikerInsightsPanel insights={forecast.insights} />

        {/* Current Conditions Hero */}
        {today && currentPeriod && (
          <WeatherHero period={currentPeriod} day={today} bandLabel={band.label} />
        )}

        {/* Forecast Grid */}
        <View>
          <Text
            style={{
              fontFamily: 'Inter-SemiBold',
              fontSize: 15,
              color: colors.light.textPrimary,
              marginBottom: 10,
            }}
          >
            7-Day Forecast
          </Text>
          <ForecastGrid days={band.days} />
        </View>

        {/* Sunrise/Sunset */}
        {today && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              gap: 24,
              paddingVertical: 12,
              backgroundColor: colors.light.bgSecondary,
              borderRadius: 10,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <SymbolView
                name="sunrise.fill"
                size={18}
                tintColor={colors.accent.default}
                style={{ width: 18, height: 18 }}
              />
              <Text style={{ fontFamily: 'Inter-Medium', fontSize: 14, color: colors.light.textSecondary }}>
                {today.sunrise}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <SymbolView
                name="sunset.fill"
                size={18}
                tintColor={colors.accent.dark}
                style={{ width: 18, height: 18 }}
              />
              <Text style={{ fontFamily: 'Inter-Medium', fontSize: 14, color: colors.light.textSecondary }}>
                {today.sunset}
              </Text>
            </View>
          </View>
        )}

        {/* Attribution */}
        <Text
          style={{
            fontFamily: 'Inter',
            fontSize: 11,
            color: colors.light.textMuted,
            textAlign: 'center',
            paddingBottom: 20,
          }}
        >
          Powered by Open-Meteo
        </Text>
      </ScrollView>
    </View>
  );
}
