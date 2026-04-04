import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '$lib/types/database';

export interface ForumReactionData {
	counts: Record<string, number>;
	userReactions: string[];
}

function db(supabase: SupabaseClient<Database>) {
	return supabase as unknown as SupabaseClient;
}

/** Toggle a reaction on a forum topic or reply. */
export async function toggleForumReaction(
	supabase: SupabaseClient<Database>,
	data: {
		reactableType: 'topic' | 'reply';
		reactableId: string;
		userId: string;
		reactionType: string;
	}
): Promise<{ reacted: boolean }> {
	const client = db(supabase);

	const { data: existing } = await client
		.from('forum_reactions')
		.select('id')
		.eq('reactable_type', data.reactableType)
		.eq('reactable_id', data.reactableId)
		.eq('user_id', data.userId)
		.eq('reaction_type', data.reactionType)
		.maybeSingle();

	if (existing) {
		await client.from('forum_reactions').delete().eq('id', existing.id);
		return { reacted: false };
	} else {
		await client.from('forum_reactions').insert({
			reactable_type: data.reactableType,
			reactable_id: data.reactableId,
			user_id: data.userId,
			reaction_type: data.reactionType
		});
		return { reacted: true };
	}
}

/** Batch-fetch reaction data for multiple posts of the same type. */
export async function getReactionsForPosts(
	supabase: SupabaseClient<Database>,
	postType: 'topic' | 'reply',
	postIds: string[],
	userId?: string | null
): Promise<Record<string, ForumReactionData>> {
	if (postIds.length === 0) return {};

	const client = db(supabase);

	const { data: reactions } = await client
		.from('forum_reactions')
		.select('reactable_id, user_id, reaction_type')
		.eq('reactable_type', postType)
		.in('reactable_id', postIds);

	const result: Record<string, ForumReactionData> = {};

	for (const id of postIds) {
		result[id] = { counts: {}, userReactions: [] };
	}

	for (const r of (reactions ?? []) as any[]) {
		const entry = result[r.reactable_id];
		if (!entry) continue;

		entry.counts[r.reaction_type] = (entry.counts[r.reaction_type] ?? 0) + 1;

		if (userId && r.user_id === userId) {
			entry.userReactions.push(r.reaction_type);
		}
	}

	return result;
}
