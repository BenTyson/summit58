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
	/** HTTP method. Default: GET */
	method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
	/** JSON body for POST/PATCH requests */
	body?: Record<string, unknown>;
	/** FormData body for file uploads (Content-Type set automatically) */
	formData?: FormData;
}

export async function apiFetch<T>(path: string, options?: ApiFetchOptions): Promise<T> {
	const method = options?.method ?? 'GET';
	const headers: Record<string, string> = {};

	// Set Content-Type for JSON requests (not for FormData — runtime sets boundary)
	if (!options?.formData) {
		headers['Content-Type'] = 'application/json';
	}

	if (options?.auth !== false) {
		const {
			data: { session }
		} = await supabase.auth.getSession();
		if (session?.access_token) {
			headers['Authorization'] = `Bearer ${session.access_token}`;
		}
	}

	let requestBody: string | FormData | undefined;
	if (options?.formData) {
		requestBody = options.formData;
	} else if (options?.body) {
		requestBody = JSON.stringify(options.body);
	}

	let response: Response;
	try {
		response = await fetch(`${API_BASE}${path}`, { method, headers, body: requestBody });
	} catch (e) {
		throw new ApiError(0, 'Network error');
	}

	// On 401, try refreshing the token once and retry
	if (response.status === 401 && options?.auth !== false) {
		const { data } = await supabase.auth.refreshSession();
		if (data.session?.access_token) {
			headers['Authorization'] = `Bearer ${data.session.access_token}`;
			try {
				response = await fetch(`${API_BASE}${path}`, { method, headers, body: requestBody });
			} catch (e) {
				throw new ApiError(0, 'Network error');
			}
		}
	}

	if (!response.ok) {
		const body = await response.text();
		throw new ApiError(response.status, body);
	}

	// DELETE with 204 has no body
	if (response.status === 204) {
		return undefined as T;
	}

	return response.json();
}
