import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';
import { createSupabaseServiceClient } from '$lib/server/supabase';

interface RevenueCatEvent {
	type: string;
	app_user_id: string;
	original_transaction_id?: string;
	product_id?: string;
	expiration_at_ms?: number;
	store?: string;
}

interface RevenueCatWebhook {
	event: RevenueCatEvent;
}

function getPlatform(store?: string): string | null {
	if (store === 'APP_STORE' || store === 'MAC_APP_STORE') return 'ios';
	if (store === 'PLAY_STORE') return 'android';
	return null;
}

export const POST: RequestHandler = async ({ request }) => {
	const secret = env.REVENUECAT_WEBHOOK_SECRET;
	if (!secret) {
		return json({ error: 'Webhook not configured' }, { status: 500 });
	}

	const authHeader = request.headers.get('Authorization');
	if (authHeader !== `Bearer ${secret}`) {
		return json({ error: 'Invalid authorization' }, { status: 401 });
	}

	const body = (await request.json()) as RevenueCatWebhook;
	const event = body.event;
	if (!event?.type || !event?.app_user_id) {
		return json({ error: 'Invalid payload' }, { status: 400 });
	}

	const supabase = createSupabaseServiceClient();
	const userId = event.app_user_id;
	const now = new Date().toISOString();

	switch (event.type) {
		case 'INITIAL_PURCHASE': {
			const periodEnd = event.expiration_at_ms
				? new Date(event.expiration_at_ms).toISOString()
				: null;

			await supabase.from('user_subscriptions').upsert(
				{
					user_id: userId,
					plan: 'pro',
					status: 'active',
					platform: getPlatform(event.store),
					app_store_transaction_id: event.original_transaction_id ?? null,
					revenuecat_id: userId,
					current_period_end: periodEnd,
					updated_at: now
				},
				{ onConflict: 'user_id' }
			);
			break;
		}
		case 'RENEWAL': {
			const periodEnd = event.expiration_at_ms
				? new Date(event.expiration_at_ms).toISOString()
				: null;

			await supabase
				.from('user_subscriptions')
				.update({
					status: 'active',
					current_period_end: periodEnd,
					updated_at: now
				})
				.eq('user_id', userId);
			break;
		}
		case 'CANCELLATION': {
			await supabase
				.from('user_subscriptions')
				.update({
					status: 'canceled',
					updated_at: now
				})
				.eq('user_id', userId);
			break;
		}
		case 'EXPIRATION': {
			await supabase
				.from('user_subscriptions')
				.update({
					plan: 'free',
					status: 'canceled',
					updated_at: now
				})
				.eq('user_id', userId);
			break;
		}
		case 'BILLING_ISSUE_DETECTED': {
			await supabase
				.from('user_subscriptions')
				.update({
					status: 'past_due',
					updated_at: now
				})
				.eq('user_id', userId);
			break;
		}
	}

	return json({ received: true });
};
