import type { RequestHandler } from './$types';
import { requireAuth } from '$lib/server/supabase';
import { getPeakBySlug } from '$lib/server/peaks';
import { uploadPeakImage, getImageUrl } from '$lib/server/images';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

/** POST /api/v1/peaks/[slug]/images — upload a peak image */
export const POST: RequestHandler = async ({ request, params }) => {
	const { supabase, user, error: authError } = await requireAuth(request);

	if (!supabase || !user) {
		return new Response(JSON.stringify({ error: authError }), {
			status: 401,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	const peak = await getPeakBySlug(supabase, params.slug);
	if (!peak) {
		return new Response(JSON.stringify({ error: 'Peak not found' }), {
			status: 404,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	let formData: FormData;
	try {
		formData = await request.formData();
	} catch {
		return new Response(JSON.stringify({ error: 'Invalid form data' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	const file = formData.get('file');
	if (!file || !(file instanceof File)) {
		return new Response(JSON.stringify({ error: 'File is required' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	if (file.size > MAX_FILE_SIZE) {
		return new Response(JSON.stringify({ error: 'File must be under 10MB' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	if (!ALLOWED_TYPES.includes(file.type)) {
		return new Response(JSON.stringify({ error: 'File must be JPEG, PNG, or WebP' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	const caption = formData.get('caption')?.toString() || undefined;
	const category = formData.get('category')?.toString() || undefined;
	const isPrivate = formData.get('is_private')?.toString() === 'true';

	try {
		const image = await uploadPeakImage(supabase, peak.id, user.id, file, caption, isPrivate, category);
		const url = getImageUrl(supabase, image.storage_path);

		return new Response(JSON.stringify({ image, url }), {
			status: 201,
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (e) {
		console.error('Error uploading image:', e);
		return new Response(JSON.stringify({ error: 'Failed to upload image' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};
