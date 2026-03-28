import { View, Text } from 'react-native';
import { colors } from '@/lib/theme/colors';
import type { PeakGridItem } from '@/lib/types/api';

const COLUMNS = 6;

interface My58GridProps {
	peaks: PeakGridItem[];
	summitedIds: Set<string>;
}

export function My58Grid({ peaks, summitedIds }: My58GridProps) {
	const summitedCount = summitedIds.size;

	return (
		<View>
			<View
				style={{
					flexDirection: 'row',
					justifyContent: 'space-between',
					alignItems: 'center',
					marginBottom: 12
				}}>
				<Text style={{ fontFamily: 'Inter-SemiBold', fontSize: 18, color: colors.light.textPrimary }}>
					My 58
				</Text>
				<Text style={{ fontFamily: 'Inter', fontSize: 13, color: colors.light.textMuted }}>
					{summitedCount} of 58
				</Text>
			</View>

			<View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
				{peaks.map((peak) => {
					const isSummited = summitedIds.has(peak.id);
					return (
						<View
							key={peak.id}
							style={{
								width: `${(100 - (COLUMNS - 1) * 1.5) / COLUMNS}%`,
								aspectRatio: 1,
								borderRadius: 6,
								backgroundColor: isSummited ? colors.accent.default : colors.light.bgTertiary,
								alignItems: 'center',
								justifyContent: 'center'
							}}>
							<Text
								style={{
									fontFamily: 'Inter-SemiBold',
									fontSize: 11,
									color: isSummited ? '#ffffff' : colors.light.textMuted
								}}>
								{peak.rank}
							</Text>
						</View>
					);
				})}
			</View>
		</View>
	);
}
