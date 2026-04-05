import type { RequestHandler } from './$types';
import { requireAuth } from '$lib/server/supabase';
import { toggleBookmark, getUserBookmarks } from '$lib/server/forum';

/** GET /api/v1/forum/bookmarks — user's bookmarked topics */
export const GET: RequestHandler = async ({ request, url }) => {
	const { supabase, user, error: authError } = await requireAuth(request);

	if (!supabase || !user) {
		return new Response(JSON.stringify({ error: authError }), {
			status: 401,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	const cursor = url.searchParams.get('cursor') ?? undefined;
	const limit = Math.min(Number(url.searchParams.get('limit') ?? 20), 50);

	try {
		const result = await getUserBookmarks(supabase, user.id, { cursor, limit });
		return new Response(JSON.stringify(result), {
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (e) {
		console.error('Error fetching bookmarks:', e);
		return new Response(JSON.stringify({ error: 'Failed to fetch bookmarks' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};

/** POST /api/v1/forum/bookmarks — toggle bookmark on a topic */
export const POST: RequestHandler = async ({ request }) => {
	const { supabase, user, error: authError } = await requireAuth(request);

	if (!supabase || !user) {
		return new Response(JSON.stringify({ error: authError }), {
			status: 401,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	const body = await request.json();
	const { topic_id } = body;

	if (!topic_id) {
		return new Response(JSON.stringify({ error: 'topic_id is required' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	try {
		const result = await toggleBookmark(supabase, topic_id, user.id);
		return new Response(JSON.stringify(result), {
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (e) {
		console.error('Error toggling bookmark:', e);
		return new Response(JSON.stringify({ error: 'Failed to toggle bookmark' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};
