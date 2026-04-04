import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createSupabaseServerClient } from '$lib/server/supabase';
import { getReplies } from '$lib/server/forum';
import { getReactionsForPosts } from '$lib/server/forumReactions';

export const GET: RequestHandler = async ({ params, url, cookies }) => {
	const supabase = createSupabaseServerClient(cookies);

	const cursor = url.searchParams.get('cursor') ?? undefined;
	const limit = Math.min(Number(url.searchParams.get('limit') ?? 30), 50);

	const { replies, nextCursor } = await getReplies(supabase, params.id, { cursor, limit });

	const {
		data: { session }
	} = await supabase.auth.getSession();

	const replyIds = replies.map((r) => r.id);
	const reactions = await getReactionsForPosts(
		supabase,
		'reply',
		replyIds,
		session?.user?.id
	);

	return json({ replies, nextCursor, reactions });
};
