import type { RequestHandler } from './$types';
import { requireAuth } from '$lib/server/supabase';
import { getUserSummitStats, getUserSummits, getUniquePeaksSummited } from '$lib/server/summits';
import { getUserAchievements } from '$lib/server/achievements';

export const GET: RequestHandler = async ({ request, url }) => {
	const { supabase, user, error: authError } = await requireAuth(request);

	if (!supabase || !user) {
		return new Response(JSON.stringify({ error: authError }), {
			status: 401,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	// Get profile
	const { data: profile } = await supabase
		.from('profiles')
		.select('*')
		.eq('id', user.id)
		.single();

	// All queries in parallel
	const [summitStats, summits, achievements, uniquePeakIds, allPeaksResult] = await Promise.all([
		getUserSummitStats(supabase, user.id),
		getUserSummits(supabase, user.id),
		getUserAchievements(supabase, user.id),
		getUniquePeaksSummited(supabase, user.id),
		supabase
			.from('peaks')
			.select('id, name, slug, rank, range, elevation')
			.order('rank', { ascending: true })
	]);

	// Resolve summit peak thumbnail URLs to absolute
	const baseUrl = url.origin;
	const summitsWithUrls = summits.map((s) => ({
		...s,
		peak: {
			...s.peak,
			thumbnail_url: s.peak.thumbnail_url ? `${baseUrl}${s.peak.thumbnail_url}` : null
		}
	}));

	return new Response(
		JSON.stringify({
			profile,
			summitStats,
			summits: summitsWithUrls,
			achievements,
			uniquePeakIds,
			allPeaks: allPeaksResult.data ?? []
		}),
		{
			headers: { 'Content-Type': 'application/json' }
		}
	);
};
