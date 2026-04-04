import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '$lib/types/database';

// ─── Types ────────────────────────────────────────────────────

export interface ForumCategory {
	id: string;
	slug: string;
	name: string;
	description: string;
	icon: string;
	color: string;
	display_order: number;
	topic_count: number;
	created_at: string;
}

export interface ForumAuthorProfile {
	id: string;
	display_name: string | null;
	avatar_url: string | null;
	summit_count: number;
}

export interface ForumTopicWithAuthor {
	id: string;
	slug: string;
	title: string;
	body: string;
	category_id: string;
	author_id: string;
	peak_id: string | null;
	route_id: string | null;
	is_pinned: boolean;
	is_locked: boolean;
	reply_count: number;
	view_count: number;
	reaction_count: number;
	last_reply_at: string;
	last_reply_by: string | null;
	created_at: string;
	updated_at: string;
	author: ForumAuthorProfile;
	peak: { id: string; name: string; slug: string } | null;
}

export interface TopicDetail extends ForumTopicWithAuthor {
	category: ForumCategory;
	route: { id: string; name: string } | null;
}

export interface ForumReplyWithAuthor {
	id: string;
	topic_id: string;
	author_id: string;
	body: string;
	reply_to_id: string | null;
	reaction_count: number;
	created_at: string;
	updated_at: string;
	author: ForumAuthorProfile;
	quoted_reply: {
		id: string;
		body: string;
		author: { display_name: string | null };
	} | null;
}

export interface ForumSearchResult {
	result_type: 'topic' | 'reply';
	id: string;
	topic_id: string;
	topic_title: string;
	topic_slug: string;
	category_slug: string;
	title: string | null;
	body: string;
	author_display_name: string | null;
	author_avatar_url: string | null;
	rank: number;
	created_at: string;
}

// ─── Helpers ──────────────────────────────────────────────────

function db(supabase: SupabaseClient<Database>) {
	return supabase as unknown as SupabaseClient;
}

const TOPIC_SELECT = `*, peak:peaks(id, name, slug)`;

const TOPIC_DETAIL_SELECT = `*, peak:peaks(id, name, slug), category:forum_categories(*), route:routes(id, name)`;

function slugify(text: string): string {
	return text
		.toLowerCase()
		.replace(/[^\w\s-]/g, '')
		.replace(/[\s_]+/g, '-')
		.replace(/^-+|-+$/g, '')
		.slice(0, 80);
}

async function generateUniqueSlug(
	client: SupabaseClient,
	categoryId: string,
	title: string
): Promise<string> {
	const base = slugify(title);
	let slug = base;
	let suffix = 2;

	// eslint-disable-next-line no-constant-condition
	while (true) {
		const { data } = await client
			.from('forum_topics')
			.select('id')
			.eq('category_id', categoryId)
			.eq('slug', slug)
			.maybeSingle();

		if (!data) return slug;
		slug = `${base}-${suffix}`;
		suffix++;
	}
}

function extractMentions(text: string): string[] {
	const regex = /@(\w+)/g;
	const matches = [...text.matchAll(regex)];
	return [...new Set(matches.map((m) => m[1]))];
}

async function getSummitCounts(
	supabase: SupabaseClient<Database>,
	userIds: string[]
): Promise<Map<string, number>> {
	if (userIds.length === 0) return new Map();

	const { data } = await supabase
		.from('user_summits')
		.select('user_id, peak_id')
		.in('user_id', userIds);

	const peakSets = new Map<string, Set<string>>();
	for (const row of data ?? []) {
		if (!peakSets.has(row.user_id)) peakSets.set(row.user_id, new Set());
		peakSets.get(row.user_id)!.add(row.peak_id);
	}

	const counts = new Map<string, number>();
	for (const [userId, peaks] of peakSets) {
		counts.set(userId, peaks.size);
	}
	return counts;
}

export async function enrichWithAuthors(
	supabase: SupabaseClient<Database>,
	items: any[],
	getAuthorId: (item: any) => string
): Promise<void> {
	const authorIds = [...new Set(items.map(getAuthorId).filter(Boolean))];
	if (authorIds.length === 0) return;

	const client = db(supabase);
	const [profileRes, summitCounts] = await Promise.all([
		client.from('profiles').select('id, display_name, avatar_url').in('id', authorIds),
		getSummitCounts(supabase, authorIds)
	]);

	const profileMap = new Map((profileRes.data ?? []).map((p: any) => [p.id, p]));

	for (const item of items) {
		const authorId = getAuthorId(item);
		const profile = profileMap.get(authorId);
		item.author = {
			id: authorId,
			display_name: profile?.display_name ?? null,
			avatar_url: profile?.avatar_url ?? null,
			summit_count: summitCounts.get(authorId) ?? 0
		};
	}
}

