import type { PageServerLoad } from './$types';
import { createSupabaseServerClient } from '$lib/server/supabase';
import { getPeakBySlug } from '$lib/server/peaks';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, cookies }) => {
  const supabase = createSupabaseServerClient(cookies);

  const peak = await getPeakBySlug(supabase, params.slug);

  if (!peak) {
    throw error(404, {
      message: 'Peak not found'
    });
  }

  return { peak };
};
