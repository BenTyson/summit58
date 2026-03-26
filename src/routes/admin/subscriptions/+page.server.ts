import type { PageServerLoad } from './$types';
import { createSupabaseServerClient } from '$lib/server/supabase';
import { getSubscriptionMetrics } from '$lib/server/admin';

export const load: PageServerLoad = async ({ cookies }) => {
  const supabase = createSupabaseServerClient(cookies);
  const metrics = await getSubscriptionMetrics(supabase);

  return { metrics };
};
