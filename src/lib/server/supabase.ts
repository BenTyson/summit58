import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import type { Cookies } from '@sveltejs/kit';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { env } from '$env/dynamic/private';

export function createSupabaseServerClient(cookies: Cookies) {
  return createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => {
        return cookies.getAll();
      },
      setAll: (
        cookiesToSet: Array<{
          name: string;
          value: string;
          options: Record<string, unknown>;
        }>
      ) => {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookies.set(name, value, { ...options, path: '/' });
        });
      }
    }
  });
}

/**
 * Creates a Supabase client with service role key.
 * Bypasses RLS - use only for server-side operations like webhooks.
 */
export function createSupabaseServiceClient() {
  const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set');
  }
  return createClient(PUBLIC_SUPABASE_URL, serviceRoleKey);
}

/**
 * Creates a Supabase client from a Bearer token (mobile API auth).
 * RLS applies to the token's user. Returns null supabase if no/invalid header.
 */
export function createSupabaseApiClient(request: Request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return { supabase: null, error: 'Missing or invalid Authorization header' as const };
  }

  const token = authHeader.slice(7);
  const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
    global: {
      headers: { Authorization: `Bearer ${token}` }
    }
  });

  return { supabase, error: null };
}

/**
 * Validates a Bearer token and returns the authenticated user.
 * For auth-required API endpoints.
 */
export async function requireAuth(request: Request) {
  const { supabase, error } = createSupabaseApiClient(request);
  if (!supabase || error) {
    return { supabase: null, user: null, error: error || 'Unauthorized' };
  }

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return { supabase: null, user: null, error: 'Invalid or expired token' };
  }

  return { supabase, user, error: null };
}
