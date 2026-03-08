import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '$lib/types/database';

export interface WatchlistItem {
  id: string;
  peak_id: string;
  created_at: string;
  peak: {
    id: string;
    name: string;
    slug: string;
    elevation: number;
    range: string;
  };
  conditions: {
    weather_code: number | null;
    high_f: number | null;
    low_f: number | null;
  } | null;
}

export async function getUserWatchlist(
  supabase: SupabaseClient<Database>,
  userId: string
): Promise<WatchlistItem[]> {
  const { data, error } = await supabase
    .from('peak_watchlist')
    .select(`
      id, peak_id, created_at,
      peak:peaks(id, name, slug, elevation, range)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  // Fetch latest conditions for each watched peak
  const peakIds = (data ?? []).map(d => d.peak_id);
  let conditionsMap = new Map<string, { weather_code: number | null; high_f: number | null; low_f: number | null }>();

  if (peakIds.length > 0) {
    const { data: condData } = await supabase
      .from('peak_conditions')
      .select('peak_id, weather_code, high_f, low_f')
      .in('peak_id', peakIds)
      .order('date', { ascending: false });

    // Keep only the latest condition per peak
    condData?.forEach(c => {
      if (!conditionsMap.has(c.peak_id)) {
        conditionsMap.set(c.peak_id, {
          weather_code: c.weather_code,
          high_f: c.high_f,
          low_f: c.low_f
        });
      }
    });
  }

  return (data ?? []).map(item => ({
    ...item,
    peak: item.peak as unknown as WatchlistItem['peak'],
    conditions: conditionsMap.get(item.peak_id) ?? null
  }));
}

export async function isOnWatchlist(
  supabase: SupabaseClient<Database>,
  userId: string,
  peakId: string
): Promise<boolean> {
  const { count, error } = await supabase
    .from('peak_watchlist')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('peak_id', peakId);

  if (error) throw error;
  return (count ?? 0) > 0;
}

export async function addToWatchlist(
  supabase: SupabaseClient<Database>,
  userId: string,
  peakId: string
): Promise<void> {
  const { error } = await supabase
    .from('peak_watchlist')
    .insert({ user_id: userId, peak_id: peakId });

  if (error) throw error;
}

export async function removeFromWatchlist(
  supabase: SupabaseClient<Database>,
  userId: string,
  peakId: string
): Promise<void> {
  const { error } = await supabase
    .from('peak_watchlist')
    .delete()
    .eq('user_id', userId)
    .eq('peak_id', peakId);

  if (error) throw error;
}
