import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getRouteBySlug } from '$lib/server/peaks';
import { getBestTrace } from '$lib/server/traces';

export const GET: RequestHandler = async ({ params, url }) => {
	const client = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);

	const result = await getRouteBySlug(client, params.slug, params.route);
	if (!result) {
		throw error(404, 'Route not found');
	}

	const { peak, route } = result;

	// Resolve static image paths
	const baseUrl = url.origin;
	peak.hero_image_url = peak.hero_image_url ? `${baseUrl}${peak.hero_image_url}` : null;
	peak.thumbnail_url = peak.thumbnail_url ? `${baseUrl}${peak.thumbnail_url}` : null;

	// Prefer community trace, fall back to route's built-in geometry
	const bestTrace = await getBestTrace(client, route.id);
	const trailGeometry = bestTrace ?? (route.trail_geometry as Record<string, unknown> | null);

	return new Response(
		JSON.stringify({
			peak: {
				id: peak.id,
				name: peak.name,
				slug: peak.slug,
				elevation: peak.elevation,
				range: peak.range,
				latitude: peak.latitude,
				longitude: peak.longitude,
				hero_image_url: peak.hero_image_url,
				thumbnail_url: peak.thumbnail_url
			},
			route: {
				id: route.id,
				name: route.name,
				slug: route.slug,
				distance_miles: route.distance_miles,
				elevation_gain_ft: route.elevation_gain_ft,
				difficulty_class: route.difficulty_class,
				typical_time_hours: route.typical_time_hours,
				is_standard: route.is_standard
			},
			trailGeometry
		}),
		{ headers: { 'Content-Type': 'application/json' } }
	);
};
