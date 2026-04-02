import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getPeakBySlug } from '$lib/server/peaks';
import { getForecastForPeak } from '$lib/server/conditions';

export const GET: RequestHandler = async ({ params }) => {
	const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);

	const peak = await getPeakBySlug(supabase, params.slug);
	if (!peak) {
		throw error(404, 'Peak not found');
	}

	const forecast = await getForecastForPeak(supabase, peak.id, {
		name: peak.name,
		slug: peak.slug,
		elevation: peak.elevation
	});

	if (!forecast) {
		throw error(404, 'No forecast data available');
	}

	return new Response(JSON.stringify(forecast), {
		headers: {
			'Content-Type': 'application/json',
			'Cache-Control': 'public, max-age=1800, stale-while-revalidate=3600'
		}
	});
};
