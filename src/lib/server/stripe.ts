import Stripe from 'stripe';
import { env } from '$env/dynamic/private';

function getStripe() {
	const key = env.STRIPE_SECRET_KEY;
	if (!key) throw new Error('STRIPE_SECRET_KEY is not set');
	return new Stripe(key);
}

export async function createCheckoutSession(
	userId: string,
	email: string,
	origin: string
): Promise<{ url: string }> {
	const stripe = getStripe();
	const priceId = env.STRIPE_PRICE_ID;
	if (!priceId) throw new Error('STRIPE_PRICE_ID is not set');

	const session = await stripe.checkout.sessions.create({
		customer_email: email,
		mode: 'subscription',
		line_items: [{ price: priceId, quantity: 1 }],
		success_url: `${origin}/profile?upgraded=true`,
		cancel_url: `${origin}/pricing`,
		metadata: { user_id: userId }
	});

	return { url: session.url! };
}

export async function createPortalSession(
	customerId: string,
	origin: string
): Promise<{ url: string }> {
	const stripe = getStripe();

	const session = await stripe.billingPortal.sessions.create({
		customer: customerId,
		return_url: `${origin}/profile`
	});

	return { url: session.url };
}

export function verifyWebhookSignature(
	body: string,
	signature: string
): Stripe.Event | null {
	const secret = env.STRIPE_WEBHOOK_SECRET;
	if (!secret) return null;

	const stripe = getStripe();
	try {
		return stripe.webhooks.constructEvent(body, signature, secret) as Stripe.Event;
	} catch {
		return null;
	}
}
