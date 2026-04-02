import { FlatList } from 'react-native';
import { ForecastDayCard } from './ForecastDayCard';
import type { DayForecast } from '@/lib/types/api';

interface ForecastGridProps {
  days: DayForecast[];
}

export function ForecastGrid({ days }: ForecastGridProps) {
  const today = new Date().toISOString().split('T')[0];

  return (
    <FlatList
      horizontal
      data={days}
      keyExtractor={(item) => item.date}
      renderItem={({ item }) => (
        <ForecastDayCard day={item} isToday={item.date === today} />
      )}
      contentContainerStyle={{ gap: 10, paddingHorizontal: 2 }}
      showsHorizontalScrollIndicator={false}
    />
  );
}
