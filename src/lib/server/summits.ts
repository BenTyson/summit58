import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database, Tables, TablesInsert } from '$lib/types/database';

export type UserSummit = Tables<'user_summits'>;
export type UserSummitInsert = TablesInsert<'user_summits'>;

export type UserSummitWithPeak = UserSummit & {
  peak: {
    id: string;
    name: string;
    slug: string;
    elevation: number;
    range: string;
    thumbnail_url: string | null;
  };
  route: {
    id: string;
    name: string;
    difficulty_class: number;
  } | null;
};

// Get all summits for a user
export async function getUserSummits(
  supabase: SupabaseClient<Database>,
  userId: string
): Promise<UserSummitWithPeak[]> {
  const { data, error } = await supabase
    .from('user_summits')
    .select(`
      *,
      peak:peaks(id, name, slug, elevation, range, thumbnail_url),
      route:routes(id, name, difficulty_class)
    `)
    .eq('user_id', userId)
    .order('date_summited', { ascending: false });

  if (error) throw error;
  return data as UserSummitWithPeak[];
}

// Get summits for a specific peak by a user
export async function getUserSummitsForPeak(
  supabase: SupabaseClient<Database>,
  userId: string,
  peakId: string
): Promise<UserSummit[]> {
  const { data, error } = await supabase
    .from('user_summits')
    .select('*')
    .eq('user_id', userId)
    .eq('peak_id', peakId)
    .order('date_summited', { ascending: false });

  if (error) throw error;
  return data;
}

// Get the most recent summit for a peak (if any)
export async function getLatestSummitForPeak(
  supabase: SupabaseClient<Database>,
  userId: string,
  peakId: string
): Promise<UserSummit | null> {
  const { data, error } = await supabase
    .from('user_summits')
    .select('*')
    .eq('user_id', userId)
    .eq('peak_id', peakId)
    .order('date_summited', { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
  return data;
}

// Get summit count for a user
export async function getUserSummitCount(
  supabase: SupabaseClient<Database>,
  userId: string
): Promise<number> {
  const { count, error } = await supabase
    .from('user_summits')
    .select('peak_id', { count: 'exact', head: true })
    .eq('user_id', userId);

  if (error) throw error;
  return count ?? 0;
}

// Get unique peaks summited by user
export async function getUniquePeaksSummited(
  supabase: SupabaseClient<Database>,
  userId: string
): Promise<string[]> {
  const { data, error } = await supabase
    .from('user_summits')
    .select('peak_id')
    .eq('user_id', userId);

  if (error) throw error;

  // Return unique peak IDs
  return [...new Set(data.map(s => s.peak_id))];
}

// Create a new summit
export async function createSummit(
  supabase: SupabaseClient<Database>,
  summit: UserSummitInsert
): Promise<UserSummit> {
  const { data, error } = await supabase
    .from('user_summits')
    .insert(summit)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Update a summit
export async function updateSummit(
  supabase: SupabaseClient<Database>,
  summitId: string,
  updates: Partial<UserSummitInsert>
): Promise<UserSummit> {
  const { data, error } = await supabase
    .from('user_summits')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', summitId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Delete a summit
export async function deleteSummit(
  supabase: SupabaseClient<Database>,
  summitId: string
): Promise<void> {
  const { error } = await supabase
    .from('user_summits')
    .delete()
    .eq('id', summitId);

  if (error) throw error;
}

// Extended summit type with route stats
export type UserSummitWithStats = UserSummit & {
  peak: {
    id: string;
    name: string;
    slug: string;
    elevation: number;
    range: string;
    thumbnail_url: string | null;
  };
  route: {
    id: string;
    name: string;
    difficulty_class: number;
    distance_miles: number;
    elevation_gain_ft: number;
  } | null;
};

// Get all summits for a user with full route stats
export async function getUserSummitsWithStats(
  supabase: SupabaseClient<Database>,
  userId: string
): Promise<UserSummitWithStats[]> {
  const { data, error } = await supabase
    .from('user_summits')
    .select(`
      *,
      peak:peaks(id, name, slug, elevation, range, thumbnail_url),
      route:routes(id, name, difficulty_class, distance_miles, elevation_gain_ft)
    `)
    .eq('user_id', userId)
    .order('date_summited', { ascending: false });

  if (error) throw error;
  return data as UserSummitWithStats[];
}

// Get summit stats for a user (for profile dashboard)
export async function getUserSummitStats(
  supabase: SupabaseClient<Database>,
  userId: string
): Promise<{
  totalSummits: number;
  uniquePeaks: number;
  progress: number;
  recentSummits: UserSummitWithPeak[];
  totalElevationGain: number;
  totalDistanceMiles: number;
  highestPeak: { name: string; elevation: number } | null;
  avgElevation: number;
}> {
  // Get all summits with peak and route data
  const summits = await getUserSummitsWithStats(supabase, userId);

  // Calculate unique peaks
  const uniquePeakIds = new Set(summits.map(s => s.peak_id));

  // Get 5 most recent
  const recentSummits = summits.slice(0, 5);

  // Calculate elevation and distance totals
  let totalElevationGain = 0;
  let totalDistanceMiles = 0;

  summits.forEach(s => {
    if (s.route) {
      totalElevationGain += s.route.elevation_gain_ft || 0;
      totalDistanceMiles += s.route.distance_miles || 0;
    }
  });

  // Find highest peak summited
  let highestPeak: { name: string; elevation: number } | null = null;
  const uniquePeaks = new Map<string, { name: string; elevation: number }>();

  summits.forEach(s => {
    if (!uniquePeaks.has(s.peak_id)) {
      uniquePeaks.set(s.peak_id, { name: s.peak.name, elevation: s.peak.elevation });
    }
  });

  if (uniquePeaks.size > 0) {
    highestPeak = [...uniquePeaks.values()].reduce((max, p) =>
      p.elevation > max.elevation ? p : max
    );
  }

  // Calculate average elevation of unique summited peaks
  const avgElevation = uniquePeaks.size > 0
    ? [...uniquePeaks.values()].reduce((sum, p) => sum + p.elevation, 0) / uniquePeaks.size
    : 0;

  return {
    totalSummits: summits.length,
    uniquePeaks: uniquePeakIds.size,
    progress: (uniquePeakIds.size / 58) * 100, // 58 total 14ers
    recentSummits,
    totalElevationGain,
    totalDistanceMiles,
    highestPeak,
    avgElevation
  };
}
