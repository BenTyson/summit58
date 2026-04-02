import { View, Text } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { colors } from '@/lib/theme/colors';
import { WeatherIcon } from './WeatherIcon';
import {
  weatherCodeToDescription,
  degreesToCardinal,
  getTemperatureColor,
} from '@saltgoat/shared/utils/weather';
import type { PeriodForecast, DayForecast } from '@/lib/types/api';

const TEMP_COLORS: Record<string, string> = {
  violet: '#7C3AED',
  blue: '#2B6CB0',
  sky: '#3182CE',
  neutral: colors.light.textPrimary,
  amber: '#D69E2E',
  orange: '#DD6B20',
  red: '#E53E3E',
};

interface StatPillProps {
  icon: string;
  label: string;
  value: string;
}

function StatPill({ icon, label, value }: StatPillProps) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.light.bgSecondary,
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 6,
        gap: 5,
      }}
    >
      <SymbolView
        name={icon as any}
        size={14}
        tintColor={colors.light.textMuted}
        style={{ width: 14, height: 14 }}
      />
      <View>
        <Text style={{ fontFamily: 'Inter', fontSize: 10, color: colors.light.textMuted }}>
          {label}
        </Text>
        <Text style={{ fontFamily: 'Inter-SemiBold', fontSize: 13, color: colors.light.textPrimary }}>
          {value}
        </Text>
      </View>
    </View>
  );
}

interface WeatherHeroProps {
  period: PeriodForecast;
  day: DayForecast;
  bandLabel: string;
}

export function WeatherHero({ period, day, bandLabel }: WeatherHeroProps) {
  const description = weatherCodeToDescription(period.weather_code);
  const tempColorKey = getTemperatureColor(period.temperature_f);
  const tempColor = TEMP_COLORS[tempColorKey] || colors.light.textPrimary;
  const windDir = degreesToCardinal(period.wind_direction);

  return (
    <View
      style={{
        backgroundColor: colors.light.bgSecondary,
        borderRadius: 14,
        padding: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.light.border,
      }}
    >
      <Text style={{ fontFamily: 'Inter', fontSize: 12, color: colors.light.textMuted, marginBottom: 4 }}>
        Current conditions at {bandLabel}
      </Text>

      <WeatherIcon code={period.weather_code} size={48} tintColor={tempColor} />

      <Text
        style={{
          fontFamily: 'Inter-Bold',
          fontSize: 48,
          color: tempColor,
          marginTop: 4,
        }}
      >
        {Math.round(period.temperature_f)}{String.fromCharCode(176)}
      </Text>

      <Text style={{ fontFamily: 'Inter', fontSize: 14, color: colors.light.textMuted, marginBottom: 2 }}>
        Feels like {Math.round(period.feels_like_f)}{String.fromCharCode(176)}
      </Text>

      <Text style={{ fontFamily: 'Inter-Medium', fontSize: 15, color: colors.light.textSecondary }}>
        {description}
      </Text>

      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: 8,
          marginTop: 16,
        }}
      >
        <StatPill icon="wind" label="Wind" value={`${period.wind_speed_mph} mph ${windDir}`} />
        <StatPill icon="humidity.fill" label="Humidity" value={`${period.humidity_percent}%`} />
        <StatPill icon="sun.max.fill" label="UV" value={`${period.uv_index}`} />
        <StatPill icon="cloud.fill" label="Cloud" value={`${period.cloud_cover_percent}%`} />
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          gap: 16,
          marginTop: 12,
        }}
      >
        <Text style={{ fontFamily: 'Inter', fontSize: 13, color: colors.light.textMuted }}>
          H: {Math.round(day.high_f)}{String.fromCharCode(176)}
        </Text>
        <Text style={{ fontFamily: 'Inter', fontSize: 13, color: colors.light.textMuted }}>
          L: {Math.round(day.low_f)}{String.fromCharCode(176)}
        </Text>
      </View>
    </View>
  );
}
