import type { PageServerLoad } from './$types';
import { createSupabaseServerClient } from '$lib/server/supabase';
import { getFeaturedPeaks, getAllPeaks } from '$lib/server/peaks';

export const load: PageServerLoad = async ({ cookies }) => {
  const supabase = createSupabaseServerClient(cookies);

  try {
    const [featuredPeaks, allPeaks, profileCount, summitCount] = await Promise.all([
      getFeaturedPeaks(supabase, 5),
      getAllPeaks(supabase),
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
      supabase.from('user_summits').select('id', { count: 'exact', head: true })
    ]);

    return {
      peaks: featuredPeaks,
      totalPeaks: allPeaks.length,
      climberCount: profileCount.count ?? 0,
      summitCount: summitCount.count ?? 0
    };
  } catch (error) {
    console.error('Error loading homepage data:', error);
    return {
      peaks: [],
      totalPeaks: 0,
      climberCount: 0,
      summitCount: 0
    };
  }
};
