import type { PageServerLoad } from './$types';
import { createSupabaseServerClient } from '$lib/server/supabase';
import { getRouteBySlug } from '$lib/server/peaks';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, cookies }) => {
  const supabase = createSupabaseServerClient(cookies);

  const result = await getRouteBySlug(supabase, params.slug, params.route);

  if (!result) {
    throw error(404, {
      message: 'Route not found'
    });
  }

  // Fetch recent parking reports for this peak
  const { data: recentParkingReports } = await supabase
    .from('trail_reports')
    .select('parking_status, arrival_time, hike_date')
    .eq('peak_id', result.peak.id)
    .not('parking_status', 'is', null)
    .order('hike_date', { ascending: false })
    .limit(5);

  return {
    ...result,
    recentParkingReports: recentParkingReports || []
  };
};
