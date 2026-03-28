import { View, Text, Image, Pressable } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { colors } from '@/lib/theme/colors';
import { shadows } from '@/lib/theme/shadows';
import { ClassBadge } from '@/components/ui/ClassBadge';
import type { PeakWithStandardRoute } from '@saltgoat/shared/types/helpers';

interface PeakCardProps {
	peak: PeakWithStandardRoute;
	summited?: boolean;
	onPress: () => void;
}

export function PeakCard({ peak, summited, onPress }: PeakCardProps) {
	const route = peak.standard_route;

	return (
		<Pressable
			onPress={onPress}
			style={({ pressed }) => ({
				flexDirection: 'row',
				backgroundColor: colors.light.bgPrimary,
				borderRadius: 12,
				overflow: 'hidden',
				opacity: pressed ? 0.9 : 1,
				...shadows.card
			})}>
			{/* Thumbnail */}
			<View style={{ width: 100, height: 100 }}>
				{peak.thumbnail_url ? (
					<Image
						source={{ uri: peak.thumbnail_url }}
						style={{ width: 100, height: 100 }}
						resizeMode="cover"
					/>
				) : (
					<View
						style={{
							width: 100,
							height: 100,
							backgroundColor: colors.light.bgTertiary,
							alignItems: 'center',
							justifyContent: 'center'
						}}>
						<SymbolView
							name={{ ios: 'mountain.2', android: 'landscape', web: 'landscape' }}
							tintColor={colors.light.textMuted}
							size={32}
						/>
					</View>
				)}
				{summited && (
					<View
						style={{
							position: 'absolute',
							top: 6,
							right: 6,
							width: 22,
							height: 22,
							borderRadius: 11,
							backgroundColor: colors.accent.default,
							alignItems: 'center',
							justifyContent: 'center'
						}}>
						<SymbolView
							name={{ ios: 'checkmark', android: 'check', web: 'check' }}
							tintColor="#ffffff"
							size={13}
						/>
					</View>
				)}
			</View>

			{/* Content */}
			<View style={{ flex: 1, padding: 12, justifyContent: 'center' }}>
				<Text
					style={{
						fontFamily: 'InstrumentSerif',
						fontSize: 17,
						color: colors.light.textPrimary
					}}
					numberOfLines={1}>
					{peak.name}
				</Text>
				<Text
					style={{
						fontFamily: 'Inter',
						fontSize: 13,
						color: colors.light.textSecondary,
						marginTop: 2
					}}>
					{peak.elevation.toLocaleString()} ft &middot; {peak.range}
				</Text>
				{route && (
					<View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 8 }}>
						<ClassBadge difficulty={route.difficulty_class} />
						<Text style={{ fontFamily: 'Inter', fontSize: 12, color: colors.light.textMuted }}>
							{route.distance_miles} mi &middot; {route.elevation_gain_ft?.toLocaleString()} ft gain
						</Text>
					</View>
				)}
			</View>
		</Pressable>
	);
}
