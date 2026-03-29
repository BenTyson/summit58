import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { colors } from '@/lib/theme/colors';
import { StarRating } from '@/components/ui/StarRating';
import type { ReviewActivityData } from '@/lib/types/api';

interface ReviewActivityCardProps {
	data: ReviewActivityData;
}

export function ReviewActivityCard({ data }: ReviewActivityCardProps) {
	return (
		<Pressable onPress={() => router.push(`/peaks/${data.peak.slug}`)}>
			<View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
				<StarRating rating={data.rating} />
				<Text
					style={{
						fontFamily: 'Inter-SemiBold',
						fontSize: 15,
						color: colors.light.textPrimary,
					}}
					numberOfLines={1}>
					{data.peak.name}
				</Text>
			</View>

			{data.title && (
				<Text
					style={{
						fontFamily: 'Inter-Medium',
						fontSize: 14,
						color: colors.light.textPrimary,
						marginTop: 6,
					}}
					numberOfLines={1}>
					{data.title}
				</Text>
			)}

			{data.body && (
				<Text
					style={{
						fontFamily: 'Inter',
						fontSize: 13,
						color: colors.light.textSecondary,
						lineHeight: 18,
						marginTop: 4,
					}}
					numberOfLines={3}>
					{data.body}
				</Text>
			)}
		</Pressable>
	);
}
