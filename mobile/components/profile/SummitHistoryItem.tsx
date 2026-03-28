import { View, Text, Image, Pressable } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { colors } from '@/lib/theme/colors';
import { ClassBadge } from '@/components/ui/ClassBadge';
import type { UserSummitWithPeak } from '@saltgoat/shared/types/helpers';

interface SummitHistoryItemProps {
	summit: UserSummitWithPeak;
	onPress?: () => void;
}

export function SummitHistoryItem({ summit, onPress }: SummitHistoryItemProps) {
	const date = new Date(summit.date_summited).toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric'
	});

	return (
		<Pressable
			onPress={onPress}
			style={({ pressed }) => ({
				flexDirection: 'row',
				alignItems: 'center',
				backgroundColor: colors.light.bgPrimary,
				borderRadius: 10,
				padding: 12,
				opacity: pressed && onPress ? 0.9 : 1,
				borderWidth: 1,
				borderColor: colors.light.border
			})}>
			{/* Thumbnail */}
			<View style={{ width: 48, height: 48, borderRadius: 8, overflow: 'hidden' }}>
				{summit.peak.thumbnail_url ? (
					<Image
						source={{ uri: summit.peak.thumbnail_url }}
						style={{ width: 48, height: 48 }}
						resizeMode="cover"
					/>
				) : (
					<View
						style={{
							width: 48,
							height: 48,
							backgroundColor: colors.light.bgTertiary,
							alignItems: 'center',
							justifyContent: 'center'
						}}>
						<SymbolView
							name={{ ios: 'mountain.2', android: 'landscape', web: 'landscape' }}
							tintColor={colors.light.textMuted}
							size={20}
						/>
					</View>
				)}
			</View>

			{/* Content */}
			<View style={{ flex: 1, marginLeft: 12 }}>
				<Text
					style={{
						fontFamily: 'Inter-SemiBold',
						fontSize: 15,
						color: colors.light.textPrimary
					}}
					numberOfLines={1}>
					{summit.peak.name}
				</Text>
				<View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 }}>
					<Text style={{ fontFamily: 'Inter', fontSize: 13, color: colors.light.textMuted }}>
						{date}
					</Text>
					{summit.route && (
						<>
							<Text style={{ color: colors.light.textMuted }}>&#183;</Text>
							<Text
								style={{
									fontFamily: 'Inter',
									fontSize: 13,
									color: colors.light.textMuted
								}}>
								{summit.route.name}
							</Text>
						</>
					)}
				</View>
			</View>

			{/* Class badge */}
			{summit.route && <ClassBadge difficulty={summit.route.difficulty_class} />}
		</Pressable>
	);
}
