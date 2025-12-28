import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database, Tables, TablesInsert } from '$lib/types/database';
import { optimizeImage } from './imageOptimizer';

export type PeakImage = Tables<'peak_images'>;
export type PeakImageInsert = TablesInsert<'peak_images'>;

const ADMIN_USER_ID = 'c983d602-d0e0-4da6-be9d-f91a456bfdb0';
const STORAGE_BUCKET = 'peak-images';

// Check if user is admin
export function isAdmin(userId: string | undefined): boolean {
  return userId === ADMIN_USER_ID;
}

// Get all images for a peak
export async function getImagesForPeak(
  supabase: SupabaseClient<Database>,
  peakId: string
): Promise<PeakImage[]> {
  const { data, error } = await supabase
    .from('peak_images')
    .select('*')
    .eq('peak_id', peakId)
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching peak images:', error);
    return [];
  }
  return data ?? [];
}

// Get public URL for an image
export function getImageUrl(
  supabase: SupabaseClient<Database>,
  storagePath: string
): string {
  const { data } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(storagePath);
  return data.publicUrl;
}

// Upload an image for a peak
export async function uploadPeakImage(
  supabase: SupabaseClient<Database>,
  peakId: string,
  userId: string,
  file: File,
  caption?: string
): Promise<PeakImage> {
  // Convert file to buffer and optimize
  const arrayBuffer = await file.arrayBuffer();
  const optimizedBuffer = await optimizeImage(arrayBuffer, {
    maxWidth: 1600,
    maxHeight: 1200,
    quality: 80
  });

  // Generate unique filename (always .jpg after optimization)
  const filename = `${peakId}/${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`;

  // Upload optimized image to storage
  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(filename, optimizedBuffer, {
      cacheControl: '31536000', // 1 year cache for optimized images
      contentType: 'image/jpeg',
      upsert: false
    });

  if (uploadError) throw uploadError;

  // Get current max display_order
  const { data: existing } = await supabase
    .from('peak_images')
    .select('display_order')
    .eq('peak_id', peakId)
    .order('display_order', { ascending: false })
    .limit(1);

  const nextOrder = (existing?.[0]?.display_order ?? -1) + 1;

  // Insert record
  const { data, error } = await supabase
    .from('peak_images')
    .insert({
      peak_id: peakId,
      uploaded_by: userId,
      storage_path: filename,
      caption: caption || null,
      display_order: nextOrder
    })
    .select()
    .single();

  if (error) {
    // Clean up uploaded file on insert failure
    await supabase.storage.from(STORAGE_BUCKET).remove([filename]);
    throw error;
  }

  return data;
}

// Delete an image
export async function deletePeakImage(
  supabase: SupabaseClient<Database>,
  imageId: string
): Promise<void> {
  // Get the image record first
  const { data: image, error: fetchError } = await supabase
    .from('peak_images')
    .select('storage_path')
    .eq('id', imageId)
    .single();

  if (fetchError) throw fetchError;

  // Delete from storage
  const { error: storageError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .remove([image.storage_path]);

  if (storageError) {
    console.error('Error deleting from storage:', storageError);
  }

  // Delete record
  const { error } = await supabase
    .from('peak_images')
    .delete()
    .eq('id', imageId);

  if (error) throw error;
}

// Update image caption
export async function updateImageCaption(
  supabase: SupabaseClient<Database>,
  imageId: string,
  caption: string
): Promise<PeakImage> {
  const { data, error } = await supabase
    .from('peak_images')
    .update({ caption })
    .eq('id', imageId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Reorder images
export async function reorderImages(
  supabase: SupabaseClient<Database>,
  peakId: string,
  imageIds: string[]
): Promise<void> {
  // Update each image's display_order
  const updates = imageIds.map((id, index) =>
    supabase
      .from('peak_images')
      .update({ display_order: index })
      .eq('id', id)
      .eq('peak_id', peakId)
  );

  await Promise.all(updates);
}
