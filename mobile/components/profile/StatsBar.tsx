import { View, Text } from 'react-native';
import { colors } from '@/lib/theme/colors';

interface StatsBarProps {
	totalSummits: number;
	uniquePeaks: number;
	progress: number;
}

export function StatsBar({ totalSummits, uniquePeaks, progress }: StatsBarProps) {
	return (
		<View
			style={{
				flexDirection: 'row',
				backgroundColor: colors.light.bgSecondary,
				borderRadius: 12,
				padding: 16,
				borderWidth: 1,
				borderColor: colors.light.border
			}}>
			<StatColumn label="Summits" value={totalSummits.toString()} />
			<View style={{ width: 1, backgroundColor: colors.light.border, marginHorizontal: 16 }} />
			<StatColumn label="Peaks" value={`${uniquePeaks}/58`} />
			<View style={{ width: 1, backgroundColor: colors.light.border, marginHorizontal: 16 }} />
			<StatColumn label="Complete" value={`${Math.round(progress)}%`} />
		</View>
	);
}

function StatColumn({ label, value }: { label: string; value: string }) {
	return (
		<View style={{ flex: 1, alignItems: 'center' }}>
			<Text
				style={{
					fontFamily: 'Inter-Bold',
					fontSize: 20,
					color: colors.light.textPrimary
				}}>
				{value}
			</Text>
			<Text
				style={{
					fontFamily: 'Inter',
					fontSize: 12,
					color: colors.light.textMuted,
					marginTop: 2
				}}>
				{label}
			</Text>
		</View>
	);
}
