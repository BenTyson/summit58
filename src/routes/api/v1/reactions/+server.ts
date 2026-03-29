import type { RequestHandler } from './$types';
import { requireAuth } from '$lib/server/supabase';
import { toggleReaction } from '$lib/server/reactions';

/** POST /api/v1/reactions — toggle a congrats reaction on a summit */
export const POST: RequestHandler = async ({ request }) => {
	const { supabase, user, error: authError } = await requireAuth(request);

	if (!supabase || !user) {
		return new Response(JSON.stringify({ error: authError }), {
			status: 401,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	const body = await request.json();
	const { summit_id } = body;

	if (!summit_id) {
		return new Response(JSON.stringify({ error: 'summit_id is required' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	try {
		const reacted = await toggleReaction(supabase, summit_id, user.id);
		return new Response(JSON.stringify({ reacted }), {
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (e) {
		console.error('Error toggling reaction:', e);
		return new Response(JSON.stringify({ error: 'Failed to toggle reaction' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};
