# Cairn58 Launch Roadmap

Created: 2026-03-07

## Monetization: Freemium

- **Free tier:** Browse peaks, log up to 5 summits, view leaderboard/profiles/reports
- **Cairn58 Pro ($29.99/yr):** Unlimited summits, offline data, advanced stats, GPX export, custom lists, pro badge
- **Additional:** Affiliate partnerships (REI, Backcountry), guide service listings, merch

## Phases

### Phase 0a: Docs & Agent Infrastructure [DONE]
- Project CLAUDE.md, consolidated docs, roadmap file, updated MEMORY.md

### Phase 0: Pre-Launch Critical Fixes [DONE]
- [x] Password reset flow (forgot password link on login, reset page at /auth/reset-password)
- [x] Analytics (Plausible script tag in app.html -- needs Plausible account setup)
- [x] Terms of Service + Privacy Policy pages (`/legal/terms`, `/legal/privacy`)
- [x] Trips UI: delete button wired up on planned trips
- [x] OG image fallback (all 58 peaks have hero_image_url set -- no action needed)

### Phase 1: Launch Polish [DONE]
- [x] Onboarding flow (3-step guide on empty profile: find peak, prepare, log summit)
- [x] Homepage refinement (social proof counters, varied CTAs, leaderboard CTA)
- [x] Search upgrade (increased limit to 12, elevation search, range matching)
- [x] Empty state audit (ImageGallery now shows empty state instead of hiding)
- [x] JSON-LD structured data (was already active on peak detail pages, not commented out)
- [x] Performance (images already had loading="lazy" on PeakCard and gallery)
- Note: Skeleton loading states are available but sparingly used -- adequate for launch

### Phase 2: GPX Trail Data [SKIPPED]
- Deferred -- can be done post-launch when accurate GPX data is available

### Phase 3: Monetization Infrastructure [DONE]
- [x] `user_subscriptions` table with migration (enum types, RLS, trigger, backfill)
- [x] Server-side subscription helpers (`getSubscription`, `isPro`, `canLogSummit`)
- [x] Stripe integration stubbed (`src/lib/server/stripe.ts`) -- ready for real Stripe SDK
- [x] Checkout + portal API endpoints (stubbed)
- [x] Stripe webhook handler (stubbed, returns 400 until configured)
- [x] Pricing page (`/pricing`) with free/pro comparison
- [x] 5-summit limit enforcement with upgrade prompt modal
- [x] Pro badge on profiles and leaderboard
- [x] Subscription data exposed in layout for all pages
- [x] Manual actions documented in `docs/ben.md`

### Phase 4: Growth Features [DONE]
- [x] Share button component (native share / clipboard fallback)
- [x] Trip sharing (is_public toggle, public trip pages at `/trips/[id]`)
- [x] Friends activity feed (followed users' activity on homepage)
- [x] Peak page share button
- [x] Social sharing ("I summited [Peak]!" post-summit share prompt)
- [x] Peak watchlist (watch/unwatch toggle, profile section with conditions)
- [x] Advanced stats (Pro) -- pace trends, seasonal analysis, personal records

### Phase 5: Content & SEO [DONE]
- [x] Complete Learn section (difficulty ratings guide at `/learn/difficulty-ratings`, FAQ at `/learn/faq`)
- [x] Peak detail SEO (AggregateRating + BreadcrumbList JSON-LD, "Hikers Also Climbed" section)
- [x] Blog (`/blog` hub, welcome post, origin story post, Blog in nav)
- [x] Structured data: FAQPage on learn hub, BreadcrumbList on all learn pages + blog
- [x] Sitemap expanded with learn, blog, leaderboard, pricing URLs
- [x] Google Search Console setup (manual steps in `docs/ben.md`)

### Phase 6: User Photo Uploads + Moderation [DONE]
- [x] User photo uploads on peak pages (admin-only gate removed)
  - Image optimization pipeline (Sharp)
  - Photo attribution (uploader name/link in gallery + lightbox)
  - Flag-based moderation: auto-hides at 3 flags, admin reviews at `/admin`
  - Upload limits: 5 public photos/peak free, unlimited Pro
  - Private photos (visible only to uploader)
- [x] Content moderation dashboard (`/admin`)
  - Review flagged photos, approve/remove
  - Pending content flags queue (dismiss/action)
- [x] Community guidelines page (`/guidelines`)
- [x] Generic `content_flags` table (covers photos, reviews, trail reports)

### Phase 6b: Photo Categories + Gallery Filters [DONE]
- [x] Photo category/tag field on `peak_images` (e.g. `category TEXT`)
  - Categories: Summit, Trailhead, Trail, Hazards, Vistas, Wildlife, Parking & Road Access, Wildflowers, Winter Conditions, Camping
  - Category selector in ImageUploader (dropdown or chip picker)
- [x] Gallery filtering on peak pages (filter chips above photo grid)
- [x] Category badge overlay on gallery thumbnails
- [x] Category shown in lightbox view

### Phase 6c: User GPX Uploads [IN PROGRESS]
- [ ] User GPX upload on routes
  - Upload GPX file, parse to GeoJSON (pipeline exists: `src/lib/server/gpx.ts`)
  - Community-sourced trail data with voting/quality scoring
  - Best trace selected for route display
  - Attribution to uploader
- [x] `route_traces` table + migration
- [x] Server-side trace queries (`src/lib/server/traces.ts`)
- [x] TrailMapSection updated for community traces (selector, voting, download, delete)
- [x] GpxUploader component (`src/lib/components/trail/GpxUploader.svelte`)
- [x] Post-login redirect (`redirectTo` param across auth flow) -- users return to route page after login

### Phase 7: Affiliate & Partnerships (1-2 sessions)
- [ ] Contextual gear recommendations on peak/route pages
- [ ] Affiliate link tracking
- [ ] Guide service featured listings
- [ ] Partner page (`/partners`)

### Phase 8: Quality of Life (Ongoing)
- [ ] Notifications system (follows, achievements, trail reports, watchlist alerts) -- needs push/email service
- [ ] Email digests (weekly/monthly) -- needs email provider (Resend, SendGrid, etc.)
- [ ] Sentry error monitoring
- [ ] Rate limiting on form actions

- [ ] Accessibility audit
- [ ] Admin dashboard
- [x] ~~Remaining hero images~~ (all 58 complete)

## Execution Order

| Phase | Sessions | Blocking? |
|-------|----------|-----------|
| 0a: Docs | 1 | YES -- do first |
| 0: Critical Fixes | 1-2 | YES -- before launch |
| 1: Launch Polish | 2-3 | YES -- before launch |
| 2: GPX Data | SKIPPED | NO -- deferred |
| 3: Monetization | 1 | NO -- launch free first |
| 4-5 | Ongoing | NO -- post-launch |
| 6: UGC | 2-3 | HIGH PRIORITY -- core to value prop |
| 7-8 | Ongoing | NO -- post-launch |

**Minimum viable launch = Phase 0 + Phase 1** (3-5 sessions)
**Recommended launch = Phase 0 + Phase 1 + Phase 2** (5-8 sessions)
