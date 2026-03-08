import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createSupabaseServerClient } from '$lib/server/supabase';
import { createCheckoutSession } from '$lib/server/stripe';

export const POST: RequestHandler = async ({ cookies }) => {
  const supabase = createSupabaseServerClient(cookies);
  const { data: { session } } = await supabase.auth.getSession();

  if (!session?.user) {
    throw redirect(303, '/auth');
  }

  const { url } = await createCheckoutSession(session.user.id, session.user.email ?? '');
  throw redirect(303, url);
};
