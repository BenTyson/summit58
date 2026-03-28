import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createSupabaseApiClient } from '$lib/server/supabase';
import { getPeakBySlug, getRelatedPeaks } from '$lib/server/peaks';
import { getPeakReviews, getPeakReviewStats, getUserReviewForPeak } from '$lib/server/reviews';
import { getImagesForPeak, getImageUrl } from '$lib/server/images';
import { getConditionsForPeak } from '$lib/server/conditions';
import { getRecentTrailReports } from '$lib/server/trailReports';
import { getUserSummitsForPeak } from '$lib/server/summits';
import { isOnWatchlist } from '$lib/server/watchlist';

export const GET: RequestHandler = async ({ params, request, url }) => {
	const { supabase: authClient } = createSupabaseApiClient(request);
	const client = authClient || createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);

	const peak = await getPeakBySlug(client, params.slug);
	if (!peak) {
		throw error(404, 'Peak not found');
	}

	// Resolve static image paths to absolute URLs
	const baseUrl = url.origin;
	peak.hero_image_url = peak.hero_image_url ? `${baseUrl}${peak.hero_image_url}` : null;
	peak.thumbnail_url = peak.thumbnail_url ? `${baseUrl}${peak.thumbnail_url}` : null;

	// All public queries in parallel
	const [reviews, reviewStats, images, conditions, trailReports, relatedPeaks] = await Promise.all(
		[
			getPeakReviews(client, peak.id),
			getPeakReviewStats(client, peak.id),
			getImagesForPeak(client, peak.id),
			getConditionsForPeak(client, peak.id),
			getRecentTrailReports(client, peak.id),
			getRelatedPeaks(client, peak.id, peak.range, peak.elevation)
		]
	);

	// Resolve gallery image URLs
	const imagesWithUrls = images.slice(0, 20).map((img) => ({
		...img,
		url: getImageUrl(client, img.storage_path)
	}));

	// Resolve related peak image URLs
	const relatedWithUrls = relatedPeaks.map((p) => ({
		...p,
		hero_image_url: p.hero_image_url ? `${baseUrl}${p.hero_image_url}` : null,
		thumbnail_url: p.thumbnail_url ? `${baseUrl}${p.thumbnail_url}` : null
	}));

	// Auth-dependent data
	let userData = null;
	if (authClient) {
		try {
			const {
				data: { user }
			} = await authClient.auth.getUser();
			if (user) {
				const [userSummits, userReview, isWatched] = await Promise.all([
					getUserSummitsForPeak(authClient, user.id, peak.id),
					getUserReviewForPeak(authClient, user.id, peak.id),
					isOnWatchlist(authClient, user.id, peak.id)
				]);
				userData = { userSummits, userReview, isWatched };
			}
		} catch {
			// Auth optional
		}
	}

	return new Response(
		JSON.stringify({
			peak,
			reviews: reviews.slice(0, 10),
			avgRating: reviewStats.avgRating,
			totalReviews: reviewStats.totalReviews,
			images: imagesWithUrls,
			conditions,
			trailReports,
			relatedPeaks: relatedWithUrls,
			...(userData && { userData })
		}),
		{
			headers: { 'Content-Type': 'application/json' }
		}
	);
};
