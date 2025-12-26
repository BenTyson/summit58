import type { PageServerLoad, Actions } from './$types';
import { createSupabaseServerClient } from '$lib/server/supabase';
import { getUserSummitStats } from '$lib/server/summits';
import { getUserAchievements, markAchievementsNotified } from '$lib/server/achievements';
import { redirect, fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ cookies }) => {
  const supabase = createSupabaseServerClient(cookies);
  const { data: { session } } = await supabase.auth.getSession();

  if (!session?.user) {
    throw redirect(303, '/auth');
  }

  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();

  // Get summit stats
  const summitStats = await getUserSummitStats(supabase, session.user.id);

  // Get all peaks for the grid visualization
  const { data: allPeaks } = await supabase
    .from('peaks')
    .select('id, name, slug, rank, range, elevation')
    .order('rank', { ascending: true });

  // Get all user's unique summited peak IDs
  const { data: userSummits } = await supabase
    .from('user_summits')
    .select('peak_id, date_summited')
    .eq('user_id', session.user.id);

  // Create a map of summited peaks with their most recent date
  const summitedPeaksMap = new Map<string, string>();
  userSummits?.forEach(s => {
    const existing = summitedPeaksMap.get(s.peak_id);
    if (!existing || s.date_summited > existing) {
      summitedPeaksMap.set(s.peak_id, s.date_summited);
    }
  });

  // Calculate stats by range and class
  const rangeStats: Record<string, { total: number; summited: number }> = {};
  const classStats: Record<number, { total: number; summited: number }> = {
    1: { total: 0, summited: 0 },
    2: { total: 0, summited: 0 },
    3: { total: 0, summited: 0 },
    4: { total: 0, summited: 0 }
  };

  // Get routes for class info
  const { data: routes } = await supabase
    .from('routes')
    .select('peak_id, difficulty_class')
    .eq('is_standard', true);

  const peakClassMap = new Map<string, number>();
  routes?.forEach(r => {
    peakClassMap.set(r.peak_id, r.difficulty_class);
  });

  // Get user achievements from database
  const userAchievements = await getUserAchievements(supabase, session.user.id);

  // Mark achievements as notified (user is viewing their profile)
  await markAchievementsNotified(supabase, session.user.id);

  allPeaks?.forEach(peak => {
    // Range stats
    if (!rangeStats[peak.range]) {
      rangeStats[peak.range] = { total: 0, summited: 0 };
    }
    rangeStats[peak.range].total++;
    if (summitedPeaksMap.has(peak.id)) {
      rangeStats[peak.range].summited++;
    }

    // Class stats
    const diffClass = peakClassMap.get(peak.id) || 1;
    classStats[diffClass].total++;
    if (summitedPeaksMap.has(peak.id)) {
      classStats[diffClass].summited++;
    }
  });

  return {
    profile,
    summitStats,
    allPeaks: allPeaks ?? [],
    summitedPeaksMap: Object.fromEntries(summitedPeaksMap),
    rangeStats,
    classStats,
    peakClassMap: Object.fromEntries(peakClassMap),
    userAchievements
  };
};

export const actions: Actions = {
  updatePrivacy: async ({ cookies, request }) => {
    const supabase = createSupabaseServerClient(cookies);
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      throw redirect(303, '/auth');
    }

    const formData = await request.formData();
    const isPublic = formData.get('is_public') === 'true';

    const { error } = await supabase
      .from('profiles')
      .update({ is_public: isPublic })
      .eq('id', session.user.id);

    if (error) {
      return fail(500, { message: 'Failed to update privacy setting' });
    }

    return { success: true };
  }
};
