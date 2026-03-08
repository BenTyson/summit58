import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
// import { createSupabaseServerClient } from '$lib/server/supabase';
import { verifyWebhookSignature } from '$lib/server/stripe';

export const POST: RequestHandler = async ({ request }) => {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature') ?? '';

  const event = verifyWebhookSignature(body, signature);

  if (!event) {
    return json({ error: 'Stripe webhook not configured yet' }, { status: 400 });
  }

  // TODO: Once Stripe is wired up, event will be a real Stripe event object.
  // Handle event types:
  // - checkout.session.completed → set plan='pro', status='active'
  // - customer.subscription.updated → update status, current_period_end
  // - customer.subscription.deleted → set plan='free', status='canceled'
  // - invoice.payment_failed → set status='past_due'
  //
  // Example:
  // const supabase = createSupabaseServerClient(cookies);
  // switch (event.type) {
  //   case 'checkout.session.completed': {
  //     const session = event.data.object;
  //     await supabase.from('user_subscriptions').update({
  //       plan: 'pro',
  //       status: 'active',
  //       stripe_customer_id: session.customer,
  //       stripe_subscription_id: session.subscription,
  //       updated_at: new Date().toISOString()
  //     }).eq('user_id', session.metadata.user_id);
  //     break;
  //   }
  //   case 'customer.subscription.updated': { ... }
  //   case 'customer.subscription.deleted': { ... }
  //   case 'invoice.payment_failed': { ... }
  // }

  return json({ received: true });
};
