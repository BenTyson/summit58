import { useState, useCallback, useRef } from 'react';
import { View, Text, FlatList, Pressable, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import BottomSheet from '@gorhom/bottom-sheet';
import { SymbolView } from 'expo-symbols';
import { colors } from '@/lib/theme/colors';
import { useSession } from '@/lib/auth/AuthProvider';
import { apiFetch } from '@/lib/api';
import { router } from 'expo-router';
import { LoadingState } from '@/components/ui/LoadingState';
import { ErrorState } from '@/components/ui/ErrorState';
import { ActivityCard } from '@/components/activity/ActivityCard';
import { CommentsBottomSheet } from '@/components/social/CommentsBottomSheet';
import { SuggestionCard } from '@/components/social/SuggestionCard';
import type {
	ActivityFeedResponse,
	ActivityItem,
	ReactionData,
	CommentData,
	SummitComment,
	UserWithFollowStatus,
	SuggestedUsersResponse,
} from '@/lib/types/api';

type FeedTab = 'following' | 'you';

export default function ActivityScreen() {
	const { user, loading: authLoading } = useSession();
	const [activeTab, setActiveTab] = useState<FeedTab>('following');
	const [items, setItems] = useState<ActivityItem[]>([]);
	const [reactions, setReactions] = useState<Record<string, ReactionData>>({});
	const [comments, setComments] = useState<Record<string, CommentData>>({});
	const [suggestions, setSuggestions] = useState<UserWithFollowStatus[]>([]);
	const [loading, setLoading] = useState(false);
	const [refreshing, setRefreshing] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Comments bottom sheet state
	const bottomSheetRef = useRef<BottomSheet>(null);
	const [activeCommentSummitId, setActiveCommentSummitId] = useState<string | null>(null);

	const loadFeed = useCallback(
		async (tab: FeedTab) => {
			if (!user) return;
			try {
				setError(null);
				const data = await apiFetch<ActivityFeedResponse>(
					`/api/v1/activity?feed=${tab}&limit=50`
				);
				setItems(data.items);
				setReactions(data.reactions);
				setComments(data.comments);
			} catch (e) {
				setError(e instanceof Error ? e.message : 'Failed to load activity');
			} finally {
				setLoading(false);
				setRefreshing(false);
			}
		},
		[user]
	);

	const loadSuggestions = useCallback(async () => {
		if (!user) return;
		try {
			const data = await apiFetch<SuggestedUsersResponse>('/api/v1/follows');
			setSuggestions(data.suggestions);
		} catch {
			// Non-critical — fail silently
		}
	}, [user]);

	// Load on tab focus
	useFocusEffect(
		useCallback(() => {
			if (user) {
				setLoading(true);
				loadFeed(activeTab);
				if (activeTab === 'following') loadSuggestions();
			}
		}, [user, activeTab, loadFeed, loadSuggestions])
	);

	const handleTabChange = (tab: FeedTab) => {
		if (tab === activeTab) return;
		setActiveTab(tab);
		setLoading(true);
		setItems([]);
		loadFeed(tab);
		if (tab === 'following') loadSuggestions();
	};

	const handleRefresh = () => {
		setRefreshing(true);
		loadFeed(activeTab);
		if (activeTab === 'following') loadSuggestions();
	};

	const handleCommentPress = (summitId: string) => {
		setActiveCommentSummitId(summitId);
		bottomSheetRef.current?.snapToIndex(0);
	};

	const handleReactionUpdate = (summitId: string, data: ReactionData) => {
		setReactions((prev) => ({ ...prev, [summitId]: data }));
	};

	const handleCommentAdded = (comment: SummitComment) => {
		if (!activeCommentSummitId) return;
		setComments((prev) => {
			const existing = prev[activeCommentSummitId] || { count: 0, comments: [] };
			return {
				...prev,
				[activeCommentSummitId]: {
					count: existing.count + 1,
					comments: [...existing.comments, comment],
				},
			};
		});
	};

	const handleCommentDeleted = (commentId: string) => {
		if (!activeCommentSummitId) return;
		setComments((prev) => {
			const existing = prev[activeCommentSummitId];
			if (!existing) return prev;
			return {
				...prev,
				[activeCommentSummitId]: {
					count: existing.count - 1,
					comments: existing.comments.filter((c) => c.id !== commentId),
				},
			};
		});
	};

	// Not signed in
	if (authLoading) {
		return (
			<View style={{ flex: 1, backgroundColor: colors.light.bgPrimary }}>
				<LoadingState />
			</View>
		);
	}

	if (!user) {
		return (
			<View
				style={{
					flex: 1,
					alignItems: 'center',
					justifyContent: 'center',
					backgroundColor: colors.light.bgPrimary,
					padding: 40,
				}}>
				<SymbolView
					name={{ ios: 'person.2', android: 'group', web: 'group' }}
					tintColor={colors.light.textMuted}
					size={64}
				/>
				<Text
					style={{
						fontFamily: 'InstrumentSerif',
						fontSize: 24,
						color: colors.light.textPrimary,
						marginTop: 16,
						textAlign: 'center',
					}}>
					Sign in to see activity
				</Text>
				<Text
					style={{
						fontFamily: 'Inter',
						fontSize: 14,
						color: colors.light.textMuted,
						textAlign: 'center',
						marginTop: 8,
					}}>
					Follow other climbers and see what the community is up to.
				</Text>
				<Pressable
					onPress={() => router.push('/(auth)/login')}
					style={{
						backgroundColor: colors.accent.default,
						paddingHorizontal: 24,
						paddingVertical: 12,
						borderRadius: 8,
						marginTop: 20,
					}}>
					<Text style={{ fontFamily: 'Inter-SemiBold', fontSize: 15, color: '#ffffff' }}>
						Sign In
					</Text>
				</Pressable>
			</View>
		);
	}

	const activeComments = activeCommentSummitId
		? comments[activeCommentSummitId]?.comments ?? []
		: [];

	return (
		<View style={{ flex: 1, backgroundColor: colors.light.bgPrimary }}>
			{/* Segmented control */}
			<View
				style={{
					flexDirection: 'row',
					marginHorizontal: 16,
					marginTop: 8,
					marginBottom: 12,
					backgroundColor: colors.light.bgSecondary,
					borderRadius: 10,
					padding: 3,
				}}>
				{(['following', 'you'] as FeedTab[]).map((tab) => (
					<Pressable
						key={tab}
						onPress={() => handleTabChange(tab)}
						style={{
							flex: 1,
							paddingVertical: 8,
							borderRadius: 8,
							backgroundColor: activeTab === tab ? colors.light.bgPrimary : 'transparent',
							alignItems: 'center',
						}}>
						<Text
							style={{
								fontFamily: activeTab === tab ? 'Inter-SemiBold' : 'Inter',
								fontSize: 14,
								color: activeTab === tab ? colors.light.textPrimary : colors.light.textMuted,
							}}>
							{tab === 'following' ? 'Following' : 'You'}
						</Text>
					</Pressable>
				))}
			</View>

			{loading && !refreshing ? (
				<LoadingState message="Loading activity..." />
			) : error ? (
				<ErrorState message={error} onRetry={() => loadFeed(activeTab)} />
			) : (
				<FlatList
					data={items}
					keyExtractor={(item) => item.id}
					renderItem={({ item }) => {
						const summitId = item.id.replace(/^(summit|review|report|achievement)-/, '');
						return (
							<ActivityCard
								item={item}
								reaction={reactions[summitId]}
								commentData={comments[summitId]}
								onCommentPress={handleCommentPress}
								onReactionUpdate={handleReactionUpdate}
							/>
						);
					}}
					contentContainerStyle={{ padding: 16, gap: 12, flexGrow: 1 }}
					refreshControl={
						<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
					}
					ListEmptyComponent={
						<EmptyState
							tab={activeTab}
							suggestions={suggestions}
						/>
					}
					ListFooterComponent={
						activeTab === 'following' && items.length > 0 && suggestions.length > 0
							? () => (
									<SuggestionsSection
										suggestions={suggestions}
									/>
								)
							: undefined
					}
				/>
			)}

			<CommentsBottomSheet
				ref={bottomSheetRef}
				summitId={activeCommentSummitId}
				comments={activeComments}
				currentUserId={user.id}
				onCommentAdded={handleCommentAdded}
				onCommentDeleted={handleCommentDeleted}
				onClose={() => setActiveCommentSummitId(null)}
			/>
		</View>
	);
}

function EmptyState({
	tab,
	suggestions,
}: {
	tab: FeedTab;
	suggestions: UserWithFollowStatus[];
}) {
	if (tab === 'you') {
		return (
			<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 60 }}>
				<SymbolView
					name={{ ios: 'mountain.2', android: 'landscape', web: 'landscape' }}
					tintColor={colors.light.textMuted}
					size={48}
				/>
				<Text
					style={{
						fontFamily: 'Inter-Medium',
						fontSize: 16,
						color: colors.light.textPrimary,
						marginTop: 16,
						textAlign: 'center',
					}}>
					No activity yet
				</Text>
				<Text
					style={{
						fontFamily: 'Inter',
						fontSize: 14,
						color: colors.light.textMuted,
						marginTop: 6,
						textAlign: 'center',
						paddingHorizontal: 40,
					}}>
					Your summits, reviews, and achievements will appear here.
				</Text>
			</View>
		);
	}

	return (
		<View style={{ flex: 1, paddingVertical: 40 }}>
			<View style={{ alignItems: 'center', marginBottom: 24 }}>
				<SymbolView
					name={{ ios: 'person.2', android: 'group', web: 'group' }}
					tintColor={colors.light.textMuted}
					size={48}
				/>
				<Text
					style={{
						fontFamily: 'Inter-Medium',
						fontSize: 16,
						color: colors.light.textPrimary,
						marginTop: 16,
						textAlign: 'center',
					}}>
					{suggestions.length > 0
						? 'Follow climbers to see their activity'
						: 'No activity from people you follow'}
				</Text>
				<Text
					style={{
						fontFamily: 'Inter',
						fontSize: 14,
						color: colors.light.textMuted,
						marginTop: 6,
						textAlign: 'center',
						paddingHorizontal: 40,
					}}>
					Discover climbers with similar peak lists.
				</Text>
			</View>

			{suggestions.length > 0 && (
				<SuggestionsSection suggestions={suggestions} />
			)}
		</View>
	);
}

function SuggestionsSection({ suggestions }: { suggestions: UserWithFollowStatus[] }) {
	return (
		<View style={{ marginTop: 8 }}>
			<Text
				style={{
					fontFamily: 'Inter-SemiBold',
					fontSize: 16,
					color: colors.light.textPrimary,
					marginBottom: 12,
					paddingHorizontal: 4,
				}}>
				Suggested Climbers
			</Text>
			<FlatList
				horizontal
				data={suggestions}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => <SuggestionCard user={item} />}
				contentContainerStyle={{ gap: 10 }}
				showsHorizontalScrollIndicator={false}
			/>
		</View>
	);
}
