# Manual Actions Required

## Database

- [ ] Run `supabase db push` to apply the `20250308000000_add_subscriptions.sql` migration
- [ ] Run `supabase gen types typescript --project-id seywnbufuewbiwoouwkk > src/lib/types/database.ts` to regenerate types

## Stripe Setup

- [ ] Create a Stripe account at stripe.com (or use existing)
- [ ] Get test API keys from Stripe Dashboard > Developers > API keys
- [ ] Create a Stripe Product: "SaltGoat Pro" with a recurring Price of $29.99/year
- [ ] Configure the Stripe Customer Portal (Dashboard > Settings > Billing > Customer portal)
  - Enable cancellation, plan changes if desired
  - Add SaltGoat branding
- [ ] Set up a Stripe webhook endpoint pointing to `https://saltgoat.co/api/webhooks/stripe`
  - Events to listen for: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`

## Environment Variables

Set these in Railway (and locally in `.env` for dev):

- [ ] `STRIPE_SECRET_KEY` -- from Stripe Dashboard (use test key `sk_test_...` first)
- [ ] `STRIPE_WEBHOOK_SECRET` -- from the webhook endpoint config (`whsec_...`)
- [ ] `PUBLIC_STRIPE_PRICE_ID` -- the Price ID for $29.99/yr (`price_...`)

## Code Changes After Stripe Setup

- [ ] `npm install stripe` in the project
- [ ] Replace stub functions in `src/lib/server/stripe.ts` with real Stripe SDK calls
- [ ] Uncomment Supabase import in `src/routes/api/webhooks/stripe/+server.ts`

## Google Search Console

- [ ] Go to https://search.google.com/search-console
- [ ] Add property: `https://saltgoat.co`
- [ ] Verify via DNS TXT record (recommended) or HTML file upload
- [ ] Submit sitemap: `https://saltgoat.co/sitemap.xml`
- [ ] Request indexing for key pages: `/`, `/peaks`, `/learn`, `/blog`

## Other

- [x] ~~Plausible~~ Umami analytics configured (self-hosted on Railway)
