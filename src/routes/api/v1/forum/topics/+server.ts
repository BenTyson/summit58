import type { RequestHandler } from './$types';
import { requireAuth } from '$lib/server/supabase';
import { createTopic } from '$lib/server/forum';

/** POST /api/v1/forum/topics — create a new forum topic */
export const POST: RequestHandler = async ({ request }) => {
	const { supabase, user, error: authError } = await requireAuth(request);

	if (!supabase || !user) {
		return new Response(JSON.stringify({ error: authError }), {
			status: 401,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	const body = await request.json();
	const { title, body: topicBody, category_id, peak_id, route_id } = body;

	if (!title?.trim() || !topicBody?.trim() || !category_id) {
		return new Response(
			JSON.stringify({ error: 'title, body, and category_id are required' }),
			{ status: 400, headers: { 'Content-Type': 'application/json' } }
		);
	}

	try {
		const topic = await createTopic(supabase, {
			title: title.trim(),
			body: topicBody.trim(),
			categoryId: category_id,
			authorId: user.id,
			peakId: peak_id || undefined,
			routeId: route_id || undefined
		});

		return new Response(JSON.stringify({ topic }), {
			status: 201,
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (e) {
		console.error('Error creating forum topic:', e);
		return new Response(JSON.stringify({ error: 'Failed to create topic' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};
