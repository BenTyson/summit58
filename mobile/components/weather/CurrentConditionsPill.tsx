import { View, Text } from 'react-native';
import { colors } from '@/lib/theme/colors';
import {
	weatherCodeToDescription,
	degreesToCardinal
} from '@saltgoat/shared/utils/weather';
import type { PeakConditions } from '@saltgoat/shared/types/helpers';

function getSeverityColor(code: number | null): string {
	if (code === null) return colors.light.textMuted;
	if (code <= 3) return colors.alpine.pine;
	if (code <= 55) return colors.accent.dark;
	if (code <= 67) return colors.semantic.warning;
	if (code <= 77) return colors.class[4];
	if (code >= 95) return colors.semantic.danger;
	return colors.light.textMuted;
}

interface CurrentConditionsPillProps {
	condition: PeakConditions;
}

export function CurrentConditionsPill({ condition }: CurrentConditionsPillProps) {
	const description = weatherCodeToDescription(condition.weather_code);
	const severityColor = getSeverityColor(condition.weather_code);
	const windDir = degreesToCardinal(condition.wind_direction);

	return (
		<View
			style={{
				flexDirection: 'row',
				alignItems: 'center',
				backgroundColor: severityColor + '15',
				borderRadius: 8,
				paddingHorizontal: 12,
				paddingVertical: 8,
				gap: 12,
				borderWidth: 1,
				borderColor: severityColor + '30'
			}}>
			<Text style={{ fontFamily: 'Inter-Bold', fontSize: 18, color: severityColor }}>
				{condition.high_f != null ? `${Math.round(condition.high_f)}F` : '--'}
			</Text>
			<Text
				style={{
					fontFamily: 'Inter-Medium',
					fontSize: 13,
					color: colors.light.textSecondary,
					flex: 1
				}}>
				{description}
			</Text>
			{condition.wind_speed_mph != null && (
				<Text style={{ fontFamily: 'Inter', fontSize: 12, color: colors.light.textMuted }}>
					{Math.round(condition.wind_speed_mph)} mph {windDir}
				</Text>
			)}
		</View>
	);
}