async function insertMentions(
	client: SupabaseClient,
	postType: 'topic' | 'reply',
	postId: string,
	body: string
): Promise<void> {
	const usernames = extractMentions(body);
	if (usernames.length === 0) return;

	const { data: users } = await client
		.from('profiles')
		.select('id, username')
		.in('username', usernames);

	if (!users?.length) return;

	const mentions = users.map((u: any) => ({
		post_type: postType,
		post_id: postId,
		mentioned_user_id: u.id
	}));

	await client.from('forum_mentions').insert(mentions);
}

// ─── Categories ───────────────────────────────────────────────

export async function getCategories(
	supabase: SupabaseClient<Database>
): Promise<ForumCategory[]> {
	const { data, error } = await db(supabase)
		.from('forum_categories')
		.select('*')
		.order('display_order');

	if (error) {
		console.error('Error fetching forum categories:', error);
		return [];
	}
	return data as ForumCategory[];
}

export async function getCategoryBySlug(
	supabase: SupabaseClient<Database>,
	slug: string
): Promise<ForumCategory | null> {
	const { data, error } = await db(supabase)
		.from('forum_categories')
		.select('*')
		.eq('slug', slug)
		.single();

	if (error && error.code !== 'PGRST116') {
		console.error('Error fetching category:', error);
	}
	return (data as ForumCategory) ?? null;
}

// ─── Topic Listings ───────────────────────────────────────────

export async function getTopicsByCategory(
	supabase: SupabaseClient<Database>,
	categoryId: string,
	opts: { cursor?: string; limit?: number } = {}
): Promise<{ topics: ForumTopicWithAuthor[]; nextCursor: string | null }> {
	const { cursor, limit = 20 } = opts;
	const client = db(supabase);

	let pinnedTopics: any[] = [];

	// Pinned topics only on first page
	if (!cursor) {
		const { data: pinned } = await client
			.from('forum_topics')
			.select(TOPIC_SELECT)
			.eq('category_id', categoryId)
			.eq('is_pinned', true)
			.order('last_reply_at', { ascending: false });
		pinnedTopics = pinned ?? [];
	}

	// Regular topics with cursor-based pagination
	let query = client
		.from('forum_topics')
		.select(TOPIC_SELECT)
		.eq('category_id', categoryId)
		.eq('is_pinned', false)
		.order('last_reply_at', { ascending: false })
		.limit(limit + 1);

	if (cursor) {
		query = query.lt('last_reply_at', cursor);
	}

	const { data } = await query;
	const regular = data ?? [];
	const hasMore = regular.length > limit;
	const page = regular.slice(0, limit);
	const nextCursor = hasMore ? page[page.length - 1].last_reply_at : null;

	const allTopics = [...pinnedTopics, ...page];
	await enrichWithAuthors(supabase, allTopics, (t) => t.author_id);

	return { topics: allTopics as ForumTopicWithAuthor[], nextCursor };
}

export async function getPopularTopics(
	supabase: SupabaseClient<Database>,
	limit = 5
): Promise<ForumTopicWithAuthor[]> {
	const client = db(supabase);
	const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

	const { data } = await client
		.from('forum_topics')
		.select(TOPIC_SELECT)
		.gte('created_at', thirtyDaysAgo)
		.order('reply_count', { ascending: false })
		.limit(limit);

	const topics = data ?? [];
	await enrichWithAuthors(supabase, topics, (t) => t.author_id);
	return topics as ForumTopicWithAuthor[];
}

export async function getRecentTopics(
	supabase: SupabaseClient<Database>,
	limit = 5
): Promise<ForumTopicWithAuthor[]> {
	const client = db(supabase);

	const { data } = await client
		.from('forum_topics')
		.select(TOPIC_SELECT)
		.order('created_at', { ascending: false })
		.limit(limit);

	const topics = data ?? [];
	await enrichWithAuthors(supabase, topics, (t) => t.author_id);
	return topics as ForumTopicWithAuthor[];
}

export async function getTopicsForPeak(
	supabase: SupabaseClient<Database>,
	peakId: string,
	limit = 5
): Promise<ForumTopicWithAuthor[]> {
	const client = db(supabase);

	const { data } = await client
		.from('forum_topics')
		.select(TOPIC_SELECT)
		.eq('peak_id', peakId)
		.order('last_reply_at', { ascending: false })
		.limit(limit);

	const topics = data ?? [];
	await enrichWithAuthors(supabase, topics, (t) => t.author_id);
	return topics as ForumTopicWithAuthor[];
}

