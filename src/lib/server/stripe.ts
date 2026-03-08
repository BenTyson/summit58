// TODO: Replace all stubs with real Stripe SDK calls once Ben has Stripe test keys.
// npm install stripe, then import Stripe from 'stripe' and initialize with STRIPE_SECRET_KEY.

export async function createCheckoutSession(
  _userId: string,
  _email: string
): Promise<{ url: string }> {
  // TODO: Replace with real Stripe SDK call
  // const stripe = new Stripe(STRIPE_SECRET_KEY);
  // const session = await stripe.checkout.sessions.create({
  //   customer_email: email,
  //   mode: 'subscription',
  //   line_items: [{ price: PUBLIC_STRIPE_PRICE_ID, quantity: 1 }],
  //   success_url: `${origin}/profile?upgraded=true`,
  //   cancel_url: `${origin}/pricing`,
  //   metadata: { user_id: userId }
  // });
  // return { url: session.url! };
  return { url: '/pricing?stub=true' };
}

export async function createPortalSession(
  _customerId: string
): Promise<{ url: string }> {
  // TODO: Replace with real Stripe SDK call
  // const stripe = new Stripe(STRIPE_SECRET_KEY);
  // const session = await stripe.billingPortal.sessions.create({
  //   customer: customerId,
  //   return_url: `${origin}/profile`
  // });
  // return { url: session.url };
  return { url: '/pricing?stub=true' };
}

export function verifyWebhookSignature(
  _body: string,
  _signature: string
): null {
  // TODO: Replace with real Stripe webhook signature verification
  // const stripe = new Stripe(STRIPE_SECRET_KEY);
  // return stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET);
  return null;
}
