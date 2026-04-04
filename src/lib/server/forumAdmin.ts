import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '$lib/types/database';

// Admin forum operations. Callers should pass a service-role client
// (createSupabaseServiceClient) to bypass RLS author/time restrictions.

function db(supabase: SupabaseClient<Database>) {
	return supabase as unknown as SupabaseClient;
}

export async function pinTopic(
	supabase: SupabaseClient<Database>,
	topicId: string,
	pinned: boolean
): Promise<void> {
	const { error } = await db(supabase)
		.from('forum_topics')
		.update({ is_pinned: pinned })
		.eq('id', topicId);

	if (error) throw error;
}

export async function lockTopic(
	supabase: SupabaseClient<Database>,
	topicId: string,
	locked: boolean
): Promise<void> {
	const { error } = await db(supabase)
		.from('forum_topics')
		.update({ is_locked: locked })
		.eq('id', topicId);

	if (error) throw error;
}

export async function moveTopic(
	supabase: SupabaseClient<Database>,
	topicId: string,
	newCategoryId: string
): Promise<void> {
	// Category count adjustment handled by handle_forum_topic_move trigger
	const { error } = await db(supabase)
		.from('forum_topics')
		.update({ category_id: newCategoryId })
		.eq('id', topicId);

	if (error) throw error;
}

export async function adminDeleteTopic(
	supabase: SupabaseClient<Database>,
	topicId: string
): Promise<void> {
	const { error } = await db(supabase)
		.from('forum_topics')
		.delete()
		.eq('id', topicId);

	if (error) throw error;
}

export async function adminDeleteReply(
	supabase: SupabaseClient<Database>,
	replyId: string
): Promise<void> {
	const { error } = await db(supabase)
		.from('forum_replies')
		.delete()
		.eq('id', replyId);

	if (error) throw error;
}

export interface ForumStats {
	topicCount: number;
	replyCount: number;
	activeUsers7d: number;
}

export async function getForumStats(
	supabase: SupabaseClient<Database>
): Promise<ForumStats> {
	const client = db(supabase);
	const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

	const [topicRes, replyRes, activeTopicAuthors, activeReplyAuthors] = await Promise.all([
		client.from('forum_topics').select('id', { count: 'exact', head: true }),
		client.from('forum_replies').select('id', { count: 'exact', head: true }),
		client
			.from('forum_topics')
			.select('author_id')
			.gte('created_at', sevenDaysAgo),
		client
			.from('forum_replies')
			.select('author_id')
			.gte('created_at', sevenDaysAgo)
	]);

	const activeUserIds = new Set<string>();
	for (const t of (activeTopicAuthors.data ?? []) as any[]) {
		activeUserIds.add(t.author_id);
	}
	for (const r of (activeReplyAuthors.data ?? []) as any[]) {
		activeUserIds.add(r.author_id);
	}

	return {
		topicCount: topicRes.count ?? 0,
		replyCount: replyRes.count ?? 0,
		activeUsers7d: activeUserIds.size
	};
}

export interface ForumModerationQueue {
	flaggedTopics: any[];
	flaggedReplies: any[];
}

export async function getForumModerationQueue(
	supabase: SupabaseClient<Database>
): Promise<ForumModerationQueue> {
	const client = db(supabase);

	const [topicFlags, replyFlags] = await Promise.all([
		client
			.from('content_flags')
			.select('content_id, count')
			.eq('content_type', 'forum_topic')
			.order('count', { ascending: false }),
		client
			.from('content_flags')
			.select('content_id, count')
			.eq('content_type', 'forum_reply')
			.order('count', { ascending: false })
	]);

	// Fetch topic/reply details for flagged content
	const flaggedTopicIds = (topicFlags.data ?? []).map((f: any) => f.content_id);
	const flaggedReplyIds = (replyFlags.data ?? []).map((f: any) => f.content_id);

	const [topics, replies] = await Promise.all([
		flaggedTopicIds.length > 0
			? client
					.from('forum_topics')
					.select('id, title, author_id, created_at')
					.in('id', flaggedTopicIds)
			: { data: [] },
		flaggedReplyIds.length > 0
			? client
					.from('forum_replies')
					.select('id, body, topic_id, author_id, created_at')
					.in('id', flaggedReplyIds)
			: { data: [] }
	]);

	return {
		flaggedTopics: (topics.data ?? []) as any[],
		flaggedReplies: (replies.data ?? []) as any[]
	};
}
