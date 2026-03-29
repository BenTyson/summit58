import type { RequestHandler } from './$types';
import { requireAuth } from '$lib/server/supabase';
import { followUser, unfollowUser, getSuggestedUsers } from '$lib/server/follows';

/** GET /api/v1/follows — suggested users to follow */
export const GET: RequestHandler = async ({ request }) => {
	const { supabase, user, error: authError } = await requireAuth(request);

	if (!supabase || !user) {
		return new Response(JSON.stringify({ error: authError }), {
			status: 401,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	try {
		const suggestions = await getSuggestedUsers(supabase, user.id, 10);
		return new Response(JSON.stringify({ suggestions }), {
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (e) {
		console.error('Error fetching suggestions:', e);
		return new Response(JSON.stringify({ error: 'Failed to fetch suggestions' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};

/** POST /api/v1/follows — follow a user */
export const POST: RequestHandler = async ({ request }) => {
	const { supabase, user, error: authError } = await requireAuth(request);

	if (!supabase || !user) {
		return new Response(JSON.stringify({ error: authError }), {
			status: 401,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	const body = await request.json();
	const { following_id } = body;

	if (!following_id) {
		return new Response(JSON.stringify({ error: 'following_id is required' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	if (following_id === user.id) {
		return new Response(JSON.stringify({ error: 'Cannot follow yourself' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	try {
		await followUser(supabase, user.id, following_id);
		return new Response(JSON.stringify({ success: true }), {
			status: 201,
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (e) {
		console.error('Error following user:', e);
		return new Response(JSON.stringify({ error: 'Failed to follow user' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};

/** DELETE /api/v1/follows — unfollow a user */
export const DELETE: RequestHandler = async ({ request }) => {
	const { supabase, user, error: authError } = await requireAuth(request);

	if (!supabase || !user) {
		return new Response(JSON.stringify({ error: authError }), {
			status: 401,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	const body = await request.json();
	const { following_id } = body;

	if (!following_id) {
		return new Response(JSON.stringify({ error: 'following_id is required' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	try {
		await unfollowUser(supabase, user.id, following_id);
		return new Response(null, { status: 204 });
	} catch (e) {
		console.error('Error unfollowing user:', e);
		return new Response(JSON.stringify({ error: 'Failed to unfollow user' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};
