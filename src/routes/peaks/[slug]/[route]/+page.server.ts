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

  return result;
};
