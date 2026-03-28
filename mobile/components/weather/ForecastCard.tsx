import { View, Text } from 'react-native';
import { colors } from '@/lib/theme/colors';
import { weatherCodeToDescription } from '@saltgoat/shared/utils/weather';
import type { PeakConditions } from '@saltgoat/shared/types/helpers';

interface ForecastCardProps {
	condition: PeakConditions;
}

export function ForecastCard({ condition }: ForecastCardProps) {
	const date = new Date(condition.forecast_date + 'T12:00:00');
	const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
	const description = weatherCodeToDescription(condition.weather_code);

	return (
		<View
			style={{
				backgroundColor: colors.light.bgSecondary,
				borderRadius: 10,
				padding: 12,
				width: 100,
				alignItems: 'center',
				borderWidth: 1,
				borderColor: colors.light.border
			}}>
			<Text style={{ fontFamily: 'Inter-SemiBold', fontSize: 13, color: colors.light.textPrimary }}>
				{dayName}
			</Text>

			<Text
				style={{
					fontFamily: 'Inter',
					fontSize: 11,
					color: colors.light.textMuted,
					marginTop: 4,
					textAlign: 'center'
				}}
				numberOfLines={1}>
				{description}
			</Text>

			<View style={{ flexDirection: 'row', alignItems: 'baseline', marginTop: 6, gap: 4 }}>
				<Text style={{ fontFamily: 'Inter-Bold', fontSize: 16, color: colors.light.textPrimary }}>
					{condition.high_f != null ? Math.round(condition.high_f) : '--'}
				</Text>
				<Text style={{ fontFamily: 'Inter', fontSize: 13, color: colors.light.textMuted }}>
					/ {condition.low_f != null ? Math.round(condition.low_f) : '--'}
				</Text>
			</View>

			{condition.wind_speed_mph != null && condition.wind_speed_mph > 0 && (
				<Text
					style={{
						fontFamily: 'Inter',
						fontSize: 11,
						color: colors.light.textMuted,
						marginTop: 4
					}}>
					{Math.round(condition.wind_speed_mph)} mph
				</Text>
			)}
		</View>
	);
}
