import { useState, useCallback, useRef } from 'react';
import { View, Text, FlatList, RefreshControl } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { colors } from '@/lib/theme/colors';
import { apiFetch } from '@/lib/api';
import { useSession } from '@/lib/auth/AuthProvider';
import { LoadingState } from '@/components/ui/LoadingState';
import { ErrorState } from '@/components/ui/ErrorState';
import { ForumAuthorInfo } from '@/components/forum/ForumAuthorInfo';
import { PeakTag } from '@/components/forum/PeakTag';
import { ForumReactions } from '@/components/forum/ForumReactions';
import { ReplyCard } from '@/components/forum/ReplyCard';
import { ReplyComposer } from '@/components/forum/ReplyComposer';
import type {
	ForumTopicDetail,
	ForumReply,
	ForumReactionData,
	ForumTopicDetailResponse,
	ForumRepliesResponse
} from '@/lib/types/api';

export default function TopicDetailScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const { user } = useSession();
	const [topic, setTopic] = useState<ForumTopicDetail | null>(null);
	const [replies, setReplies] = useState<ForumReply[]>([]);
	const [reactions, setReactions] = useState<Record<string, ForumReactionData>>({});
	const [nextCursor, setNextCursor] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const [loadingMore, setLoadingMore] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [replyToReply, setReplyToReply] = useState<ForumReply | null>(null);
	const loadingMoreRef = useRef(false);

	const loadTopic = useCallback(async () => {
		try {
			setError(null);
			const data = await apiFetch<ForumTopicDetailResponse>(
				`/api/v1/forum/topics/${id}`,
				{ auth: !!user }
			);
			setTopic(data.topic);
			setReplies(data.replies);
			setReactions(data.reactions);
			setNextCursor(data.nextCursor);
		} catch (e) {
			setError(e instanceof Error ? e.message : 'Failed to load topic');
		} finally {
			setLoading(false);
			setRefreshing(false);
		}
	}, [id, user]);

	useFocusEffect(
		useCallback(() => {
			loadTopic();
		}, [loadTopic])
	);

	const handleRefresh = () => {
		setRefreshing(true);
		loadTopic();
	};

	const handleLoadMore = async () => {
		if (!nextCursor || loadingMoreRef.current) return;
		loadingMoreRef.current = true;
		setLoadingMore(true);
		try {
			const data = await apiFetch<ForumRepliesResponse>(
				`/api/v1/forum/topics/${id}/replies?cursor=${nextCursor}`,
				{ auth: !!user }
			);
			setReplies((prev) => [...prev, ...data.replies]);
			setReactions((prev) => ({ ...prev, ...data.reactions }));
			setNextCursor(data.nextCursor);
		} catch {
			// Fail silently on pagination
		} finally {
			setLoadingMore(false);
			loadingMoreRef.current = false;
		}
	};

	const handleReply = async (body: string) => {
		if (!user) return;
		const res = await apiFetch<{ reply: ForumReply }>(
			`/api/v1/forum/topics/${id}/replies`,
			{
				method: 'POST',
				body: {
					body,
					reply_to_id: replyToReply?.id
				}
			}
		);
		setReplies((prev) => [...prev, res.reply]);
		setReplyToReply(null);
	};

	const handleReactionUpdate = (postId: string, data: ForumReactionData) => {
		setReactions((prev) => ({ ...prev, [postId]: data }));
	};

	if (loading) {
		return (
			<View style={{ flex: 1, backgroundColor: colors.light.bgPrimary }}>
				<Stack.Screen options={{ title: '' }} />
				<LoadingState />
			</View>
		);
	}

	if (error || !topic) {
		return (
			<View style={{ flex: 1, backgroundColor: colors.light.bgPrimary }}>
				<Stack.Screen options={{ title: 'Topic' }} />
				<ErrorState message={error || 'Topic not found'} onRetry={loadTopic} />
			</View>
		);
	}

	const defaultReactions: ForumReactionData = { counts: {}, userReactions: [] };

	const TopicHeader = () => (
		<View style={{ padding: 16, paddingBottom: 8 }}>
			{/* Category badge */}
			<Text
				style={{
					fontFamily: 'Inter',
					fontSize: 12,
					color: colors.light.textMuted,
					textTransform: 'uppercase',
					letterSpacing: 0.5,
					marginBottom: 6
				}}>
				{topic.category.name}
			</Text>

			<Text
				style={{
					fontFamily: 'InstrumentSerif',
					fontSize: 24,
					color: colors.light.textPrimary,
					lineHeight: 30
				}}>
				{topic.title}
			</Text>

			{topic.peak && (
				<View style={{ marginTop: 8 }}>
					<PeakTag peak={topic.peak} />
				</View>
			)}

			<View style={{ marginTop: 12 }}>
				<ForumAuthorInfo author={topic.author} timestamp={topic.created_at} />
			</View>

			{/* Body */}
			<Text
				style={{
					fontFamily: 'Inter',
					fontSize: 15,
					color: colors.light.textSecondary,
					lineHeight: 24,
					marginTop: 16
				}}>
				{topic.body}
			</Text>

			{/* Reactions */}
			<View style={{ marginTop: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: colors.light.border }}>
				<ForumReactions
					reactableType="topic"
					reactableId={topic.id}
					data={reactions[topic.id] ?? defaultReactions}
					onUpdate={(data) => handleReactionUpdate(topic.id, data)}
				/>
			</View>

			{/* Replies header */}
			{replies.length > 0 && (
				<Text
					style={{
						fontFamily: 'Inter-SemiBold',
						fontSize: 16,
						color: colors.light.textPrimary,
						marginTop: 16,
						marginBottom: 4
					}}>
					{topic.reply_count} {topic.reply_count === 1 ? 'Reply' : 'Replies'}
				</Text>
			)}
		</View>
	);

	return (
		<View style={{ flex: 1, backgroundColor: colors.light.bgPrimary }}>
			<Stack.Screen options={{ title: topic.category.name }} />

			<FlatList
				data={replies}
				keyExtractor={(item) => item.id}
				ListHeaderComponent={TopicHeader}
				renderItem={({ item }) => (
					<View style={{ paddingHorizontal: 16, paddingVertical: 4 }}>
						<ReplyCard
							reply={item}
							reactions={reactions[item.id]}
							onReply={() => setReplyToReply(item)}
							onReactionUpdate={handleReactionUpdate}
						/>
					</View>
				)}
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
				}
				onEndReached={handleLoadMore}
				onEndReachedThreshold={0.3}
				contentContainerStyle={{ paddingBottom: 8 }}
				ListFooterComponent={
					loadingMore ? (
						<View style={{ padding: 16, alignItems: 'center' }}>
							<Text style={{ fontFamily: 'Inter', fontSize: 13, color: colors.light.textMuted }}>
								Loading more...
							</Text>
						</View>
					) : null
				}
			/>

			{user && (
				<ReplyComposer
					onSubmit={handleReply}
					quotedReply={
						replyToReply
							? {
									authorName: replyToReply.author.display_name,
									body: replyToReply.body.slice(0, 150)
								}
							: null
					}
					onClearQuote={() => setReplyToReply(null)}
					isLocked={topic.is_locked}
				/>
			)}
		</View>
	);
}
