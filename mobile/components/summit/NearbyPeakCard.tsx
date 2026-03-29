import { View, Text, Image, Pressable } from 'react-native';
import { colors } from '@/lib/theme/colors';
import { ClassBadge } from '@/components/ui/ClassBadge';
import type { PeakWithStandardRoute } from '@saltgoat/shared/types/helpers';

interface NearbyPeakCardProps {
	peak: PeakWithStandardRoute;
	distance: number; // meters
	onChangePeak: () => void;
}

export function NearbyPeakCard({ peak, distance, onChangePeak }: NearbyPeakCardProps) {
	const distanceLabel =
		distance < 1000
			? `${Math.round(distance)}m away`
			: `${(distance / 1000).toFixed(1)}km away`;

	return (
		<View
			style={{
				backgroundColor: colors.light.bgSecondary,
				borderRadius: 16,
				overflow: 'hidden',
				borderWidth: 2,
				borderColor: colors.accent.default,
			}}>
			{peak.hero_image_url && (
				<Image
					source={{ uri: peak.hero_image_url }}
					style={{ width: '100%', height: 140 }}
					resizeMode="cover"
				/>
			)}
			<View style={{ padding: 16 }}>
				<View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
					<Text
						style={{
							fontFamily: 'InstrumentSerif',
							fontSize: 24,
							color: colors.light.textPrimary,
							flex: 1,
						}}>
						{peak.name}
					</Text>
					{peak.standard_route && (
						<ClassBadge difficulty={peak.standard_route.difficulty_class} size="md" />
					)}
				</View>
				<Text
					style={{
						fontFamily: 'Inter',
						fontSize: 14,
						color: colors.light.textSecondary,
					}}>
					{peak.elevation.toLocaleString()} ft &middot; {peak.range} &middot; {distanceLabel}
				</Text>
				<Pressable onPress={onChangePeak} hitSlop={8} style={{ marginTop: 12 }}>
					<Text
						style={{
							fontFamily: 'Inter-Medium',
							fontSize: 14,
							color: colors.accent.default,
						}}>
						Change Peak
					</Text>
				</Pressable>
			</View>
		</View>
	);
}
