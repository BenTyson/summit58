import type { PageServerLoad } from './$types';
import { createSupabaseServiceClient } from '$lib/server/supabase';

export const load: PageServerLoad = async () => {
	const supabase = createSupabaseServiceClient();

	const { data: submissions } = await supabase
		.from('contact_submissions')
		.select('*')
		.order('created_at', { ascending: false })
		.limit(200);

	return { submissions: submissions ?? [] };
};