export async function getUserTopics(
	supabase: SupabaseClient<Database>,
	userId: string,
	opts: { cursor?: string; limit?: number } = {}
): Promise<{ topics: ForumTopicWithAuthor[]; nextCursor: string | null }> {
	const { cursor, limit = 20 } = opts;
	const client = db(supabase);

	let query = client
		.from('forum_topics')
		.select(TOPIC_SELECT)
		.eq('author_id', userId)
		.order('created_at', { ascending: false })
		.limit(limit + 1);

	if (cursor) {
		query = query.lt('created_at', cursor);
	}

	const { data } = await query;
	const topics = data ?? [];
	const hasMore = topics.length > limit;
	const page = topics.slice(0, limit);
	const nextCursor = hasMore ? page[page.length - 1].created_at : null;

	await enrichWithAuthors(supabase, page, (t) => t.author_id);

	return { topics: page as ForumTopicWithAuthor[], nextCursor };
}

// ─── Topic Detail ─────────────────────────────────────────────

export async function getTopicDetail(
	supabase: SupabaseClient<Database>,
	topicId: string
): Promise<TopicDetail | null> {
	const client = db(supabase);

	const { data, error } = await client
		.from('forum_topics')
		.select(TOPIC_DETAIL_SELECT)
		.eq('id', topicId)
		.single();

	if (error) {
		if (error.code !== 'PGRST116') console.error('Error fetching topic:', error);
		return null;
	}

	const topic = data as any;
	await enrichWithAuthors(supabase, [topic], (t) => t.author_id);
	return topic as TopicDetail;
}

export async function getTopicBySlug(
	supabase: SupabaseClient<Database>,
	categorySlug: string,
	topicSlug: string
): Promise<TopicDetail | null> {
	const client = db(supabase);

	const { data: category } = await client
		.from('forum_categories')
		.select('id')
		.eq('slug', categorySlug)
		.single();

	if (!category) return null;

	const { data, error } = await client
		.from('forum_topics')
		.select(TOPIC_DETAIL_SELECT)
		.eq('category_id', category.id)
		.eq('slug', topicSlug)
		.single();

	if (error) {
		if (error.code !== 'PGRST116') console.error('Error fetching topic by slug:', error);
		return null;
	}

	const topic = data as any;
	await enrichWithAuthors(supabase, [topic], (t) => t.author_id);
	return topic as TopicDetail;
}

// ─── Replies ──────────────────────────────────────────────────

export async function getReplies(
	supabase: SupabaseClient<Database>,
	topicId: string,
	opts: { cursor?: string; limit?: number } = {}
): Promise<{ replies: ForumReplyWithAuthor[]; nextCursor: string | null }> {
	const { cursor, limit = 30 } = opts;
	const client = db(supabase);

	let query = client
		.from('forum_replies')
		.select('*')
		.eq('topic_id', topicId)
		.order('created_at', { ascending: true })
		.limit(limit + 1);

	if (cursor) {
		query = query.gt('created_at', cursor);
	}

	const { data } = await query;
	const replies = data ?? [];
	const hasMore = replies.length > limit;
	const page = replies.slice(0, limit);
	const nextCursor = hasMore ? page[page.length - 1].created_at : null;

	await enrichWithAuthors(supabase, page, (r) => r.author_id);

	// Resolve quoted replies
	const repliesById = new Map(page.map((r: any) => [r.id, r]));
	const missingQuoteIds = page
		.filter((r: any) => r.reply_to_id && !repliesById.has(r.reply_to_id))
		.map((r: any) => r.reply_to_id);

	const quotedReplies = new Map<string, any>();
	if (missingQuoteIds.length > 0) {
		const { data: missing } = await client
			.from('forum_replies')
			.select('id, body, author_id')
			.in('id', missingQuoteIds);

		if (missing?.length) {
			const quoteAuthorIds = missing.map((m: any) => m.author_id);
			const [profileRes] = await Promise.all([
				client.from('profiles').select('id, display_name').in('id', quoteAuthorIds)
			]);
			const profileMap = new Map(
				(profileRes.data ?? []).map((p: any) => [p.id, p])
			);

			for (const m of missing) {
				const profile = profileMap.get((m as any).author_id);
				quotedReplies.set((m as any).id, {
					id: (m as any).id,
					body: (m as any).body,
					author: { display_name: profile?.display_name ?? null }
				});
			}
		}
	}

	for (const reply of page as any[]) {
		if (reply.reply_to_id) {
			const inPage = repliesById.get(reply.reply_to_id);
			if (inPage) {
				reply.quoted_reply = {
					id: inPage.id,
					body: (inPage.body ?? '').slice(0, 150),
					author: { display_name: inPage.author?.display_name ?? null }
				};
			} else {
				reply.quoted_reply = quotedReplies.get(reply.reply_to_id) ?? null;
				if (reply.quoted_reply?.body) {
					reply.quoted_reply.body = reply.quoted_reply.body.slice(0, 150);
				}
			}
		} else {
			reply.quoted_reply = null;
		}
	}

	return { replies: page as ForumReplyWithAuthor[], nextCursor };
}

