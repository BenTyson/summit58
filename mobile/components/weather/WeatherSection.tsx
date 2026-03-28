import { View, Text, FlatList } from 'react-native';
import { colors } from '@/lib/theme/colors';
import { CurrentConditionsPill } from './CurrentConditionsPill';
import { ForecastCard } from './ForecastCard';
import type { PeakConditions } from '@saltgoat/shared/types/helpers';

interface WeatherSectionProps {
	conditions: PeakConditions[];
}

export function WeatherSection({ conditions }: WeatherSectionProps) {
	if (!conditions.length) {
		return (
			<View style={{ paddingVertical: 12 }}>
				<Text style={{ fontFamily: 'Inter', fontSize: 14, color: colors.light.textMuted }}>
					No weather data available
				</Text>
			</View>
		);
	}

	const today = conditions[0];
	const forecast = conditions.slice(1);

	return (
		<View style={{ gap: 12 }}>
			<CurrentConditionsPill condition={today} />

			{forecast.length > 0 && (
				<FlatList
					horizontal
					data={forecast}
					keyExtractor={(item) => item.forecast_date}
					renderItem={({ item }) => <ForecastCard condition={item} />}
					contentContainerStyle={{ gap: 8 }}
					showsHorizontalScrollIndicator={false}
				/>
			)}
		</View>
	);
}
