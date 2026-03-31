import { getDatabase } from './database';
import { apiFetch, ApiError } from '@/lib/api';
import { deleteCacheEntry } from './database';
import { uploadImageWithProgress } from '@/lib/imageUpload';
import { deleteQueuedPhoto, type QueuedPhotoPayload } from './photoQueue';
import type { OutboxEntry, OutboxStatus } from './types';

const MAX_RETRIES = 3;

export async function enqueueOutboxEntry(entry: Omit<OutboxEntry, 'status' | 'retry_count' | 'last_error'>): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    `INSERT INTO sync_outbox (id, action, endpoint, method, payload, created_at, priority, status, retry_count, last_error, local_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', 0, NULL, ?)`,
    entry.id,
    entry.action,
    entry.endpoint,
    entry.method,
    entry.payload,
    entry.created_at,
    entry.priority,
    entry.local_id ?? null
  );
}

export async function getPendingCount(): Promise<number> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<{ count: number }>(
    "SELECT COUNT(*) as count FROM sync_outbox WHERE status IN ('pending', 'failed')"
  );
  return row?.count ?? 0;
}

export async function getPendingEntries(): Promise<OutboxEntry[]> {
  const db = await getDatabase();
  return db.getAllAsync<OutboxEntry>(
    "SELECT * FROM sync_outbox WHERE status = 'pending' ORDER BY priority ASC, created_at ASC"
  );
}

export async function getFailedEntries(): Promise<OutboxEntry[]> {
  const db = await getDatabase();
  return db.getAllAsync<OutboxEntry>(
    "SELECT * FROM sync_outbox WHERE status = 'failed' ORDER BY priority ASC, created_at ASC"
  );
}

async function updateOutboxStatus(id: string, status: OutboxStatus, lastError?: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    'UPDATE sync_outbox SET status = ?, last_error = ?, retry_count = retry_count + CASE WHEN ? = \'failed\' THEN 1 ELSE 0 END WHERE id = ?',
    status,
    lastError ?? null,
    status,
    id
  );
}

async function deleteOutboxEntry(id: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM sync_outbox WHERE id = ?', id);
}

export interface SyncResult {
  synced: number;
  failed: number;
  results: Array<{
    entryId: string;
    action: string;
    success: boolean;
    response?: unknown;
    error?: string;
  }>;
}

/**
 * Process all pending outbox entries sequentially.
 * Returns results for each entry (for triggering UI like achievement celebrations).
 */
export async function processOutbox(): Promise<SyncResult> {
  const entries = await getPendingEntries();
  const result: SyncResult = { synced: 0, failed: 0, results: [] };

  for (const entry of entries) {
    await updateOutboxStatus(entry.id, 'syncing');

    try {
      const payload = JSON.parse(entry.payload);
      let response: unknown;

      if (entry.action === 'create_photo') {
        // Photo uploads use XHR with FormData
        const photoPayload = payload as QueuedPhotoPayload;
        response = await uploadImageWithProgress({
          slug: photoPayload.slug,
          imageUri: photoPayload.localFileUri,
          caption: photoPayload.caption,
          category: photoPayload.category,
          isPrivate: photoPayload.isPrivate,
        });
        deleteQueuedPhoto(photoPayload.localFileUri);
      } else {
        response = await apiFetch<unknown>(entry.endpoint, {
          method: entry.method as 'POST' | 'PATCH' | 'DELETE',
          body: payload,
        });
      }

      await deleteOutboxEntry(entry.id);
      await invalidateCachesForAction(entry.action, payload);

      result.synced++;
      result.results.push({
        entryId: entry.id,
        action: entry.action,
        success: true,
        response,
      });
    } catch (e) {
      const isClientError = e instanceof ApiError && e.status >= 400 && e.status < 500;
      const errorMsg = e instanceof Error ? e.message : 'Unknown error';

      if (isClientError || entry.retry_count >= MAX_RETRIES - 1) {
        await updateOutboxStatus(entry.id, 'failed', errorMsg);
      } else {
        await updateOutboxStatus(entry.id, 'pending', errorMsg);
      }

      result.failed++;
      result.results.push({
        entryId: entry.id,
        action: entry.action,
        success: false,
        error: errorMsg,
      });
    }
  }

  return result;
}

async function invalidateCachesForAction(_action: string, _payload: Record<string, unknown>): Promise<void> {
  try {
    // Invalidate peaks list (summit counts, summitedPeakIds)
    await deleteCacheEntry('/api/v1/peaks');

    // Invalidate profile (summit stats change)
    await deleteCacheEntry('/api/v1/profile');
  } catch {
    // Cache invalidation failure is non-critical
  }
}
