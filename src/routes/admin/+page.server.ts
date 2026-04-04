import type { PageServerLoad } from './$types';
import { createSupabaseServerClient } from '$lib/server/supabase';
import { getAdminOverviewStats } from '$lib/server/admin';
import { getForumStats } from '$lib/server/forumAdmin';

export const load: PageServerLoad = async ({ cookies }) => {
  const supabase = createSupabaseServerClient(cookies);
  const [stats, forumStats] = await Promise.all([
    getAdminOverviewStats(supabase),
    getForumStats(supabase)
  ]);

  return { stats, forumStats };
};
