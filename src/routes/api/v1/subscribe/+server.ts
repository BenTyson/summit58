import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { subscribe } from '$lib/server/sparrow';

export const POST: RequestHandler = async ({ request }) => {
	let body: { email?: string; name?: string };
	try {
		body = await request.json();
	} catch {
		return json({ error: 'Invalid JSON' }, { status: 400 });
	}

	const email = (body?.email as string)?.trim().toLowerCase();
	const name = (body?.name as string)?.trim() || undefined;

	if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
		return json({ error: 'Invalid email address' }, { status: 400 });
	}

	try {
		await subscribe(email, name);
		return json({ success: true });
	} catch {
		return json({ error: 'Failed to subscribe' }, { status: 500 });
	}
};
