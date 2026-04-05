import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '$lib/types/database';
import type { ForumCategory } from './types';
import { db } from './utils';

export async function getCategories(
	supabase: SupabaseClient<Database>
): Promise<ForumCategory[]> {
	const { data, error } = await db(supabase)
		.from('forum_categories')
		.select('*')
		.order('display_order');

	if (error) {
		console.error('Error fetching forum categories:', error);
		return [];
	}
	return data as ForumCategory[];
}

export async function getCategoryBySlug(
	supabase: SupabaseClient<Database>,
	slug: string
): Promise<ForumCategory | null> {
	const { data, error } = await db(supabase)
		.from('forum_categories')
		.select('*')
		.eq('slug', slug)
		.single();

	if (error && error.code !== 'PGRST116') {
		console.error('Error fetching category:', error);
	}
	return (data as ForumCategory) ?? null;
}
