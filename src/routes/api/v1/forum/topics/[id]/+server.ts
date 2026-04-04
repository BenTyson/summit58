import type { RequestHandler } from './$types';
import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { createSupabaseApiClient, requireAuth } from '$lib/server/supabase';
import { getTopicDetail, getReplies, updateTopic, deleteTopic, recordTopicView } from '$lib/server/forum';
import { getReactionsForPosts } from '$lib/server/forumReactions';
import { getBookmarkStatus } from '$lib/server/forumBookmarks';

/** GET /api/v1/forum/topics/[id] — topic detail + first page of replies */
export const GET: RequestHandler = async ({ params, request, url }) => {
	const { supabase: authClient } = createSupabaseApiClient(request);
	const supabase = authClient || createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);

	const topic = await getTopicDetail(supabase, params.id);
	if (!topic) {
		return new Response(JSON.stringify({ error: 'Topic not found' }), {
			status: 404,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	const limit = Math.min(Number(url.searchParams.get('limit') ?? 30), 50);
	const { replies, nextCursor } = await getReplies(supabase, params.id, { limit });

	// Batch-load reactions for topic + replies
	const replyIds = replies.map((r) => r.id);
	let userId: string | undefined;
	if (authClient) {
		try {
			const { data: { user } } = await authClient.auth.getUser();
			userId = user?.id;
		} catch { /* optional auth */ }
	}

	const [topicReactions, replyReactions, bookmarks] = await Promise.all([
		getReactionsForPosts(supabase, 'topic', [params.id], userId),
		replyIds.length > 0 ? getReactionsForPosts(supabase, 'reply', replyIds, userId) : {},
		userId ? getBookmarkStatus(supabase, [params.id], userId) : {}
	]);

	// Record view for authenticated users
	if (userId) {
		recordTopicView(supabase, params.id, userId).catch(() => {});
	}

	return new Response(
		JSON.stringify({
			topic,
			replies,
			nextCursor,
			reactions: { ...topicReactions, ...replyReactions },
			bookmarks
		}),
		{ headers: { 'Content-Type': 'application/json' } }
	);
};

/** PATCH /api/v1/forum/topics/[id] — edit own topic */
export const PATCH: RequestHandler = async ({ params, request }) => {
	const { supabase, user, error: authError } = await requireAuth(request);

	if (!supabase || !user) {
		return new Response(JSON.stringify({ error: authError }), {
			status: 401,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	const body = await request.json();
	const updates: { title?: string; body?: string } = {};
	if (body.title?.trim()) updates.title = body.title.trim();
	if (body.body?.trim()) updates.body = body.body.trim();

	if (Object.keys(updates).length === 0) {
		return new Response(JSON.stringify({ error: 'No valid fields to update' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	try {
		await updateTopic(supabase, params.id, user.id, updates);
		return new Response(JSON.stringify({ success: true }), {
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (e) {
		console.error('Error updating topic:', e);
		return new Response(JSON.stringify({ error: 'Failed to update topic' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};

/** DELETE /api/v1/forum/topics/[id] — delete own topic */
export const DELETE: RequestHandler = async ({ params, request }) => {
	const { supabase, user, error: authError } = await requireAuth(request);

	if (!supabase || !user) {
		return new Response(JSON.stringify({ error: authError }), {
			status: 401,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	try {
		await deleteTopic(supabase, params.id, user.id);
		return new Response(null, { status: 204 });
	} catch (e) {
		console.error('Error deleting topic:', e);
		return new Response(JSON.stringify({ error: 'Failed to delete topic' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};
