import type { RequestHandler } from './$types';
import { requireAuth } from '$lib/server/supabase';
import { getPeakBySlug } from '$lib/server/peaks';
import { createReview } from '$lib/server/reviews';
import { checkAndAwardAchievements } from '$lib/server/achievements';

/** POST /api/v1/peaks/[slug]/reviews — create a review */
export const POST: RequestHandler = async ({ request, params }) => {
	const { supabase, user, error: authError } = await requireAuth(request);

	if (!supabase || !user) {
		return new Response(JSON.stringify({ error: authError }), {
			status: 401,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	const peak = await getPeakBySlug(supabase, params.slug);
	if (!peak) {
		return new Response(JSON.stringify({ error: 'Peak not found' }), {
			status: 404,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	const body = await request.json();
	const { rating, title, body: reviewBody } = body;

	if (!rating || rating < 1 || rating > 5) {
		return new Response(JSON.stringify({ error: 'Valid rating (1-5) required' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	try {
		const review = await createReview(supabase, {
			user_id: user.id,
			peak_id: peak.id,
			rating,
			title: title || null,
			body: reviewBody || null
		});

		const newAchievements = await checkAndAwardAchievements(supabase, user.id, 'review');

		return new Response(JSON.stringify({ review, newAchievements }), {
			status: 201,
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (e: any) {
		if (e.code === '23505') {
			return new Response(JSON.stringify({ error: 'You have already reviewed this peak' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' }
			});
		}
		console.error('Error creating review:', e);
		return new Response(JSON.stringify({ error: 'Failed to create review' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};
