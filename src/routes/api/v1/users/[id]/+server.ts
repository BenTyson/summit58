import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import type { RequestHandler } from './$types';
import { createSupabaseApiClient } from '$lib/server/supabase';
import { getUserAchievements } from '$lib/server/achievements';
import { getFollowStats, isFollowing } from '$lib/server/follows';
import { getReactionsForSummits } from '$lib/server/reactions';
import { getCommentsForSummits } from '$lib/server/comments';

/** GET /api/v1/users/[id] — public user profile */
export const GET: RequestHandler = async ({ request, url, params }) => {
	const userId = params.id;
	const { supabase: authClient } = createSupabaseApiClient(request);
	const client = authClient || createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);

	// Get current user if authenticated
	let currentUserId: string | null = null;
	if (authClient) {
		try {
			const { data: { user } } = await authClient.auth.getUser();
			currentUserId = user?.id ?? null;
		} catch {
			// Auth optional
		}
	}

	try {
		// Load profile
		const { data: profile, error: profileError } = await client
			.from('profiles')
			.select('*')
			.eq('id', userId)
			.single();

		if (profileError || !profile) {
			return new Response(JSON.stringify({ error: 'User not found' }), {
				status: 404,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		const isOwnProfile = currentUserId === userId;
		if (!profile.is_public && !isOwnProfile) {
			return new Response(JSON.stringify({ error: 'This profile is private' }), {
				status: 404,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		// Parallel data loading
		const [summitsRes, achievements, followStats, followingStatus] = await Promise.all([
			client
				.from('user_summits')
				.select(`
					id,
					peak_id,
					date_summited,
					conditions,
					notes,
					peak:peaks(id, name, slug, elevation, range, thumbnail_url),
					route:routes(name, difficulty_class)
				`)
				.eq('user_id', userId)
				.order('date_summited', { ascending: false }),
			getUserAchievements(client, userId),
			getFollowStats(client, userId),
			currentUserId && !isOwnProfile
				? isFollowing(client, currentUserId, userId)
				: Promise.resolve(null)
		]);

		const summits = (summitsRes.data ?? []) as any[];

		// Calculate stats
		const uniquePeakIds = new Set(summits.map((s: any) => s.peak_id));
		const totalSummits = summits.length;
		const uniquePeaks = uniquePeakIds.size;
		const progress = Math.round((uniquePeaks / 58) * 100);

		let totalElevation = 0;
		const seenPeaks = new Set<string>();
		summits.forEach((s: any) => {
			if (!seenPeaks.has(s.peak_id) && s.peak) {
				seenPeaks.add(s.peak_id);
				totalElevation += s.peak.elevation ?? 0;
			}
		});

		// Recent summits (last 5) with absolute URLs
		const baseUrl = url.origin;
		const recentSummits = summits.slice(0, 5).map((s: any) => ({
			...s,
			peak: s.peak
				? {
						...s.peak,
						thumbnail_url: s.peak.thumbnail_url
							? `${baseUrl}${s.peak.thumbnail_url}`
							: null
					}
				: s.peak
		}));

		// Batch-load social data for recent summits
		const summitIds = recentSummits.map((s) => s.id);
		const [reactions, comments] = summitIds.length > 0
			? await Promise.all([
					getReactionsForSummits(client, summitIds, currentUserId),
					getCommentsForSummits(client, summitIds)
				])
			: [{}, {}];

		return new Response(
			JSON.stringify({
				profile,
				isOwnProfile,
				stats: { totalSummits, uniquePeaks, progress, totalElevation },
				recentSummits,
				achievements,
				followStats,
				isFollowing: followingStatus,
				reactions,
				comments
			}),
			{ headers: { 'Content-Type': 'application/json' } }
		);
	} catch (e) {
		console.error('Error fetching user profile:', e);
		return new Response(JSON.stringify({ error: 'Failed to fetch user profile' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};
