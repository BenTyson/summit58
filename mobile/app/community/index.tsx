import { useState, useCallback } from 'react';
import { View, Text, FlatList, RefreshControl } from 'react-native';
import { Stack, router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { SymbolView } from 'expo-symbols';
import { colors } from '@/lib/theme/colors';
import { apiFetch } from '@/lib/api';
import { LoadingState } from '@/components/ui/LoadingState';
import { ErrorState } from '@/components/ui/ErrorState';
import { CategoryCard } from '@/components/forum/CategoryCard';
import { TopicCard } from '@/components/forum/TopicCard';
import { ForumSearch } from '@/components/forum/ForumSearch';
import type {
	ForumCategory,
	ForumTopic,
	ForumCategoriesResponse,
	ForumTopicsResponse,
	ForumSearchResult
} from '@/lib/types/api';

export default function CommunityScreen() {
	const [categories, setCategories] = useState<ForumCategory[]>([]);
	const [recentTopics, setRecentTopics] = useState<ForumTopic[]>([]);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [showSearch, setShowSearch] = useState(false);

	const load = useCallback(async () => {
		try {
			setError(null);
			const catRes = await apiFetch<ForumCategoriesResponse>(
				'/api/v1/forum/categories',
				{ auth: false }
			);
			setCategories(catRes.categories);

			// Fetch recent topics from the first category that has topics, or all
			// Instead, fetch recent from all categories using the category endpoint
			if (catRes.categories.length > 0) {
				try {
					const firstCat = catRes.categories[0];
					const recent = await apiFetch<ForumTopicsResponse>(
						`/api/v1/forum/categories/${firstCat.slug}/topics?limit=5`,
						{ auth: false }
					);
					setRecentTopics(recent.topics);
				} catch {
					setRecentTopics([]);
				}
			}
		} catch (e) {
			setError(e instanceof Error ? e.message : 'Failed to load community');
		} finally {
			setLoading(false);
			setRefreshing(false);
		}
	}, []);

	useFocusEffect(
		useCallback(() => {
			load();
		}, [load])
	);

	const handleRefresh = () => {
		setRefreshing(true);
		load();
	};

	const handleSearchResult = (result: ForumSearchResult) => {
		setShowSearch(false);
		router.push(`/community/topic/${result.topic_id}`);
	};

	if (showSearch) {
		return (
			<View style={{ flex: 1, backgroundColor: colors.light.bgPrimary }}>
				<Stack.Screen
					options={{
						title: 'Search',
						headerLeft: () => (
							<Text
								onPress={() => setShowSearch(false)}
								style={{ fontFamily: 'Inter-Medium', fontSize: 15, color: colors.accent.default }}>
								Cancel
							</Text>
						)
					}}
				/>
				<ForumSearch onResultPress={handleSearchResult} />
			</View>
		);
	}

	if (loading) {
		return (
			<View style={{ flex: 1, backgroundColor: colors.light.bgPrimary }}>
				<Stack.Screen options={{ title: 'Community' }} />
				<LoadingState message="Loading community..." />
			</View>
		);
	}

	if (error) {
		return (
			<View style={{ flex: 1, backgroundColor: colors.light.bgPrimary }}>
				<Stack.Screen options={{ title: 'Community' }} />
				<ErrorState message={error} onRetry={load} />
			</View>
		);
	}

	const sections = [
		{ type: 'header' as const },
		...categories.map((c) => ({ type: 'category' as const, data: c })),
		...(recentTopics.length > 0 ? [{ type: 'recent-header' as const }] : []),
		...recentTopics.map((t) => ({ type: 'topic' as const, data: t }))
	];

	return (
		<View style={{ flex: 1, backgroundColor: colors.light.bgPrimary }}>
			<Stack.Screen
				options={{
					title: 'Community',
					headerRight: () => (
						<SymbolView
							name={{ ios: 'magnifyingglass', android: 'search', web: 'search' }}
							tintColor={colors.accent.default}
							size={22}
							onTouchEnd={() => setShowSearch(true)}
						/>
					)
				}}
			/>

			<FlatList
				data={sections}
				keyExtractor={(item, i) => {
					if (item.type === 'category') return `cat-${item.data.id}`;
					if (item.type === 'topic') return `topic-${item.data.id}`;
					return `${item.type}-${i}`;
				}}
				renderItem={({ item }) => {
					if (item.type === 'header') {
						return (
							<View style={{ padding: 20, paddingBottom: 8 }}>
								<Text
									style={{
										fontFamily: 'InstrumentSerif',
										fontSize: 24,
										color: colors.light.textPrimary
									}}>
									Discussion Categories
								</Text>
								<Text
									style={{
										fontFamily: 'Inter',
										fontSize: 14,
										color: colors.light.textMuted,
										marginTop: 2
									}}>
									Join the conversation with fellow 14er hikers
								</Text>
							</View>
						);
					}

					if (item.type === 'category') {
						return (
							<View style={{ paddingHorizontal: 16, paddingVertical: 4 }}>
								<CategoryCard
									category={item.data}
									onPress={() => router.push(`/community/${item.data.slug}`)}
								/>
							</View>
						);
					}

					if (item.type === 'recent-header') {
						return (
							<View style={{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: 8 }}>
								<Text
									style={{
										fontFamily: 'Inter-SemiBold',
										fontSize: 18,
										color: colors.light.textPrimary
									}}>
									Recent Discussions
								</Text>
							</View>
						);
					}

					if (item.type === 'topic') {
						return (
							<View style={{ paddingHorizontal: 16, paddingVertical: 4 }}>
								<TopicCard
									topic={item.data}
									onPress={() => router.push(`/community/topic/${item.data.id}`)}
								/>
							</View>
						);
					}

					return null;
				}}
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
				}
				contentContainerStyle={{ paddingBottom: 20 }}
			/>
		</View>
	);
}