// ─── Mutations ────────────────────────────────────────────────

export async function createTopic(
	supabase: SupabaseClient<Database>,
	data: {
		title: string;
		body: string;
		categoryId: string;
		authorId: string;
		peakId?: string;
		routeId?: string;
	}
): Promise<ForumTopicWithAuthor> {
	const client = db(supabase);
	const slug = await generateUniqueSlug(client, data.categoryId, data.title);

	const { data: topic, error } = await client
		.from('forum_topics')
		.insert({
			slug,
			title: data.title,
			body: data.body,
			category_id: data.categoryId,
			author_id: data.authorId,
			peak_id: data.peakId ?? null,
			route_id: data.routeId ?? null
		})
		.select(TOPIC_SELECT)
		.single();

	if (error) throw error;

	await insertMentions(client, 'topic', topic.id, data.body);
	await enrichWithAuthors(supabase, [topic], (t) => t.author_id);

	return topic as unknown as ForumTopicWithAuthor;
}

export async function createReply(
	supabase: SupabaseClient<Database>,
	data: {
		topicId: string;
		authorId: string;
		body: string;
		replyToId?: string;
	}
): Promise<ForumReplyWithAuthor> {
	const client = db(supabase);

	const { data: reply, error } = await client
		.from('forum_replies')
		.insert({
			topic_id: data.topicId,
			author_id: data.authorId,
			body: data.body,
			reply_to_id: data.replyToId ?? null
		})
		.select('*')
		.single();

	if (error) throw error;

	await insertMentions(client, 'reply', reply.id, data.body);
	await enrichWithAuthors(supabase, [reply], (r) => r.author_id);
	(reply as any).quoted_reply = null;

	return reply as unknown as ForumReplyWithAuthor;
}

export async function updateTopic(
	supabase: SupabaseClient<Database>,
	topicId: string,
	userId: string,
	data: { title?: string; body?: string }
): Promise<void> {
	const { error } = await db(supabase)
		.from('forum_topics')
		.update(data)
		.eq('id', topicId)
		.eq('author_id', userId);

	if (error) throw error;
}

export async function updateReply(
	supabase: SupabaseClient<Database>,
	replyId: string,
	userId: string,
	data: { body: string }
): Promise<void> {
	const { error } = await db(supabase)
		.from('forum_replies')
		.update({ body: data.body })
		.eq('id', replyId)
		.eq('author_id', userId);

	if (error) throw error;
}

export async function deleteTopic(
	supabase: SupabaseClient<Database>,
	topicId: string,
	userId: string
): Promise<void> {
	const { error } = await db(supabase)
		.from('forum_topics')
		.delete()
		.eq('id', topicId)
		.eq('author_id', userId);

	if (error) throw error;
}

export async function deleteReply(
	supabase: SupabaseClient<Database>,
	replyId: string,
	userId: string
): Promise<void> {
	const { error } = await db(supabase)
		.from('forum_replies')
		.delete()
		.eq('id', replyId)
		.eq('author_id', userId);

	if (error) throw error;
}

// ─── Search ───────────────────────────────────────────────────

export async function searchForum(
	supabase: SupabaseClient<Database>,
	query: string,
	opts: { category?: string; limit?: number; offset?: number } = {}
): Promise<ForumSearchResult[]> {
	const { category, limit = 20, offset = 0 } = opts;
	const client = db(supabase);

	let categoryId: string | null = null;
	if (category) {
		const { data: cat } = await client
			.from('forum_categories')
			.select('id')
			.eq('slug', category)
			.single();
		categoryId = cat?.id ?? null;
	}

	const { data, error } = await client.rpc('search_forum', {
		search_query: query,
		category_filter: categoryId,
		result_limit: limit,
		result_offset: offset
	});

	if (error) {
		console.error('Error searching forum:', error);
		return [];
	}

	return (data ?? []) as ForumSearchResult[];
}

// ─── Views ────────────────────────────────────────────────────

export async function recordTopicView(
	supabase: SupabaseClient<Database>,
	topicId: string,
	userId: string
): Promise<void> {
	await db(supabase)
		.from('forum_topic_views')
		.upsert(
			{ topic_id: topicId, user_id: userId, last_viewed_at: new Date().toISOString() },
			{ onConflict: 'topic_id,user_id' }
		);
}
