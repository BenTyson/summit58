# Manual Actions Required

## Database

- [x] Run `supabase db push` to apply the `20250308000000_add_subscriptions.sql` migration
- [x] Run `supabase gen types typescript --project-id seywnbufuewbiwoouwkk > src/lib/types/database.ts` to regenerate types

## Stripe Setup

- [x] Create a Stripe account at stripe.com (or use existing)
- [x] Get test API keys from Stripe Dashboard > Developers > API keys
- [x] Create a Stripe Product: "SaltGoat Pro" with a recurring Price of $29.99/year
- [x] Configure the Stripe Customer Portal (Dashboard > Settings > Billing > Customer portal)
  - Enable cancellation, plan changes if desired
  - Add SaltGoat branding
- [x] Set up a Stripe webhook endpoint pointing to `https://saltgoat.co/api/webhooks/stripe`
  - Events to listen for: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`

## Environment Variables

Set these in Railway (and locally in `.env` for dev):

- [x] `STRIPE_SECRET_KEY` -- from Stripe Dashboard (use test key `sk_test_...` first)
- [x] `STRIPE_WEBHOOK_SECRET` -- from the webhook endpoint config (`whsec_...`)
- [x] `PUBLIC_STRIPE_PRICE_ID` -- the Price ID for $29.99/yr (`price_...`)

## Code Changes After Stripe Setup

- [x] `npm install stripe` in the project
- [x] Replace stub functions in `src/lib/server/stripe.ts` with real Stripe SDK calls
- [x] Uncomment Supabase import in `src/routes/api/webhooks/stripe/+server.ts`

## RevenueCat Setup (Mobile IAP)

- [ ] Create account at revenuecat.com
- [ ] Create project "SaltGoat"
- [ ] Add iOS app: bundle ID `com.saltgoat.app`, paste App Store Connect shared secret
- [ ] Add Android app: package `com.saltgoat.app`, upload Google service account JSON
- [ ] Create entitlement: `pro`
- [ ] Create product mapping to App Store / Play Store subscription product IDs
- [ ] Create offering: `default` with annual package linked to the product
- [ ] Configure webhook: URL `https://saltgoat.co/api/webhooks/revenuecat`, Authorization header `Bearer <REVENUECAT_WEBHOOK_SECRET>`
- [ ] Copy API keys (iOS public key `appl_...`, Android public key `goog_...`) to `mobile/.env`
- [ ] Run `supabase db push` to apply `20260331000000_add_revenuecat_columns.sql`
- [ ] Set `REVENUECAT_WEBHOOK_SECRET` in Railway env vars

### App Store Connect (subscription product)

- [ ] App Store Connect > My Apps > SaltGoat > Subscriptions
- [ ] Create subscription group: "SaltGoat Pro"
- [ ] Create subscription product: $29.99/year, product ID e.g. `saltgoat_pro_annual`
- [ ] Add localized display name and description
- [ ] Copy shared secret to RevenueCat dashboard

### Google Play Console (subscription product)

- [ ] Google Play Console > SaltGoat > Monetize > Products > Subscriptions
- [ ] Create subscription matching the iOS product
- [ ] Create base plan (annual, $29.99)

## Google Search Console

- [ ] Go to https://search.google.com/search-console
- [ ] Add property: `https://saltgoat.co`
- [ ] Verify via DNS TXT record (recommended) or HTML file upload
- [ ] Submit sitemap: `https://saltgoat.co/sitemap.xml`
- [ ] Request indexing for key pages: `/`, `/peaks`, `/learn`, `/blog`

## Weather Webhook

The weather data pipeline runs at `POST /api/webhooks/weather` (or `GET` with `?secret=` for manual trigger).

- [x] `WEBHOOK_SECRET` set in Railway env vars
- [x] `peak_forecasts` table migrated and populated
- [ ] Set up cron service (Railway cron or cron-job.org) to hit `POST https://saltgoat.co/api/webhooks/weather` with header `x-webhook-secret: <WEBHOOK_SECRET>` at 06:00, 12:00, 18:00, 00:00 UTC (00:00, 06:00, 12:00, 18:00 MT)
- [ ] Upgrade to Open-Meteo commercial API key (~10 EUR/month) — required for commercial use with paid subscriptions

## Other

- [x] ~~Plausible~~ Umami analytics configured (self-hosted on Railway)
