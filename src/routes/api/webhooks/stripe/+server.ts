import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type Stripe from 'stripe';
import { verifyWebhookSignature } from '$lib/server/stripe';
import { createSupabaseServiceClient } from '$lib/server/supabase';

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.text();
	const signature = request.headers.get('stripe-signature') ?? '';

	const event = verifyWebhookSignature(body, signature);
	if (!event) {
		return json({ error: 'Invalid signature' }, { status: 400 });
	}

	const supabase = createSupabaseServiceClient();

	switch (event.type) {
		case 'checkout.session.completed': {
			const session = event.data.object as Stripe.Checkout.Session;
			const userId = session.metadata?.user_id;
			if (!userId) break;

			await supabase.from('user_subscriptions').upsert(
				{
					user_id: userId,
					plan: 'pro',
					status: 'active',
					stripe_customer_id: session.customer as string,
					stripe_subscription_id: session.subscription as string,
					updated_at: new Date().toISOString()
				},
				{ onConflict: 'user_id' }
			);
			break;
		}
		case 'customer.subscription.updated': {
			const sub = event.data.object as Stripe.Subscription;
			const status = mapStripeStatus(sub.status);

			await supabase
				.from('user_subscriptions')
				.update({
					status,
					updated_at: new Date().toISOString()
				})
				.eq('stripe_subscription_id', sub.id);
			break;
		}
		case 'customer.subscription.deleted': {
			const sub = event.data.object as Stripe.Subscription;

			await supabase
				.from('user_subscriptions')
				.update({
					plan: 'free',
					status: 'canceled',
					updated_at: new Date().toISOString()
				})
				.eq('stripe_subscription_id', sub.id);
			break;
		}
		case 'invoice.payment_failed': {
			const invoice = event.data.object as Stripe.Invoice;
			const subId =
				typeof invoice.parent?.subscription_details?.subscription === 'string'
					? invoice.parent.subscription_details.subscription
					: invoice.parent?.subscription_details?.subscription?.id;
			if (subId) {
				await supabase
					.from('user_subscriptions')
					.update({
						status: 'past_due',
						updated_at: new Date().toISOString()
					})
					.eq('stripe_subscription_id', subId);
			}
			break;
		}
	}

	return json({ received: true });
};

function mapStripeStatus(
	status: Stripe.Subscription.Status
): 'active' | 'canceled' | 'past_due' | 'trialing' {
	switch (status) {
		case 'active':
			return 'active';
		case 'trialing':
			return 'trialing';
		case 'past_due':
		case 'unpaid':
			return 'past_due';
		default:
			return 'canceled';
	}
}
