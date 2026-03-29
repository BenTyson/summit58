import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { colors } from '@/lib/theme/colors';
import { UserAvatar } from '@/components/social/UserAvatar';
import { SummitActivityCard } from './SummitActivityCard';
import { ReviewActivityCard } from './ReviewActivityCard';
import { TrailReportActivityCard } from './TrailReportActivityCard';
import { AchievementActivityCard } from './AchievementActivityCard';
import type {
	ActivityItem,
	SummitActivityData,
	ReviewActivityData,
	TrailReportActivityData,
	AchievementActivityData,
	ReactionData,
	CommentData,
} from '@/lib/types/api';

const TYPE_LABELS: Record<string, string> = {
	summit: 'summited',
	review: 'reviewed',
	trail_report: 'reported on',
	achievement: 'earned',
};

function formatRelativeDate(dateStr: string): string {
	const diff = Date.now() - new Date(dateStr).getTime();
	const minutes = Math.floor(diff / 60000);
	if (minutes < 1) return 'just now';
	if (minutes < 60) return `${minutes}m ago`;
	const hours = Math.floor(minutes / 60);
	if (hours < 24) return `${hours}h ago`;
	const days = Math.floor(hours / 24);
	if (days < 7) return `${days}d ago`;
	return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

interface ActivityCardProps {
	item: ActivityItem;
	reaction?: ReactionData;
	commentData?: CommentData;
	onCommentPress: (summitId: string) => void;
	onReactionUpdate?: (summitId: string, data: ReactionData) => void;
}

export function ActivityCard({
	item,
	reaction,
	commentData,
	onCommentPress,
	onReactionUpdate,
}: ActivityCardProps) {
	const realSummitId = item.id.replace(/^(summit|review|report|achievement)-/, '');

	return (
		<View
			style={{
				backgroundColor: colors.light.bgSecondary,
				borderRadius: 12,
				padding: 14,
				borderWidth: 1,
				borderColor: colors.light.border,
			}}>
			{/* User header (for following feed) */}
			{item.user && (
				<Pressable
					onPress={() => router.push(`/users/${item.user!.id}`)}
					style={{
						flexDirection: 'row',
						alignItems: 'center',
						gap: 8,
						marginBottom: 10,
					}}>
					<UserAvatar user={item.user} size={28} navigateOnPress={false} />
					<View style={{ flex: 1 }}>
						<Text style={{ fontFamily: 'Inter-Medium', fontSize: 13, color: colors.light.textPrimary }}>
							{item.user.display_name || 'Someone'}{' '}
							<Text style={{ fontFamily: 'Inter', color: colors.light.textMuted }}>
								{TYPE_LABELS[item.type]}
							</Text>
						</Text>
					</View>
					<Text style={{ fontFamily: 'Inter', fontSize: 12, color: colors.light.textMuted }}>
						{formatRelativeDate(item.date)}
					</Text>
				</Pressable>
			)}

			{/* Date for own feed (no user header) */}
			{!item.user && item.type !== 'summit' && (
				<Text
					style={{
						fontFamily: 'Inter',
						fontSize: 12,
						color: colors.light.textMuted,
						marginBottom: 6,
					}}>
					{formatRelativeDate(item.date)}
				</Text>
			)}

			{/* Activity type content */}
			{item.type === 'summit' && (
				<SummitActivityCard
					data={item.data as SummitActivityData}
					summitId={realSummitId}
					reaction={reaction}
					commentData={commentData}
					onCommentPress={() => onCommentPress(realSummitId)}
					onReactionUpdate={onReactionUpdate ? (d) => onReactionUpdate(realSummitId, d) : undefined}
				/>
			)}

			{item.type === 'review' && (
				<ReviewActivityCard data={item.data as ReviewActivityData} />
			)}

			{item.type === 'trail_report' && (
				<TrailReportActivityCard data={item.data as TrailReportActivityData} />
			)}

			{item.type === 'achievement' && (
				<AchievementActivityCard data={item.data as AchievementActivityData} />
			)}
		</View>
	);
}
