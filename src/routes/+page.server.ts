import type { PageServerLoad } from './$types';
import { createSupabaseServerClient } from '$lib/server/supabase';
import { getFeaturedPeaks, getAllPeaks } from '$lib/server/peaks';
import { getFollowingActivityFeed, type ActivityItem } from '$lib/server/activity';

export const load: PageServerLoad = async ({ cookies }) => {
  const supabase = createSupabaseServerClient(cookies);

  try {
    const { data: { session } } = await supabase.auth.getSession();

    const [featuredPeaks, allPeaks, profileCount, summitCount] = await Promise.all([
      getFeaturedPeaks(supabase, 5),
      getAllPeaks(supabase),
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
      supabase.from('user_summits').select('id', { count: 'exact', head: true })
    ]);

    // Load friends activity if logged in
    let friendsActivity: ActivityItem[] = [];
    if (session?.user) {
      friendsActivity = await getFollowingActivityFeed(supabase, session.user.id, 8);
    }

    return {
      peaks: featuredPeaks,
      totalPeaks: allPeaks.length,
      climberCount: profileCount.count ?? 0,
      summitCount: summitCount.count ?? 0,
      friendsActivity
    };
  } catch (error) {
    console.error('Error loading homepage data:', error);
    return {
      peaks: [],
      totalPeaks: 0,
      climberCount: 0,
      summitCount: 0,
      friendsActivity: []
    };
  }
};
