import type { PageServerLoad } from './$types';
import { createSupabaseServerClient } from '$lib/server/supabase';
import { getCategories, getRecentTopics, getPopularTopics } from '$lib/server/forum';
import { getUserBookmarks } from '$lib/server/forumBookmarks';

export const load: PageServerLoad = async ({ cookies }) => {
	const supabase = createSupabaseServerClient(cookies);

	const {
		data: { session }
	} = await supabase.auth.getSession();

	const [categories, recentTopics, popularTopics] = await Promise.all([
		getCategories(supabase),
		getRecentTopics(supabase, 5),
		getPopularTopics(supabase, 5)
	]);

	let bookmarkedTopics: Awaited<ReturnType<typeof getUserBookmarks>>['topics'] = [];
	if (session?.user) {
		const result = await getUserBookmarks(supabase, session.user.id, { limit: 5 });
		bookmarkedTopics = result.topics;
	}

	return {
		categories,
		recentTopics,
		popularTopics,
		bookmarkedTopics,
		isLoggedIn: !!session
	};
};
