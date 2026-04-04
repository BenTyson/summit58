import { useState, useEffect } from 'react';
import { View } from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { colors } from '@/lib/theme/colors';
import { apiFetch } from '@/lib/api';
import { useSession } from '@/lib/auth/AuthProvider';
import { LoadingState } from '@/components/ui/LoadingState';
import { TopicComposer } from '@/components/forum/TopicComposer';
import type { ForumCategory, ForumCategoriesResponse, ForumTopic } from '@/lib/types/api';

export default function NewTopicScreen() {
	const { user } = useSession();
	const { categorySlug, peakId, peakName, peakSlug } = useLocalSearchParams<{
		categorySlug?: string;
		peakId?: string;
		peakName?: string;
		peakSlug?: string;
	}>();
	const [categories, setCategories] = useState<ForumCategory[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function load() {
			try {
				const data = await apiFetch<ForumCategoriesResponse>('/api/v1/forum/categories', {
					auth: false
				});
				setCategories(data.categories);
			} catch {
				// Fall through — composer will show empty categories
			} finally {
				setLoading(false);
			}
		}
		load();
	}, []);

	if (!user) {
		router.replace('/(auth)/login');
		return null;
	}

	const initialCategoryId = categorySlug
		? categories.find((c) => c.slug === categorySlug)?.id
		: undefined;

	const initialPeak =
		peakId && peakName && peakSlug
			? { id: peakId, name: peakName, slug: peakSlug }
			: null;

	const handleSubmit = async (data: {
		title: string;
		body: string;
		category_id: string;
		peak_id?: string;
	}) => {
		const res = await apiFetch<{ topic: ForumTopic }>('/api/v1/forum/topics', {
			method: 'POST',
			body: {
				title: data.title,
				body: data.body,
				category_id: data.category_id,
				peak_id: data.peak_id
			}
		});

		// Navigate to the new topic
		router.replace(`/community/topic/${res.topic.id}`);
	};

	if (loading) {
		return (
			<View style={{ flex: 1, backgroundColor: colors.light.bgPrimary }}>
				<Stack.Screen options={{ title: 'New Topic', presentation: 'modal' }} />
				<LoadingState />
			</View>
		);
	}

	return (
		<View style={{ flex: 1, backgroundColor: colors.light.bgPrimary }}>
			<Stack.Screen options={{ title: 'New Topic', presentation: 'modal' }} />
			<TopicComposer
				categories={categories}
				initialCategoryId={initialCategoryId}
				initialPeak={initialPeak}
				onSubmit={handleSubmit}
			/>
		</View>
	);
}
