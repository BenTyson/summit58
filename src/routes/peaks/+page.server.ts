import type { PageServerLoad } from './$types';
import { createSupabaseServerClient } from '$lib/server/supabase';
import { getAllPeaks } from '$lib/server/peaks';

export const load: PageServerLoad = async ({ cookies }) => {
  const supabase = createSupabaseServerClient(cookies);

  try {
    const peaks = await getAllPeaks(supabase);
    return { peaks };
  } catch (error) {
    console.error('Error loading peaks:', error);
    return { peaks: [] };
  }
};
