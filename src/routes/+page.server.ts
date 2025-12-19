import type { PageServerLoad } from './$types';
import { createSupabaseServerClient } from '$lib/server/supabase';
import { getFeaturedPeaks, getAllPeaks } from '$lib/server/peaks';

export const load: PageServerLoad = async ({ cookies }) => {
  const supabase = createSupabaseServerClient(cookies);

  try {
    const [featuredPeaks, allPeaks] = await Promise.all([
      getFeaturedPeaks(supabase, 5),
      getAllPeaks(supabase)
    ]);

    return {
      peaks: featuredPeaks,
      totalPeaks: allPeaks.length
    };
  } catch (error) {
    console.error('Error loading homepage data:', error);
    return {
      peaks: [],
      totalPeaks: 0
    };
  }
};
