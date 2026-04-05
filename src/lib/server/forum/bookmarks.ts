import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '$lib/types/database';
import type { ForumTopicWithAuthor } from './types';
import { db, enrichWithAuthors } from './utils';

/** Toggle a bookmark on a forum topic. */
export async function toggleBookmark(
	supabase: SupabaseClient<Database>,
	topicId: string,
	userId: string
): Promise<{ bookmarked: boolean }> {
	const client = db(supabase);

	const { data: existing } = await client
		.from('forum_bookmarks')
		.select('id')
		.eq('topic_id', topicId)
		.eq('user_id', userId)
		.maybeSingle();

	if (existing) {
		await client.from('forum_bookmarks').delete().eq('id', existing.id);
		return { bookmarked: false };
	} else {
		await client.from('forum_bookmarks').insert({ topic_id: topicId, user_id: userId });
		return { bookmarked: true };
	}
}

/** Get a user's bookmarked topics with cursor pagination. */
export async function getUserBookmarks(
	supabase: SupabaseClient<Database>,
	userId: string,
	opts: { cursor?: string; limit?: number } = {}
): Promise<{ topics: ForumTopicWithAuthor[]; nextCursor: string | null }> {
	const { cursor, limit = 20 } = opts;
	const client = db(supabase);

	// Fetch bookmark entries (topic_id + created_at for cursor)
	let query = client
		.from('forum_bookmarks')
		.select('topic_id, created_at')
		.eq('user_id', userId)
		.order('created_at', { ascending: false })
		.limit(limit + 1);

	if (cursor) {
		query = query.lt('created_at', cursor);
	}

	const { data: bookmarks } = await query;
	const items = bookmarks ?? [];
	const hasMore = items.length > limit;
	const page = items.slice(0, limit);
	const nextCursor = hasMore ? page[page.length - 1].created_at : null;

	if (page.length === 0) return { topics: [], nextCursor: null };

	const topicIds = page.map((b: any) => b.topic_id);

	// Fetch full topics for bookmarked IDs
	const { data: topics } = await client
		.from('forum_topics')
		.select('*, peak:peaks(id, name, slug)')
		.in('id', topicIds);

	// Maintain bookmark order
	const topicMap = new Map((topics ?? []).map((t: any) => [t.id, t]));
	const ordered = topicIds.map((id: string) => topicMap.get(id)).filter(Boolean);

	await enrichWithAuthors(supabase, ordered, (t) => t.author_id);

	return { topics: ordered as ForumTopicWithAuthor[], nextCursor };
}

/** Batch-check bookmark status for multiple topics. */
export async function getBookmarkStatus(
	supabase: SupabaseClient<Database>,
	topicIds: string[],
	userId: string
): Promise<Record<string, boolean>> {
	if (topicIds.length === 0) return {};

	const client = db(supabase);

	const { data } = await client
		.from('forum_bookmarks')
		.select('topic_id')
		.eq('user_id', userId)
		.in('topic_id', topicIds);

	const result: Record<string, boolean> = {};
	for (const id of topicIds) {
		result[id] = false;
	}
	for (const b of (data ?? []) as any[]) {
		result[b.topic_id] = true;
	}

	return result;
}
