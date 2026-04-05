import type { RequestHandler } from './$types';
import { requireAuth } from '$lib/server/supabase';
import { toggleForumReaction } from '$lib/server/forum';

/** POST /api/v1/forum/reactions — toggle a forum reaction */
export const POST: RequestHandler = async ({ request }) => {
	const { supabase, user, error: authError } = await requireAuth(request);

	if (!supabase || !user) {
		return new Response(JSON.stringify({ error: authError }), {
			status: 401,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	const body = await request.json();
	const { reactable_type, reactable_id, reaction_type } = body;

	if (!reactable_type || !reactable_id || !reaction_type) {
		return new Response(
			JSON.stringify({ error: 'reactable_type, reactable_id, and reaction_type are required' }),
			{ status: 400, headers: { 'Content-Type': 'application/json' } }
		);
	}

	if (!['topic', 'reply'].includes(reactable_type)) {
		return new Response(
			JSON.stringify({ error: 'reactable_type must be "topic" or "reply"' }),
			{ status: 400, headers: { 'Content-Type': 'application/json' } }
		);
	}

	if (!['like', 'helpful', 'fire', 'summit'].includes(reaction_type)) {
		return new Response(
			JSON.stringify({ error: 'Invalid reaction_type' }),
			{ status: 400, headers: { 'Content-Type': 'application/json' } }
		);
	}

	try {
		const result = await toggleForumReaction(supabase, {
			reactableType: reactable_type,
			reactableId: reactable_id,
			userId: user.id,
			reactionType: reaction_type
		});

		return new Response(JSON.stringify(result), {
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (e) {
		console.error('Error toggling forum reaction:', e);
		return new Response(JSON.stringify({ error: 'Failed to toggle reaction' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};
