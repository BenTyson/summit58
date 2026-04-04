import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { createSupabaseServerClient } from '$lib/server/supabase';
import { getCategoryBySlug, getTopicsByCategory } from '$lib/server/forum';

export const load: PageServerLoad = async ({ params, cookies }) => {
	const supabase = createSupabaseServerClient(cookies);

	const category = await getCategoryBySlug(supabase, params.category);
	if (!category) {
		error(404, 'Category not found');
	}

	const { topics, nextCursor } = await getTopicsByCategory(supabase, category.id, { limit: 20 });

	return {
		category,
		topics,
		nextCursor
	};
};
