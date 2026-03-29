import type { RequestHandler } from './$types';
import { requireAuth } from '$lib/server/supabase';
import { createSummit } from '$lib/server/summits';
import { canLogSummit } from '$lib/server/subscriptions';
import { checkAndAwardAchievements } from '$lib/server/achievements';

/** GET /api/v1/summits — check if user can log a summit (pre-flight) */
export const GET: RequestHandler = async ({ request }) => {
	const { supabase, user, error: authError } = await requireAuth(request);

	if (!supabase || !user) {
		return new Response(JSON.stringify({ error: authError }), {
			status: 401,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	const result = await canLogSummit(supabase, user.id);

	return new Response(JSON.stringify(result), {
		headers: { 'Content-Type': 'application/json' }
	});
};

/** POST /api/v1/summits — create a new summit */
export const POST: RequestHandler = async ({ request }) => {
	const { supabase, user, error: authError } = await requireAuth(request);

	if (!supabase || !user) {
		return new Response(JSON.stringify({ error: authError }), {
			status: 401,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	const body = await request.json();
	const { peak_id, date_summited, route_id, conditions, notes, start_time, summit_time, party_size } = body;

	if (!peak_id || !date_summited) {
		return new Response(JSON.stringify({ error: 'peak_id and date_summited are required' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	const summitCheck = await canLogSummit(supabase, user.id);
	if (!summitCheck.allowed) {
		return new Response(
			JSON.stringify({ error: 'Summit limit reached', limitReached: true, remaining: 0 }),
			{ status: 403, headers: { 'Content-Type': 'application/json' } }
		);
	}

	try {
		const summit = await createSummit(supabase, {
			user_id: user.id,
			peak_id,
			date_summited,
			route_id: route_id || null,
			conditions: conditions || null,
			notes: notes || null,
			start_time: start_time || null,
			summit_time: summit_time || null,
			party_size: party_size != null ? Number(party_size) : null
		});

		const newAchievements = await checkAndAwardAchievements(supabase, user.id, 'summit');

		return new Response(JSON.stringify({ summit, newAchievements }), {
			status: 201,
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (e) {
		console.error('Error logging summit:', e);
		return new Response(JSON.stringify({ error: 'Failed to log summit' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};
