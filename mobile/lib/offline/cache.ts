import { getCacheEntry, setCacheEntry, isCacheExpired } from './database';
import { apiFetch, ApiError, type ApiFetchOptions } from '@/lib/api';
import type { CacheConfig } from './types';

export interface CachedApiFetchOptions {
  /** Cache configuration. If omitted, no caching. */
  cache?: CacheConfig;
  /** Custom cache key. Defaults to the request path. */
  cacheKey?: string;
  /** apiFetch options (auth, method, body, formData) */
  fetchOptions?: ApiFetchOptions;
  /**
   * Called with fresh data when a background refresh completes.
   * Only fires in stale-while-revalidate mode (cache hit + online).
   */
  onRefresh?: <T>(data: T) => void;
}

/**
 * Cache-first wrapper around apiFetch.
 *
 * 1. Read from SQLite by cache key
 * 2. If found and valid (or offline): return cached data immediately
 * 3. If online: fetch from API
 * 4. On success: update cache, call onRefresh if provided
 * 5. On failure + stale cache: return stale cache
 * 6. On failure + no cache: throw
 */
export async function cachedApiFetch<T>(
  path: string,
  options?: CachedApiFetchOptions,
  isOnline: boolean = true
): Promise<{ data: T; fromCache: boolean; cachedAt: number | null }> {
  const cacheConfig = options?.cache;

  // No caching configured — pass through to apiFetch
  if (!cacheConfig) {
    const data = await apiFetch<T>(path, options?.fetchOptions);
    return { data, fromCache: false, cachedAt: null };
  }

  const key = options?.cacheKey ?? path;

  // Try reading from cache
  const cached = await getCacheEntry(key);
  const expired = cached ? isCacheExpired(cached) : true;

  // If offline, return whatever we have (even stale)
  if (!isOnline) {
    if (cached) {
      return {
        data: JSON.parse(cached.data) as T,
        fromCache: true,
        cachedAt: cached.cached_at,
      };
    }
    throw new ApiError(0, 'No cached data available offline');
  }

  // If cache is fresh, return it and refresh in background
  if (cached && !expired) {
    refreshInBackground<T>(path, key, cacheConfig, options);
    return {
      data: JSON.parse(cached.data) as T,
      fromCache: true,
      cachedAt: cached.cached_at,
    };
  }

  // Cache is stale or missing — try fetching
  try {
    const data = await apiFetch<T>(path, options?.fetchOptions);
    await setCacheEntry(key, JSON.stringify(data), cacheConfig.ttl, cacheConfig.tier);
    return { data, fromCache: false, cachedAt: Date.now() };
  } catch (e) {
    // Network failed but we have stale cache — return it
    if (cached) {
      return {
        data: JSON.parse(cached.data) as T,
        fromCache: true,
        cachedAt: cached.cached_at,
      };
    }
    throw e;
  }
}

async function refreshInBackground<T>(
  path: string,
  key: string,
  cacheConfig: CacheConfig,
  options?: CachedApiFetchOptions
): Promise<void> {
  try {
    const data = await apiFetch<T>(path, options?.fetchOptions);
    await setCacheEntry(key, JSON.stringify(data), cacheConfig.ttl, cacheConfig.tier);
    options?.onRefresh?.(data);
  } catch {
    // Background refresh failed — no-op, cached data is still valid
  }
}

export { deleteCacheEntry as invalidateCache } from './database';
