import { View, Text } from 'react-native';
import { colors } from '@/lib/theme/colors';
import { ClassBadge } from '@/components/ui/ClassBadge';
import type { Route } from '@saltgoat/shared/types/helpers';

interface RouteCardProps {
	route: Route;
	isStandard?: boolean;
}

export function RouteCard({ route, isStandard }: RouteCardProps) {
	return (
		<View
			style={{
				backgroundColor: colors.light.bgSecondary,
				borderRadius: 10,
				padding: 14,
				borderWidth: 1,
				borderColor: colors.light.border
			}}>
			<View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
				<ClassBadge difficulty={route.difficulty_class} size="md" />
				<Text
					style={{
						flex: 1,
						fontFamily: 'Inter-SemiBold',
						fontSize: 15,
						color: colors.light.textPrimary
					}}
					numberOfLines={1}>
					{route.name}
				</Text>
				{isStandard && (
					<View
						style={{
							backgroundColor: colors.accent.default + '20',
							paddingHorizontal: 8,
							paddingVertical: 2,
							borderRadius: 4
						}}>
						<Text
							style={{
								fontFamily: 'Inter-Medium',
								fontSize: 11,
								color: colors.accent.dark
							}}>
							Standard
						</Text>
					</View>
				)}
			</View>

			<View style={{ flexDirection: 'row', gap: 16, marginTop: 10 }}>
				<StatItem label={`${route.distance_miles} mi`} />
				<StatItem label={`${route.elevation_gain_ft?.toLocaleString()} ft gain`} />
				{route.typical_time_hours && (
					<StatItem label={`${route.typical_time_hours} hrs`} />
				)}
			</View>
		</View>
	);
}

function StatItem({ label }: { label: string }) {
	return (
		<Text style={{ fontFamily: 'Inter', fontSize: 13, color: colors.light.textSecondary }}>
			{label}
		</Text>
	);
}
