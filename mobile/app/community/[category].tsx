import { useState, useCallback, useRef } from 'react';
import { View, Text, FlatList, RefreshControl, Pressable } from 'react-native';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { SymbolView } from 'expo-symbols';
import { colors } from '@/lib/theme/colors';
import { useColorScheme } from '@/components/useColorScheme';
import { apiFetch } from '@/lib/api';
import { useSession } from '@/lib/auth/AuthProvider';
import { ErrorState } from '@/components/ui/ErrorState';
import { TopicCardSkeleton } from '@/components/forum/TopicCardSkeleton';
import { TopicCard } from '@/components/forum/TopicCard';
import type { ForumTopic, ForumTopicsResponse } from '@/lib/types/api';

export default function CategoryScreen() {
	const colorScheme = useColorScheme();
	const theme = colorScheme === 'dark' ? colors.dark : colors.light;
	const { category: slug } = useLocalSearchParams<{ category: string }>();
	const { user } = useSession();
	const [topics, setTopics] = useState<ForumTopic[]>([]);
	const [nextCursor, setNextCursor] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const [loadingMore, setLoadingMore] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const loadingMoreRef = useRef(false);

	const loadTopics = useCallback(
		async (cursor?: string) => {
			try {
				setError(null);
				const params = new URLSearchParams({ limit: '20' });
				if (cursor) params.set('cursor', cursor);

				const data = await apiFetch<ForumTopicsResponse>(
					`/api/v1/forum/categories/${slug}/topics?${params}`,
					{ auth: false }
				);

				if (cursor) {
					setTopics((prev) => [...prev, ...data.topics]);
				} else {
					setTopics(data.topics);
				}
				setNextCursor(data.nextCursor);
			} catch (e) {
				setError(e instanceof Error ? e.message : 'Failed to load topics');
			} finally {
				setLoading(false);
				setRefreshing(false);
				setLoadingMore(false);
				loadingMoreRef.current = false;
			}
		},
		[slug]
	);

	useFocusEffect(
		useCallback(() => {
			setLoading(true);
			loadTopics();
		}, [loadTopics])
	);

	const handleRefresh = () => {
		setRefreshing(true);
		loadTopics();
	};

	const handleLoadMore = () => {
		if (!nextCursor || loadingMoreRef.current) return;
		loadingMoreRef.current = true;
		setLoadingMore(true);
		loadTopics(nextCursor);
	};

	// Format slug to title
	const categoryTitle = slug
		?.replace(/-/g, ' ')
		.replace(/\b\w/g, (c) => c.toUpperCase()) || 'Topics';

	if (loading) {
		return (
			<View style={{ flex: 1, backgroundColor: theme.bgPrimary }}>
				<Stack.Screen options={{ title: categoryTitle }} />
				<View style={{ padding: 16, gap: 8 }}>
					{[0, 1, 2, 3].map((i) => (
						<TopicCardSkeleton key={i} />
					))}
				</View>
			</View>
		);
	}

	if (error) {
		return (
			<View style={{ flex: 1, backgroundColor: theme.bgPrimary }}>
				<Stack.Screen options={{ title: categoryTitle }} />
				<ErrorState message={error} onRetry={() => loadTopics()} />
			</View>
		);
	}

	return (
		<View style={{ flex: 1, backgroundColor: theme.bgPrimary }}>
			<Stack.Screen options={{ title: categoryTitle }} />

			<FlatList
				data={topics}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => (
					<View style={{ paddingHorizontal: 16, paddingVertical: 4 }}>
						<TopicCard
							topic={item}
							onPress={() => router.push(`/community/topic/${item.id}`)}
						/>
					</View>
				)}
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
				}
				onEndReached={handleLoadMore}
				onEndReachedThreshold={0.3}
				contentContainerStyle={{ paddingVertical: 8, flexGrow: 1 }}
				ListEmptyComponent={
					<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 60 }}>
						<SymbolView
							name={{ ios: 'bubble.left.and.bubble.right', android: 'forum', web: 'forum' }}
							tintColor={theme.textMuted}
							size={48}
						/>
						<Text
							style={{
								fontFamily: 'Inter-Medium',
								fontSize: 16,
								color: theme.textPrimary,
								marginTop: 16,
								textAlign: 'center'
							}}>
							No discussions yet
						</Text>
						<Text
							style={{
								fontFamily: 'Inter',
								fontSize: 14,
								color: theme.textMuted,
								marginTop: 6,
								textAlign: 'center',
								paddingHorizontal: 40
							}}>
							Be the first to start a conversation.
						</Text>
					</View>
				}
				ListFooterComponent={
					loadingMore ? (
						<View style={{ padding: 16, alignItems: 'center' }}>
							<Text style={{ fontFamily: 'Inter', fontSize: 13, color: theme.textMuted }}>
								Loading more...
							</Text>
						</View>
					) : null
				}
			/>

			{/* FAB for new topic */}
			{user && (
				<Pressable
					onPress={() =>
						router.push({
							pathname: '/community/new-topic',
							params: { categorySlug: slug }
						})
					}
					style={{
						position: 'absolute',
						bottom: 24,
						right: 20,
						width: 56,
						height: 56,
						borderRadius: 28,
						backgroundColor: colors.accent.default,
						alignItems: 'center',
						justifyContent: 'center',
						shadowColor: '#000',
						shadowOffset: { width: 0, height: 2 },
						shadowOpacity: 0.25,
						shadowRadius: 4,
						elevation: 5
					}}>
					<SymbolView
						name={{ ios: 'plus', android: 'add', web: 'add' }}
						tintColor="#ffffff"
						size={24}
					/>
				</Pressable>
			)}
		</View>
	);
}
