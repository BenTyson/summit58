import { Paths, File, Directory } from 'expo-file-system';
import { enqueueOutboxEntry } from './syncEngine';

const QUEUE_DIR_NAME = 'photo-queue';

function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function getQueueDir(): Directory {
  return new Directory(Paths.document, QUEUE_DIR_NAME);
}

function ensureQueueDir(): void {
  const dir = getQueueDir();
  if (!dir.exists) {
    dir.create({ intermediates: true });
  }
}

export interface QueuedPhotoPayload {
  slug: string;
  localFileUri: string;
  caption?: string;
  category?: string;
  isPrivate?: boolean;
}

/**
 * Save an optimized photo to the local queue directory and enqueue for sync.
 * The photo is already optimized (resized/compressed) by the caller.
 */
export async function enqueuePhoto(params: {
  slug: string;
  optimizedUri: string;
  caption?: string;
  category?: string;
  isPrivate?: boolean;
}): Promise<string> {
  ensureQueueDir();

  const localId = generateId();
  const fileName = `${localId}.jpg`;
  const dest = new File(getQueueDir(), fileName);

  // Copy optimized image to queue directory
  const source = new File(params.optimizedUri);
  source.copy(dest);

  const payload: QueuedPhotoPayload = {
    slug: params.slug,
    localFileUri: dest.uri,
    caption: params.caption,
    category: params.category,
    isPrivate: params.isPrivate,
  };

  await enqueueOutboxEntry({
    id: generateId(),
    action: 'create_photo',
    endpoint: `/api/v1/peaks/${params.slug}/images`,
    method: 'POST',
    payload: JSON.stringify(payload),
    created_at: Date.now(),
    priority: 4,
    local_id: localId,
  });

  return localId;
}

/**
 * Delete a queued photo file after successful upload.
 */
export function deleteQueuedPhoto(localFileUri: string): void {
  try {
    const file = new File(localFileUri);
    if (file.exists) {
      file.delete();
    }
  } catch {
    // Non-critical — orphaned file will be cleaned up later
  }
}

/**
 * Get total size of queued photos in bytes.
 */
export function getQueuedPhotosSize(): { count: number; bytes: number } {
  try {
    const dir = getQueueDir();
    if (!dir.exists) return { count: 0, bytes: 0 };

    const entries = dir.list();
    let totalBytes = 0;
    let count = 0;
    for (const entry of entries) {
      if (entry instanceof File) {
        totalBytes += entry.size;
        count++;
      }
    }
    return { count, bytes: totalBytes };
  } catch {
    return { count: 0, bytes: 0 };
  }
}
