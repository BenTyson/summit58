import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getPeakBySlug } from '$lib/server/peaks';
import { getConditionsForPeak } from '$lib/server/conditions';

export const GET: RequestHandler = async ({ params }) => {
	const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);

	const peak = await getPeakBySlug(supabase, params.slug);
	if (!peak) {
		throw error(404, 'Peak not found');
	}

	const conditions = await getConditionsForPeak(supabase, peak.id);

	return new Response(JSON.stringify({ conditions }), {
		headers: { 'Content-Type': 'application/json' }
	});
};
