import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '$lib/types/database';

const FREE_SUMMIT_LIMIT = 5;

export interface Subscription {
  id: string;
  user_id: string;
  plan: 'free' | 'pro';
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  current_period_end: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export async function getSubscription(
  supabase: SupabaseClient<Database>,
  userId: string
): Promise<Subscription | null> {
  const { data, error } = await supabase
    .from('user_subscriptions')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data as Subscription | null;
}

export function isPro(subscription: Subscription | null): boolean {
  return subscription?.plan === 'pro' && subscription?.status === 'active';
}

export async function canLogSummit(
  supabase: SupabaseClient<Database>,
  userId: string
): Promise<{ allowed: boolean; remaining: number; isPro: boolean }> {
  const subscription = await getSubscription(supabase, userId);
  const userIsPro = isPro(subscription);

  if (userIsPro) {
    return { allowed: true, remaining: Infinity, isPro: true };
  }

  // Count user's total summits
  const { count, error } = await supabase
    .from('user_summits')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId);

  if (error) throw error;

  const summitCount = count ?? 0;
  const remaining = Math.max(0, FREE_SUMMIT_LIMIT - summitCount);

  return {
    allowed: summitCount < FREE_SUMMIT_LIMIT,
    remaining,
    isPro: false
  };
}
