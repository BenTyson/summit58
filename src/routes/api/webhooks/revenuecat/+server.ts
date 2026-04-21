import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';
import { createSupabaseServiceClient } from '$lib/server/supabase';
import { sendRaw } from '$lib/server/sparrow';

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

			// Send Pro upgrade email — non-blocking, failure doesn't affect webhook response
			sendProUpgradeEmail(supabase, userId).catch((err) =>
				console.error('Pro upgrade email failed:', err)
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

async function sendProUpgradeEmail(
	supabase: ReturnType<typeof createSupabaseServiceClient>,
	userId: string
): Promise<void> {
	const {
		data: { user }
	} = await supabase.auth.admin.getUserById(userId);
	if (!user?.email) return;

	const { data: profile } = await supabase
		.from('profiles')
		.select('display_name')
		.eq('id', userId)
		.single();

	await sendRaw({
		to: user.email,
		from: 'SaltGoat <hello@saltgoat.co>',
		subject: "You're on SaltGoat Pro",
		html: proUpgradeHtml(profile?.display_name ?? undefined)
	});
}

function proUpgradeHtml(name?: string): string {
	const thanks = name ? `Thanks, ${name}.` : 'Thanks for upgrading.';
	return `<div style="font-family:-apple-system,BlinkMacSystemFont,sans-serif;max-width:560px;margin:0 auto;padding:48px 32px;color:#0f172a;background:#ffffff;">
  <p style="font-size:12px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#64748b;margin:0 0 32px;">SaltGoat</p>
  <h1 style="font-size:26px;font-weight:700;margin:0 0 20px;line-height:1.25;">You&rsquo;re on Pro.</h1>
  <p style="font-size:16px;line-height:1.65;color:#334155;margin:0 0 16px;">${thanks} You now have access to:</p>
  <ul style="font-size:15px;line-height:1.9;color:#334155;margin:0 0 24px;padding-left:20px;">
    <li>7-day elevation-band weather forecasts for every 14er</li>
    <li>Unlimited summit logging</li>
    <li>All Pro features as they ship</li>
  </ul>
  <a href="https://saltgoat.co/peaks" style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;padding:13px 26px;border-radius:8px;font-size:15px;font-weight:600;">Explore peaks &rarr;</a>
  <hr style="border:none;border-top:1px solid #e2e8f0;margin:48px 0 24px;">
  <p style="font-size:12px;color:#94a3b8;margin:0;"><a href="https://saltgoat.co" style="color:#94a3b8;text-decoration:none;">saltgoat.co</a></p>
</div>`;
}
