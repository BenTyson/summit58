import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import type { RequestHandler } from './$types';
import { createSupabaseApiClient } from '$lib/server/supabase';
import { getAllPeaks } from '$lib/server/peaks';
import { getUniquePeaksSummited } from '$lib/server/summits';

export const GET: RequestHandler = async ({ request, url }) => {
	const { supabase: authClient } = createSupabaseApiClient(request);
	const client = authClient || createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);

	const peaks = await getAllPeaks(client);

	// Server-side filters
	const rangeFilter = url.searchParams.get('range');
	const classFilter = url.searchParams.get('class');

	let filtered = peaks;
	if (rangeFilter) {
		filtered = filtered.filter((p) => p.range === rangeFilter);
	}
	if (classFilter) {
		const cls = parseInt(classFilter, 10);
		if (!isNaN(cls)) {
			filtered = filtered.filter((p) => p.standard_route?.difficulty_class === cls);
		}
	}

	// Resolve static image paths to absolute URLs
	const baseUrl = url.origin;
	const peaksWithAbsoluteUrls = filtered.map((p) => ({
		...p,
		hero_image_url: p.hero_image_url ? `${baseUrl}${p.hero_image_url}` : null,
		thumbnail_url: p.thumbnail_url ? `${baseUrl}${p.thumbnail_url}` : null
	}));

	// If authenticated, include user's summited peak IDs
	let summitedPeakIds: string[] = [];
	if (authClient) {
		try {
			const {
				data: { user }
			} = await authClient.auth.getUser();
			if (user) {
				summitedPeakIds = await getUniquePeaksSummited(authClient, user.id);
			}
		} catch {
			// Auth optional on public endpoint
		}
	}

	return new Response(
		JSON.stringify({
			peaks: peaksWithAbsoluteUrls,
			summitedPeakIds
		}),
		{
			headers: { 'Content-Type': 'application/json' }
		}
	);
};
