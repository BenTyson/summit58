import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '$lib/types/database';

export interface SummitComment {
	id: string;
	user_id: string;
	summit_id: string;
	body: string;
	created_at: string;
	user: {
		id: string;
		display_name: string | null;
		avatar_url: string | null;
	};
}

export interface CommentData {
	count: number;
	comments: SummitComment[];
}

// Cast helper — summit_comments table isn't in generated types yet
function db(supabase: SupabaseClient<Database>) {
	return supabase as unknown as SupabaseClient;
}

/** Create a comment on a summit entry. */
export async function createComment(
	supabase: SupabaseClient<Database>,
	summitId: string,
	userId: string,
	body: string
): Promise<SummitComment | null> {
	const client = db(supabase);

	const { data, error } = await client
		.from('summit_comments')
		.insert({ summit_id: summitId, user_id: userId, body })
		.select('id, user_id, summit_id, body, created_at, profiles(id, display_name, avatar_url)')
		.single();

	if (error || !data) return null;

	const row = data as any;
	const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;

	return {
		id: row.id,
		user_id: row.user_id,
		summit_id: row.summit_id,
		body: row.body,
		created_at: row.created_at,
		user: profile ?? { id: row.user_id, display_name: null, avatar_url: null }
	};
}

/** Delete own comment. */
export async function deleteComment(
	supabase: SupabaseClient<Database>,
	commentId: string
): Promise<void> {
	await db(supabase).from('summit_comments').delete().eq('id', commentId);
}

/** Batch-fetch comments for multiple summit IDs. */
export async function getCommentsForSummits(
	supabase: SupabaseClient<Database>,
	summitIds: string[]
): Promise<Record<string, CommentData>> {
	if (summitIds.length === 0) return {};

	const client = db(supabase);

	const { data: comments } = await client
		.from('summit_comments')
		.select('id, user_id, summit_id, body, created_at, profiles(id, display_name, avatar_url)')
		.in('summit_id', summitIds)
		.order('created_at', { ascending: true });

	const result: Record<string, CommentData> = {};

	for (const id of summitIds) {
		result[id] = { count: 0, comments: [] };
	}

	for (const c of (comments ?? []) as any[]) {
		const entry = result[c.summit_id];
		if (!entry) continue;

		entry.count++;
		entry.comments.push({
			id: c.id,
			user_id: c.user_id,
			summit_id: c.summit_id,
			body: c.body,
			created_at: c.created_at,
			user: c.profiles ?? { id: c.user_id, display_name: null, avatar_url: null }
		});
	}

	return result;
}
