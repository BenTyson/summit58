import type { RequestHandler } from './$types';
import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { getCategories } from '$lib/server/forum';

/** GET /api/v1/forum/categories — list all forum categories */
export const GET: RequestHandler = async () => {
	const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);
	const categories = await getCategories(supabase);

	return new Response(JSON.stringify({ categories }), {
		headers: { 'Content-Type': 'application/json' }
	});
};
