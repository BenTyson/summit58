import { Image } from 'expo-image';
import type { PeakWithStandardRoute } from '@saltgoat/shared/types/helpers';

/**
 * Prefetch hero and thumbnail images for all peaks into expo-image's disk cache.
 * Runs in batches to avoid flooding the network.
 */
export async function prefetchPeakImages(peaks: PeakWithStandardRoute[]): Promise<void> {
  const urls: string[] = [];
  for (const peak of peaks) {
    if (peak.hero_image_url) urls.push(peak.hero_image_url);
    if (peak.thumbnail_url) urls.push(peak.thumbnail_url);
  }

  if (urls.length === 0) return;

  // expo-image handles batching internally
  await Image.prefetch(urls);
}
