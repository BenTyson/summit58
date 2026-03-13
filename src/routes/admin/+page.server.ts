import type { PageServerLoad, Actions } from './$types';
import { createSupabaseServerClient } from '$lib/server/supabase';
import { isAdmin, getFlaggedImages, moderateImage, getImageUrl } from '$lib/server/images';
import { getPendingFlags, resolveFlag } from '$lib/server/flags';
import { redirect, fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ cookies }) => {
  const supabase = createSupabaseServerClient(cookies);
  const { data: { session } } = await supabase.auth.getSession();

  if (!session?.user || !isAdmin(session.user.id)) {
    throw redirect(302, '/');
  }

  const [flaggedImages, pendingFlags] = await Promise.all([
    getFlaggedImages(supabase),
    getPendingFlags(supabase)
  ]);

  // Add public URLs to flagged images
  const flaggedImagesWithUrls = flaggedImages.map((img) => ({
    ...img,
    url: getImageUrl(supabase, img.storage_path)
  }));

  return {
    flaggedImages: flaggedImagesWithUrls,
    pendingFlags
  };
};

export const actions: Actions = {
  approveImage: async ({ request, cookies }) => {
    const supabase = createSupabaseServerClient(cookies);
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user || !isAdmin(session.user.id)) {
      return fail(403, { message: 'Admin access required' });
    }

    const formData = await request.formData();
    const imageId = formData.get('image_id') as string;

    try {
      await moderateImage(supabase, imageId, 'approve', session.user.id);
      return { success: true };
    } catch (e) {
      console.error('Error approving image:', e);
      return fail(500, { message: 'Failed to approve image' });
    }
  },

  removeImage: async ({ request, cookies }) => {
    const supabase = createSupabaseServerClient(cookies);
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user || !isAdmin(session.user.id)) {
      return fail(403, { message: 'Admin access required' });
    }

    const formData = await request.formData();
    const imageId = formData.get('image_id') as string;

    try {
      await moderateImage(supabase, imageId, 'remove', session.user.id);
      return { success: true };
    } catch (e) {
      console.error('Error removing image:', e);
      return fail(500, { message: 'Failed to remove image' });
    }
  },

  resolveFlag: async ({ request, cookies }) => {
    const supabase = createSupabaseServerClient(cookies);
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user || !isAdmin(session.user.id)) {
      return fail(403, { message: 'Admin access required' });
    }

    const formData = await request.formData();
    const flagId = formData.get('flag_id') as string;
    const action = formData.get('action') as 'dismissed' | 'actioned';

    try {
      await resolveFlag(supabase, flagId, action, session.user.id);
      return { success: true };
    } catch (e) {
      console.error('Error resolving flag:', e);
      return fail(500, { message: 'Failed to resolve flag' });
    }
  }
};
