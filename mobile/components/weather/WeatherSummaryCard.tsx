import { View, Text, Pressable } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { colors } from '@/lib/theme/colors';
import { WeatherIcon } from './WeatherIcon';
import {
  weatherCodeToDescription,
  degreesToCardinal,
  getTemperatureColor,
} from '@saltgoat/shared/utils/weather';
import type { ForecastResponse, HikerInsight } from '@/lib/types/api';

const TEMP_COLORS: Record<string, string> = {
  violet: '#7C3AED',
  blue: '#2B6CB0',
  sky: '#3182CE',
  neutral: colors.light.textPrimary,
  amber: '#D69E2E',
  orange: '#DD6B20',
  red: '#E53E3E',
};

const SEVERITY_COLORS: Record<HikerInsight['severity'], string> = {
  info: '#2B6CB0',
  caution: '#975A16',
  warning: '#C05621',
  danger: '#C53030',
};

interface WeatherSummaryCardProps {
  forecast: ForecastResponse;
  onViewFull: () => void;
}

export function WeatherSummaryCard({ forecast, onViewFull }: WeatherSummaryCardProps) {
  const summit = forecast.bands.summit;
  const today = summit.days[0];
  if (!today) return null;

  // Use current period based on time of day
  const hour = new Date().getHours();
  const currentPeriod = hour < 12 ? today.morning : hour < 18 ? today.afternoon : today.night;
  const tempColor = TEMP_COLORS[getTemperatureColor(currentPeriod.temperature_f)] || colors.light.textPrimary;
  const description = weatherCodeToDescription(currentPeriod.weather_code);
  const windDir = degreesToCardinal(currentPeriod.wind_direction);

  // Top-severity insight
  const topInsight = forecast.insights[0];

  return (
    <View style={{ gap: 12 }}>
      {/* Current conditions */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: colors.light.bgSecondary,
          borderRadius: 12,
          padding: 14,
          gap: 12,
          borderWidth: 1,
          borderColor: colors.light.border,
        }}
      >
        <WeatherIcon code={currentPeriod.weather_code} size={32} tintColor={tempColor} />

        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6 }}>
            <Text style={{ fontFamily: 'Inter-Bold', fontSize: 24, color: tempColor }}>
              {Math.round(currentPeriod.temperature_f)}{String.fromCharCode(176)}
            </Text>
            <Text style={{ fontFamily: 'Inter', fontSize: 13, color: colors.light.textMuted }}>
              feels {Math.round(currentPeriod.feels_like_f)}{String.fromCharCode(176)}
            </Text>
          </View>
          <Text style={{ fontFamily: 'Inter-Medium', fontSize: 13, color: colors.light.textSecondary }}>
            {description}
          </Text>
        </View>

        <View style={{ alignItems: 'flex-end' }}>
          <Text style={{ fontFamily: 'Inter', fontSize: 12, color: colors.light.textMuted }}>
            {currentPeriod.wind_speed_mph} mph {windDir}
          </Text>
          <Text style={{ fontFamily: 'Inter', fontSize: 12, color: colors.light.textMuted }}>
            H: {Math.round(today.high_f)}{String.fromCharCode(176)} L: {Math.round(today.low_f)}{String.fromCharCode(176)}
          </Text>
        </View>
      </View>

      {/* 3-day mini forecast */}
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {summit.days.slice(0, 3).map((day, i) => {
          const date = new Date(day.date + 'T12:00:00');
          const label = i === 0 ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' });
          const amCode = day.morning.weather_code;
          const pmCode = day.afternoon.weather_code;

          return (
            <View
              key={day.date}
              style={{
                flex: 1,
                backgroundColor: colors.light.bgSecondary,
                borderRadius: 10,
                padding: 10,
                alignItems: 'center',
                borderWidth: 1,
                borderColor: colors.light.border,
              }}
            >
              <Text style={{ fontFamily: 'Inter-Medium', fontSize: 12, color: colors.light.textSecondary }}>
                {label}
              </Text>
              <View style={{ flexDirection: 'row', gap: 4, marginVertical: 6 }}>
                <WeatherIcon code={amCode} size={16} />
                <WeatherIcon code={pmCode} size={16} />
              </View>
              <Text style={{ fontFamily: 'Inter-SemiBold', fontSize: 13, color: colors.light.textPrimary }}>
                {Math.round(day.high_f)}{String.fromCharCode(176)} / {Math.round(day.low_f)}{String.fromCharCode(176)}
              </Text>
            </View>
          );
        })}
      </View>

      {/* Top insight */}
      {topInsight && (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            paddingHorizontal: 4,
          }}
        >
          <SymbolView
            name="exclamationmark.triangle.fill"
            size={14}
            tintColor={SEVERITY_COLORS[topInsight.severity]}
            style={{ width: 14, height: 14 }}
          />
          <Text
            style={{
              fontFamily: 'Inter-Medium',
              fontSize: 13,
              color: SEVERITY_COLORS[topInsight.severity],
              flex: 1,
            }}
            numberOfLines={1}
          >
            {topInsight.title}
          </Text>
        </View>
      )}

      {/* Full forecast link */}
      <Pressable
        onPress={onViewFull}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: 10,
          borderRadius: 10,
          backgroundColor: colors.mountain.blue + '0A',
          borderWidth: 1,
          borderColor: colors.mountain.blue + '20',
          gap: 6,
        }}
      >
        <Text
          style={{
            fontFamily: 'Inter-SemiBold',
            fontSize: 14,
            color: colors.mountain.blueLight,
          }}
        >
          Full Forecast
        </Text>
        <SymbolView
          name="chevron.right"
          size={12}
          tintColor={colors.mountain.blueLight}
          style={{ width: 12, height: 12 }}
        />
      </Pressable>
    </View>
  );
}
