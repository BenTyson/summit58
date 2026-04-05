import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '$lib/types/database';

export function db(supabase: SupabaseClient<Database>) {
	return supabase as unknown as SupabaseClient;
}

export const TOPIC_SELECT = `*, peak:peaks(id, name, slug)`;

export const TOPIC_DETAIL_SELECT = `*, peak:peaks(id, name, slug), category:forum_categories(*), route:routes(id, name)`;

export function slugify(text: string): string {
	return text
		.toLowerCase()
		.replace(/[^\w\s-]/g, '')
		.replace(/[\s_]+/g, '-')
		.replace(/^-+|-+$/g, '')
		.slice(0, 80);
}

export async function generateUniqueSlug(
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

export function extractMentions(text: string): string[] {
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

export async function insertMentions(
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
