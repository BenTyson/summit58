import type { RequestHandler } from './$types';
import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { searchForum } from '$lib/server/forum';

/** GET /api/v1/forum/search — full-text search */
export const GET: RequestHandler = async ({ url }) => {
	const query = url.searchParams.get('q')?.trim();
	if (!query) {
		return new Response(JSON.stringify({ results: [] }), {
			headers: { 'Content-Type': 'application/json' }
		});
	}

	const category = url.searchParams.get('category') ?? undefined;
	const limit = Math.min(Number(url.searchParams.get('limit') ?? 20), 50);
	const offset = Number(url.searchParams.get('offset') ?? 0);

	const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);

	try {
		const results = await searchForum(supabase, query, { category, limit, offset });
		return new Response(JSON.stringify({ results }), {
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (e) {
		console.error('Error searching forum:', e);
		return new Response(JSON.stringify({ error: 'Search failed' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};
