import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '$lib/types/database';

export interface ReactionData {
	count: number;
	hasReacted: boolean;
	recentReactors: { id: string; display_name: string | null; avatar_url: string | null }[];
}

// Cast helper — summit_reactions table isn't in generated types yet
function db(supabase: SupabaseClient<Database>) {
	return supabase as unknown as SupabaseClient;
}

/** Toggle a congrats reaction on a summit. Returns true if added, false if removed. */
export async function toggleReaction(
	supabase: SupabaseClient<Database>,
	summitId: string,
	userId: string
): Promise<boolean> {
	const client = db(supabase);

	const { data: existing } = await client
		.from('summit_reactions')
		.select('id')
		.eq('summit_id', summitId)
		.eq('user_id', userId)
		.maybeSingle();

	if (existing) {
		await client.from('summit_reactions').delete().eq('id', existing.id);
		return false;
	} else {
		await client.from('summit_reactions').insert({ summit_id: summitId, user_id: userId });
		return true;
	}
}

/** Batch-fetch reaction data for multiple summit IDs. */
export async function getReactionsForSummits(
	supabase: SupabaseClient<Database>,
	summitIds: string[],
	currentUserId: string | null
): Promise<Record<string, ReactionData>> {
	if (summitIds.length === 0) return {};

	const client = db(supabase);

	const { data: reactions } = await client
		.from('summit_reactions')
		.select('summit_id, user_id, profiles(id, display_name, avatar_url)')
		.in('summit_id', summitIds)
		.order('created_at', { ascending: false });

	const result: Record<string, ReactionData> = {};

	for (const id of summitIds) {
		result[id] = { count: 0, hasReacted: false, recentReactors: [] };
	}

	for (const r of (reactions ?? []) as any[]) {
		const entry = result[r.summit_id];
		if (!entry) continue;

		entry.count++;

		if (currentUserId && r.user_id === currentUserId) {
			entry.hasReacted = true;
		}

		if (entry.recentReactors.length < 3 && r.profiles) {
			entry.recentReactors.push({
				id: r.profiles.id,
				display_name: r.profiles.display_name,
				avatar_url: r.profiles.avatar_url
			});
		}
	}

	return result;
}
