import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createSupabaseServerClient } from '$lib/server/supabase';

export const GET: RequestHandler = async ({ url, cookies }) => {
  const code = url.searchParams.get('code');
  const type = url.searchParams.get('type');

  if (code) {
    const supabase = createSupabaseServerClient(cookies);
    await supabase.auth.exchangeCodeForSession(code);
  }

  if (type === 'recovery') {
    throw redirect(303, '/auth/reset-password');
  }

  const redirectTo = url.searchParams.get('redirectTo');
  const destination = redirectTo && redirectTo.startsWith('/') && !redirectTo.startsWith('//') ? redirectTo : '/';

  throw redirect(303, destination);
};
