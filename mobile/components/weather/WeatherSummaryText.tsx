import { Text } from 'react-native';
import { colors } from '@/lib/theme/colors';

interface WeatherSummaryTextProps {
  summary: string;
}

export function WeatherSummaryText({ summary }: WeatherSummaryTextProps) {
  if (!summary) return null;

  return (
    <Text
      style={{
        fontFamily: 'InstrumentSerif',
        fontSize: 18,
        lineHeight: 26,
        color: colors.light.textSecondary,
      }}
    >
      {summary}
    </Text>
  );
}
