import type { RequestHandler } from './$types';
import { requireAuth } from '$lib/server/supabase';
import { getPeakBySlug } from '$lib/server/peaks';
import { createTrailReport } from '$lib/server/trailReports';
import { checkAndAwardAchievements } from '$lib/server/achievements';

/** POST /api/v1/peaks/[slug]/trail-reports — create a trail report */
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
	const {
		hike_date, trail_status, snow_depth_inches,
		crowd_level, road_status, hazards, notes,
		parking_status, arrival_time, parking_notes
	} = body;

	if (!hike_date) {
		return new Response(JSON.stringify({ error: 'hike_date is required' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	try {
		const trailReport = await createTrailReport(supabase, {
			user_id: user.id,
			peak_id: peak.id,
			hike_date,
			trail_status: trail_status || null,
			snow_depth_inches: snow_depth_inches != null ? Number(snow_depth_inches) : null,
			crowd_level: crowd_level || null,
			road_status: road_status || null,
			hazards: hazards || [],
			notes: notes || null,
			parking_status: parking_status || null,
			arrival_time: arrival_time || null,
			parking_notes: parking_notes || null
		});

		const newAchievements = await checkAndAwardAchievements(supabase, user.id, 'trail_report');

		return new Response(JSON.stringify({ trailReport, newAchievements }), {
			status: 201,
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (e) {
		console.error('Error creating trail report:', e);
		return new Response(JSON.stringify({ error: 'Failed to create trail report' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};
