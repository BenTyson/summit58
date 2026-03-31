import { cachedApiFetch } from './cache';
import { getKV, setKV } from './database';
import { prefetchPeakImages } from './images';
import { CACHE_TIERS } from './types';
import type { PeakWithStandardRoute } from '@saltgoat/shared/types/helpers';
import type { PeakDetailResponse } from '@/lib/types/api';

const PREFETCH_KEY = 'prefetch_complete_at';
const PREFETCH_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const BATCH_SIZE = 2;
const BATCH_DELAY_MS = 200;

/**
 * Background prefetch of all peak detail pages and hero images.
 * Runs only if the last prefetch is >7 days old (or never ran).
 * Throttled: 2 concurrent requests, 200ms between batches.
 */
export async function runPrefetchIfNeeded(peaks: PeakWithStandardRoute[]): Promise<void> {
  const lastPrefetch = await getKV(PREFETCH_KEY);
  if (lastPrefetch) {
    const age = Date.now() - parseInt(lastPrefetch, 10);
    if (age < PREFETCH_MAX_AGE_MS) return;
  }

  try {
    await prefetchAllPeakDetails(peaks);
    await prefetchPeakImages(peaks);
    await setKV(PREFETCH_KEY, String(Date.now()));
  } catch {
    // Partial prefetch is fine — will retry next time
  }
}

async function prefetchAllPeakDetails(peaks: PeakWithStandardRoute[]): Promise<void> {
  for (let i = 0; i < peaks.length; i += BATCH_SIZE) {
    const batch = peaks.slice(i, i + BATCH_SIZE);
    await Promise.all(
      batch.map((peak) =>
        cachedApiFetch<PeakDetailResponse>(
          `/api/v1/peaks/${peak.slug}`,
          {
            cache: CACHE_TIERS.STATIC,
            fetchOptions: { auth: false },
          },
          true // isOnline — we only prefetch when online
        ).catch(() => {
          // Individual peak failures are non-fatal
        })
      )
    );

    if (i + BATCH_SIZE < peaks.length) {
      await delay(BATCH_DELAY_MS);
    }
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
