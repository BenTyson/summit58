import { View, Text } from 'react-native';
import { colors } from '@/lib/theme/colors';
import type { AchievementActivityData } from '@/lib/types/api';

interface AchievementActivityCardProps {
	data: AchievementActivityData;
}

export function AchievementActivityCard({ data }: AchievementActivityCardProps) {
	return (
		<View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
			<View
				style={{
					width: 40,
					height: 40,
					borderRadius: 20,
					backgroundColor: colors.accent.default,
					alignItems: 'center',
					justifyContent: 'center',
				}}>
				<Text style={{ fontSize: 18 }}>{data.definition.icon || '+'}</Text>
			</View>
			<View style={{ flex: 1 }}>
				<Text
					style={{
						fontFamily: 'Inter-SemiBold',
						fontSize: 14,
						color: colors.light.textPrimary,
					}}>
					{data.definition.title}
				</Text>
				<Text
					style={{
						fontFamily: 'Inter',
						fontSize: 13,
						color: colors.light.textSecondary,
						marginTop: 2,
					}}
					numberOfLines={2}>
					{data.definition.description}
				</Text>
			</View>
		</View>
	);
}
