import { supabase } from '@/lib/supabase';
import { clearCacheTier } from './database';
import { getPendingCount } from './syncEngine';

/**
 * Refresh auth session before processing outbox after extended offline.
 * Returns true if session is valid, false if re-auth is needed.
 */
export async function refreshAuthForSync(): Promise<boolean> {
  try {
    const { data, error } = await supabase.auth.refreshSession();
    if (error || !data.session) return false;
    return true;
  } catch {
    return false;
  }
}

/**
 * Clear user-specific cached data on sign-out.
 * Returns pending count so caller can warn the user.
 */
export async function clearUserDataOnSignOut(): Promise<number> {
  const pending = await getPendingCount();
  // Clear Tier 2 (user data) cache
  await clearCacheTier(2);
  return pending;
}
