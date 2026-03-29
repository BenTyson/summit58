import { View, Text, Image, Pressable } from 'react-native';
import { router } from 'expo-router';
import { colors } from '@/lib/theme/colors';
import { ClassBadge } from '@/components/ui/ClassBadge';
import { ReactionBar } from '@/components/social/ReactionBar';
import { CommentButton } from '@/components/social/CommentButton';
import type { SummitActivityData, ReactionData, CommentData } from '@/lib/types/api';

interface SummitActivityCardProps {
	data: SummitActivityData;
	summitId: string;
	reaction?: ReactionData;
	commentData?: CommentData;
	onCommentPress: () => void;
	onReactionUpdate?: (data: ReactionData) => void;
}

export function SummitActivityCard({
	data,
	summitId,
	reaction,
	commentData,
	onCommentPress,
	onReactionUpdate,
}: SummitActivityCardProps) {
	const date = new Date(data.date_summited).toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
	});

	return (
		<View style={{ gap: 10 }}>
			<Pressable
				onPress={() => router.push(`/peaks/${data.peak.slug}`)}
				style={{ flexDirection: 'row', gap: 12 }}>
				{data.peak.thumbnail_url && (
					<Image
						source={{ uri: data.peak.thumbnail_url }}
						style={{ width: 48, height: 48, borderRadius: 8 }}
						resizeMode="cover"
					/>
				)}
				<View style={{ flex: 1, justifyContent: 'center' }}>
					<View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
						<Text
							style={{
								fontFamily: 'Inter-SemiBold',
								fontSize: 15,
								color: colors.light.textPrimary,
							}}
							numberOfLines={1}>
							{data.peak.name}
						</Text>
						{data.route && <ClassBadge difficulty={data.route.difficulty_class} />}
					</View>
					<Text
						style={{
							fontFamily: 'Inter',
							fontSize: 13,
							color: colors.light.textSecondary,
							marginTop: 2,
						}}>
						{data.peak.elevation.toLocaleString()} ft &middot; {date}
					</Text>
				</View>
			</Pressable>

			{data.conditions && (
				<Text
					style={{
						fontFamily: 'Inter',
						fontSize: 13,
						color: colors.light.textSecondary,
						lineHeight: 18,
					}}
					numberOfLines={2}>
					{data.conditions}
				</Text>
			)}

			<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
				{reaction && (
					<ReactionBar
						summitId={summitId}
						data={reaction}
						onUpdate={onReactionUpdate}
					/>
				)}
				{commentData && (
					<CommentButton count={commentData.count} onPress={onCommentPress} />
				)}
			</View>
		</View>
	);
}
