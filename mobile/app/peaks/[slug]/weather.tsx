import { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { colors } from '@/lib/theme/colors';
import { cachedApiFetch } from '@/lib/offline/cache';
import { useOffline } from '@/lib/offline/OfflineProvider';
import { CACHE_TIERS } from '@/lib/offline/types';
import { LoadingState } from '@/components/ui/LoadingState';
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

export default function WeatherScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
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
        <LoadingState message="Loading forecast..." />
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
