import type { RequestHandler } from './$types';
import { requireAuth } from '$lib/server/supabase';
import { updateSummit, deleteSummit } from '$lib/server/summits';

/** PATCH /api/v1/summits/[id] — update a summit */
export const PATCH: RequestHandler = async ({ request, params }) => {
	const { supabase, user, error: authError } = await requireAuth(request);

	if (!supabase || !user) {
		return new Response(JSON.stringify({ error: authError }), {
			status: 401,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	const body = await request.json();
	const { date_summited, route_id, conditions, notes, start_time, summit_time, party_size } = body;

	const updates: Record<string, unknown> = {};
	if (date_summited !== undefined) updates.date_summited = date_summited;
	if (route_id !== undefined) updates.route_id = route_id;
	if (conditions !== undefined) updates.conditions = conditions;
	if (notes !== undefined) updates.notes = notes;
	if (start_time !== undefined) updates.start_time = start_time;
	if (summit_time !== undefined) updates.summit_time = summit_time;
	if (party_size !== undefined) updates.party_size = party_size != null ? Number(party_size) : null;

	try {
		const summit = await updateSummit(supabase, params.id, updates);
		return new Response(JSON.stringify({ summit }), {
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (e) {
		console.error('Error updating summit:', e);
		return new Response(JSON.stringify({ error: 'Failed to update summit' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};

/** DELETE /api/v1/summits/[id] — delete a summit */
export const DELETE: RequestHandler = async ({ request, params }) => {
	const { supabase, user, error: authError } = await requireAuth(request);

	if (!supabase || !user) {
		return new Response(JSON.stringify({ error: authError }), {
			status: 401,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	try {
		await deleteSummit(supabase, params.id);
		return new Response(null, { status: 204 });
	} catch (e) {
		console.error('Error deleting summit:', e);
		return new Response(JSON.stringify({ error: 'Failed to delete summit' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};
