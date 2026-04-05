import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '$lib/types/database';
import type { ForumReplyWithAuthor } from './types';
import { db, insertMentions, enrichWithAuthors } from './utils';

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
