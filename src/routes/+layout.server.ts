import type { LayoutServerLoad } from './$types';
import { createSupabaseServerClient } from '$lib/server/supabase';

export const load: LayoutServerLoad = async ({ cookies }) => {
  const supabase = createSupabaseServerClient(cookies);

  const { data: { session } } = await supabase.auth.getSession();

  // Get user profile if logged in
  let profile = null;
  if (session?.user) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();
    profile = data;
  }

  // Get all peaks for search (lightweight query)
  const { data: peaks } = await supabase
    .from('peaks')
    .select('id, name, slug, elevation, rank, range')
    .order('rank');

  return {
    session,
    profile,
    peaks: peaks ?? []
  };
};
