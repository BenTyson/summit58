import { supabase } from './supabase';

const API_BASE = process.env.EXPO_PUBLIC_API_BASE_URL!;

export class ApiError extends Error {
	constructor(
		public status: number,
		public body: string
	) {
		super(`API error ${status}: ${body}`);
	}
}

interface ApiFetchOptions {
	/** Set to false to skip auth header (public endpoints). Default: true */
	auth?: boolean;
}

export async function apiFetch<T>(path: string, options?: ApiFetchOptions): Promise<T> {
	const headers: Record<string, string> = {
		'Content-Type': 'application/json'
	};

	if (options?.auth !== false) {
		const {
			data: { session }
		} = await supabase.auth.getSession();
		if (session?.access_token) {
			headers['Authorization'] = `Bearer ${session.access_token}`;
		}
	}

	let response: Response;
	try {
		response = await fetch(`${API_BASE}${path}`, { headers });
	} catch (e) {
		throw new ApiError(0, 'Network error');
	}

	// On 401, try refreshing the token once and retry
	if (response.status === 401 && options?.auth !== false) {
		const { data } = await supabase.auth.refreshSession();
		if (data.session?.access_token) {
			headers['Authorization'] = `Bearer ${data.session.access_token}`;
			response = await fetch(`${API_BASE}${path}`, { headers });
		}
	}

	if (!response.ok) {
		const body = await response.text();
		throw new ApiError(response.status, body);
	}

	return response.json();
}
