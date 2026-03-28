import { View, Text } from 'react-native';
import { colors } from '@/lib/theme/colors';
import { StarRating } from '@/components/ui/StarRating';
import type { ReviewWithProfile } from '@saltgoat/shared/types/helpers';

interface ReviewCardProps {
	review: ReviewWithProfile;
}

export function ReviewCard({ review }: ReviewCardProps) {
	const date = new Date(review.created_at!).toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric'
	});

	return (
		<View
			style={{
				backgroundColor: colors.light.bgSecondary,
				borderRadius: 10,
				padding: 14,
				borderWidth: 1,
				borderColor: colors.light.border
			}}>
			<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
				<View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
					<StarRating rating={review.rating} />
					<Text style={{ fontFamily: 'Inter-Medium', fontSize: 13, color: colors.light.textPrimary }}>
						{review.profile?.display_name || 'Anonymous'}
					</Text>
				</View>
				<Text style={{ fontFamily: 'Inter', fontSize: 12, color: colors.light.textMuted }}>
					{date}
				</Text>
			</View>

			{review.title && (
				<Text
					style={{
						fontFamily: 'Inter-SemiBold',
						fontSize: 14,
						color: colors.light.textPrimary,
						marginTop: 8
					}}>
					{review.title}
				</Text>
			)}

			{review.body && (
				<Text
					style={{
						fontFamily: 'Inter',
						fontSize: 14,
						color: colors.light.textSecondary,
						marginTop: 4,
						lineHeight: 20
					}}
					numberOfLines={4}>
					{review.body}
				</Text>
			)}
		</View>
	);
}
