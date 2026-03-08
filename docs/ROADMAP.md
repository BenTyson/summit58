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

### Phase 4: Growth Features (3-4 sessions)
- [x] Share button component (native share / clipboard fallback)
- [x] Trip sharing (is_public toggle, public trip pages at `/trips/[id]`)
- [x] Friends activity feed (followed users' activity on homepage)
- [x] Peak page share button
- [x] Social sharing ("I summited [Peak]!" post-summit share prompt)
- [x] Peak watchlist (watch/unwatch toggle, profile section with conditions)
- [ ] Notifications system (follows, achievements, trail reports)
- [ ] Email digests (weekly/monthly)
- [x] Advanced stats (Pro) -- pace trends, seasonal analysis, personal records

### Phase 5: Content & SEO (2 sessions)
- [ ] Complete Learn section (difficulty ratings, FAQ)
- [ ] Peak detail SEO (longer descriptions, "Hikers Also Climbed")
- [ ] Blog/Updates page
- [ ] Google Search Console setup

### Phase 6: Affiliate & Partnerships (1-2 sessions)
- [ ] Contextual gear recommendations on peak/route pages
- [ ] Affiliate link tracking
- [ ] Guide service featured listings
- [ ] Partner page (`/partners`)

### Phase 7: Quality of Life (Ongoing)
- [ ] Sentry error monitoring
- [ ] Rate limiting on form actions
- [ ] Image upload improvements (drag-and-drop, multi-image)
- [ ] Accessibility audit
- [ ] Admin dashboard
- [ ] Remaining hero images (15 missing)

## Execution Order

| Phase | Sessions | Blocking? |
|-------|----------|-----------|
| 0a: Docs | 1 | YES -- do first |
| 0: Critical Fixes | 1-2 | YES -- before launch |
| 1: Launch Polish | 2-3 | YES -- before launch |
| 2: GPX Data | SKIPPED | NO -- deferred |
| 3: Monetization | 1 | NO -- launch free first |
| 4-7 | Ongoing | NO -- post-launch |

**Minimum viable launch = Phase 0 + Phase 1** (3-5 sessions)
**Recommended launch = Phase 0 + Phase 1 + Phase 2** (5-8 sessions)
