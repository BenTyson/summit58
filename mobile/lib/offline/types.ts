export interface CacheEntry {
  cache_key: string;
  data: string;
  cached_at: number;
  ttl_ms: number;
  tier: number;
}

export interface CacheConfig {
  /** Time-to-live in ms. 0 = never expires. */
  ttl: number;
  /** Storage tier (1=static, 2=user, 3=on-demand) */
  tier: number;
}

export const CACHE_TIERS: Record<string, CacheConfig> = {
  STATIC: { ttl: 0, tier: 1 },
  USER_DATA: { ttl: 0, tier: 2 },
  WEATHER: { ttl: 6 * 60 * 60 * 1000, tier: 3 },
  REVIEWS: { ttl: 12 * 60 * 60 * 1000, tier: 3 },
  TRAIL_REPORTS: { ttl: 4 * 60 * 60 * 1000, tier: 3 },
};

export type OutboxAction =
  | 'create_summit'
  | 'update_summit'
  | 'delete_summit'
  | 'create_review'
  | 'create_trail_report'
  | 'create_photo';

export type OutboxStatus = 'pending' | 'syncing' | 'failed';

export interface OutboxEntry {
  id: string;
  action: OutboxAction;
  endpoint: string;
  method: 'POST' | 'PATCH' | 'DELETE';
  payload: string;
  created_at: number;
  priority: number;
  status: OutboxStatus;
  retry_count: number;
  last_error: string | null;
  local_id: string | null;
}
