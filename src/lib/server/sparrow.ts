import { env } from '$env/dynamic/private';

function getConfig() {
	const url = env.SPARROW_URL;
	const key = env.SPARROW_API_KEY;
	if (!url || !key) throw new Error('Sparrow is not configured (SPARROW_URL / SPARROW_API_KEY)');
	return { url, key };
}

async function post(path: string, body: object): Promise<Response> {
	const { url, key } = getConfig();
	return fetch(`${url}${path}`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json', 'x-api-key': key },
		body: JSON.stringify(body)
	});
}

export async function subscribe(email: string, name?: string): Promise<void> {
	const res = await post('/v1/subscribers', { email, name, list: 'newsletter' });
	// 422 = suppressed address — treat as success to avoid exposing suppression state
	if (!res.ok && res.status !== 422) {
		throw new Error(`Sparrow subscribe failed: ${res.status}`);
	}
}

export async function sendRaw(params: {
	to: string;
	from: string;
	subject: string;
	html: string;
	reply_to?: string;
}): Promise<void> {
	const res = await post('/v1/send/raw', params);
	// 422 = suppressed recipient
	if (!res.ok && res.status !== 422) {
		throw new Error(`Sparrow sendRaw failed: ${res.status}`);
	}
}

export async function sendTransactional(params: {
	to: string;
	template_id: number;
	data?: Record<string, unknown>;
	from?: string;
}): Promise<void> {
	const res = await post('/v1/send/transactional', params);
	if (!res.ok) {
		throw new Error(`Sparrow sendTransactional failed: ${res.status}`);
	}
}
