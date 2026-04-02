import { View, Text } from 'react-native';
import { colors } from '@/lib/theme/colors';
import { WeatherIcon } from './WeatherIcon';
import { WindArrow } from './WindArrow';
import {
  getTemperatureColor,
  getWindSeverity,
} from '@saltgoat/shared/utils/weather';
import type { DayForecast, PeriodForecast } from '@/lib/types/api';

const TEMP_COLORS: Record<string, string> = {
  violet: '#7C3AED',
  blue: '#2B6CB0',
  sky: '#3182CE',
  neutral: colors.light.textPrimary,
  amber: '#D69E2E',
  orange: '#DD6B20',
  red: '#E53E3E',
};

const WIND_COLORS: Record<string, string> = {
  calm: colors.light.textMuted,
  moderate: '#D69E2E',
  strong: '#DD6B20',
  extreme: '#E53E3E',
};

interface ForecastDayCardProps {
  day: DayForecast;
  isToday: boolean;
}

function PeriodColumn({ period, label, isNight }: { period: PeriodForecast; label: string; isNight: boolean }) {
  const tempColor = TEMP_COLORS[getTemperatureColor(period.temperature_f)] || colors.light.textPrimary;
  const windColor = WIND_COLORS[getWindSeverity(period.wind_speed_mph)];

  return (
    <View style={{ flex: 1, alignItems: 'center', gap: 6 }}>
      <Text style={{ fontFamily: 'Inter-Medium', fontSize: 11, color: colors.light.textMuted }}>
        {label}
      </Text>
      <WeatherIcon code={period.weather_code} isNight={isNight} size={20} tintColor={tempColor} />
      <Text style={{ fontFamily: 'Inter-Bold', fontSize: 15, color: tempColor }}>
        {Math.round(period.temperature_f)}{String.fromCharCode(176)}
      </Text>
      <Text style={{ fontFamily: 'Inter', fontSize: 11, color: colors.light.textMuted }}>
        {Math.round(period.feels_like_f)}{String.fromCharCode(176)}
      </Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
        <WindArrow degrees={period.wind_direction} size={10} color={windColor} />
        <Text style={{ fontFamily: 'Inter', fontSize: 11, color: windColor }}>
          {period.wind_speed_mph}
        </Text>
      </View>
      {period.snow_in > 0 && (
        <View style={{ backgroundColor: '#EBF8FF', borderRadius: 4, paddingHorizontal: 4, paddingVertical: 1 }}>
          <Text style={{ fontFamily: 'Inter-Medium', fontSize: 10, color: '#3182CE' }}>
            {period.snow_in.toFixed(1)}"
          </Text>
        </View>
      )}
      <Text style={{ fontFamily: 'Inter', fontSize: 10, color: colors.light.textMuted }}>
        {period.cloud_cover_percent}%
      </Text>
    </View>
  );
}

export function ForecastDayCard({ day, isToday }: ForecastDayCardProps) {
  const date = new Date(day.date + 'T12:00:00');
  const dayName = isToday ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' });
  const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <View
      style={{
        backgroundColor: colors.light.bgPrimary,
        borderRadius: 12,
        padding: 12,
        width: 200,
        borderWidth: 1,
        borderColor: isToday ? colors.accent.default : colors.light.border,
        ...(isToday && { borderLeftWidth: 3 }),
      }}
    >
      <View style={{ alignItems: 'center', marginBottom: 10 }}>
        <Text style={{ fontFamily: 'Inter-SemiBold', fontSize: 14, color: colors.light.textPrimary }}>
          {dayName}
        </Text>
        <Text style={{ fontFamily: 'Inter', fontSize: 12, color: colors.light.textMuted }}>
          {dateStr}
        </Text>
      </View>

      {/* Column headers row */}
      <View style={{ flexDirection: 'row', gap: 4 }}>
        <PeriodColumn period={day.morning} label="AM" isNight={false} />
        <View style={{ width: 1, backgroundColor: colors.light.border }} />
        <PeriodColumn period={day.afternoon} label="PM" isNight={false} />
        <View style={{ width: 1, backgroundColor: colors.light.border }} />
        <PeriodColumn period={day.night} label="Night" isNight={true} />
      </View>

      {/* High/Low footer */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          gap: 12,
          marginTop: 10,
          paddingTop: 8,
          borderTopWidth: 1,
          borderTopColor: colors.light.border,
        }}
      >
        <Text style={{ fontFamily: 'Inter-Medium', fontSize: 12, color: colors.light.textSecondary }}>
          H: {Math.round(day.high_f)}{String.fromCharCode(176)}
        </Text>
        <Text style={{ fontFamily: 'Inter-Medium', fontSize: 12, color: colors.light.textMuted }}>
          L: {Math.round(day.low_f)}{String.fromCharCode(176)}
        </Text>
      </View>
    </View>
  );
}
