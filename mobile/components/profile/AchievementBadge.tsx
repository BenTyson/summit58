import { View, Text } from 'react-native';
import { colors } from '@/lib/theme/colors';
import type { UserAchievementWithDef } from '@saltgoat/shared/types/helpers';

interface AchievementBadgeProps {
	achievement: UserAchievementWithDef;
}

export function AchievementBadge({ achievement }: AchievementBadgeProps) {
	const { definition } = achievement;
	const earnedDate = new Date(achievement.earned_at!).toLocaleDateString('en-US', {
		month: 'short',
		year: 'numeric'
	});

	return (
		<View
			style={{
				backgroundColor: colors.accent.default + '15',
				borderRadius: 10,
				padding: 12,
				width: 120,
				alignItems: 'center',
				borderWidth: 1,
				borderColor: colors.accent.default + '30'
			}}>
			<View
				style={{
					width: 40,
					height: 40,
					borderRadius: 20,
					backgroundColor: colors.accent.default,
					alignItems: 'center',
					justifyContent: 'center',
					marginBottom: 8
				}}>
				<Text style={{ fontSize: 18 }}>{definition.icon || '+'}</Text>
			</View>
			<Text
				style={{
					fontFamily: 'Inter-SemiBold',
					fontSize: 12,
					color: colors.light.textPrimary,
					textAlign: 'center'
				}}
				numberOfLines={2}>
				{definition.title}
			</Text>
			<Text
				style={{
					fontFamily: 'Inter',
					fontSize: 11,
					color: colors.light.textMuted,
					marginTop: 2
				}}>
				{earnedDate}
			</Text>
		</View>
	);
}
