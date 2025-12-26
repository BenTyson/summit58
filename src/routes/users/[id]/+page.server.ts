import type { PageServerLoad } from './$types';
import { createSupabaseServerClient } from '$lib/server/supabase';
import { getUserAchievements } from '$lib/server/achievements';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, cookies }) => {
  const supabase = createSupabaseServerClient(cookies);
  const userId = params.id;

  // Get the profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (profileError || !profile) {
    throw error(404, { message: 'User not found' });
  }

  // Check if profile is public (RLS should handle this, but double-check)
  // If user is viewing their own profile, they can always see it
  const { data: { session } } = await supabase.auth.getSession();
  const isOwnProfile = session?.user?.id === userId;

  if (!profile.is_public && !isOwnProfile) {
    throw error(404, { message: 'This profile is private' });
  }

  // Get user's summit data
  const { data: summits } = await supabase
    .from('user_summits')
    .select(`
      id,
      peak_id,
      date_summited,
      peak:peaks(id, name, slug, elevation, range, thumbnail_url),
      route:routes(name, difficulty_class)
    `)
    .eq('user_id', userId)
    .order('date_summited', { ascending: false });

  // Calculate stats
  const uniquePeakIds = new Set(summits?.map(s => s.peak_id) || []);
  const totalSummits = summits?.length || 0;
  const uniquePeaks = uniquePeakIds.size;
  const progress = (uniquePeaks / 58) * 100;

  // Get recent summits (last 5)
  const recentSummits = summits?.slice(0, 5) || [];

  // Get achievements
  const achievements = await getUserAchievements(supabase, userId);

  // Calculate total elevation (from unique peaks)
  let totalElevation = 0;
  const seenPeaks = new Set<string>();
  summits?.forEach(s => {
    if (!seenPeaks.has(s.peak_id) && s.peak) {
      seenPeaks.add(s.peak_id);
      totalElevation += (s.peak as { elevation: number }).elevation;
    }
  });

  // Get range stats
  const rangeStats: Record<string, number> = {};
  summits?.forEach(s => {
    if (s.peak && !seenPeaks.has(s.peak_id + '_range')) {
      seenPeaks.add(s.peak_id + '_range');
      const range = (s.peak as { range: string }).range;
      rangeStats[range] = (rangeStats[range] || 0) + 1;
    }
  });

  // Reset for proper counting
  const uniquePeakRanges: Record<string, number> = {};
  const countedPeaks = new Set<string>();
  summits?.forEach(s => {
    if (s.peak && !countedPeaks.has(s.peak_id)) {
      countedPeaks.add(s.peak_id);
      const range = (s.peak as { range: string }).range;
      uniquePeakRanges[range] = (uniquePeakRanges[range] || 0) + 1;
    }
  });

  return {
    profile,
    isOwnProfile,
    stats: {
      totalSummits,
      uniquePeaks,
      progress,
      totalElevation
    },
    recentSummits,
    achievements,
    rangeStats: uniquePeakRanges
  };
};
