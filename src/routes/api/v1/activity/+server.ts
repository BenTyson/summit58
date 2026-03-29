import type { RequestHandler } from './$types';
import { requireAuth } from '$lib/server/supabase';
import { getUserActivityFeed, getFollowingActivityFeed, type ActivityItem } from '$lib/server/activity';
import { getReactionsForSummits } from '$lib/server/reactions';
import { getCommentsForSummits } from '$lib/server/comments';

/** GET /api/v1/activity — unified activity feed with social data */
export const GET: RequestHandler = async ({ request, url }) => {
	const { supabase, user, error: authError } = await requireAuth(request);

	if (!supabase || !user) {
		return new Response(JSON.stringify({ error: authError }), {
			status: 401,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	const feed = url.searchParams.get('feed') || 'you';
	const limit = Math.min(parseInt(url.searchParams.get('limit') || '50', 10) || 50, 100);

	try {
		const items: ActivityItem[] =
			feed === 'following'
				? await getFollowingActivityFeed(supabase, user.id, limit)
				: await getUserActivityFeed(supabase, user.id, limit);

		// Resolve thumbnail URLs to absolute paths
		const baseUrl = url.origin;
		for (const item of items) {
			if (item.type === 'summit') {
				const data = item.data as { peak: { thumbnail_url: string | null } };
				if (data.peak.thumbnail_url) {
					data.peak.thumbnail_url = `${baseUrl}${data.peak.thumbnail_url}`;
				}
			}
		}

		// Batch-load social data for summit items
		const summitIds = items
			.filter((i) => i.type === 'summit')
			.map((i) => i.id.replace('summit-', ''));

		const [reactions, comments] = summitIds.length > 0
			? await Promise.all([
					getReactionsForSummits(supabase, summitIds, user.id),
					getCommentsForSummits(supabase, summitIds)
				])
			: [{}, {}];

		return new Response(JSON.stringify({ items, reactions, comments }), {
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (e) {
		console.error('Error fetching activity feed:', e);
		return new Response(JSON.stringify({ error: 'Failed to fetch activity feed' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};
