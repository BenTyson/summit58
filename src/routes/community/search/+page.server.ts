import type { PageServerLoad } from './$types';
import { createSupabaseServerClient } from '$lib/server/supabase';
import { searchForum, getCategories } from '$lib/server/forum';

export const load: PageServerLoad = async ({ url, cookies }) => {
	const supabase = createSupabaseServerClient(cookies);

	const query = url.searchParams.get('q')?.trim() ?? '';
	const category = url.searchParams.get('category') ?? undefined;

	const [categories, results] = await Promise.all([
		getCategories(supabase),
		query.length >= 2 ? searchForum(supabase, query, { category, limit: 30 }) : []
	]);

	return {
		query,
		category: category ?? '',
		categories,
		results
	};
};
