import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createSupabaseServerClient } from '$lib/server/supabase';
import { getCategoryBySlug, getTopicsByCategory } from '$lib/server/forum';

export const GET: RequestHandler = async ({ params, url, cookies }) => {
	const supabase = createSupabaseServerClient(cookies);

	const category = await getCategoryBySlug(supabase, params.slug);
	if (!category) {
		return json({ error: 'Category not found' }, { status: 404 });
	}

	const cursor = url.searchParams.get('cursor') ?? undefined;
	const limit = Math.min(Number(url.searchParams.get('limit') ?? 20), 50);

	const result = await getTopicsByCategory(supabase, category.id, { cursor, limit });

	return json(result);
};
