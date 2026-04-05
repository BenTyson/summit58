import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '$lib/types/database';
import { db } from './utils';

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

export async function getUserTopicViewTimestamps(
	supabase: SupabaseClient<Database>,
	userId: string,
	topicIds: string[]
): Promise<Record<string, string>> {
	if (!topicIds.length) return {};
	const { data } = await db(supabase)
		.from('forum_topic_views')
		.select('topic_id, last_viewed_at')
		.eq('user_id', userId)
		.in('topic_id', topicIds);
	return Object.fromEntries((data ?? []).map((v) => [v.topic_id, v.last_viewed_at]));
}
