import type { RequestHandler } from './$types';
import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { createSupabaseApiClient, createSupabaseServerClient } from '$lib/server/supabase';
import { getCategoryBySlug, getTopicsByCategory } from '$lib/server/forum';

/** GET /api/v1/forum/categories/[slug]/topics — paginated topics for a category */
export const GET: RequestHandler = async ({ params, url, cookies, request }) => {
	// Support both cookie auth (web) and Bearer token auth (mobile)
	const { supabase: apiClient } = createSupabaseApiClient(request);
	const supabase = apiClient || createSupabaseServerClient(cookies);

	const category = await getCategoryBySlug(supabase, params.slug);
	if (!category) {
		return new Response(JSON.stringify({ error: 'Category not found' }), {
			status: 404,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	const cursor = url.searchParams.get('cursor') ?? undefined;
	const limit = Math.min(Number(url.searchParams.get('limit') ?? 20), 50);

	const result = await getTopicsByCategory(supabase, category.id, { cursor, limit });

	return new Response(JSON.stringify(result), {
		headers: { 'Content-Type': 'application/json' }
	});
};
