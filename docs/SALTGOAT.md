# SaltGoat - Full Reference

> **Quick start?** See [session-start/README.md](./session-start/README.md) for fast onboarding.

Comprehensive reference for SaltGoat development.

---

## Quick Reference

| Key | Value |
|-----|-------|
| **Stack** | SvelteKit 5 + Supabase (cloud) + Tailwind 3 + Railway |
| **Status** | Production ready - all features + launch audit complete |
| **Dev** | `npm run dev` → http://localhost:4466 |
| **Prod** | https://saltgoat.co |
| **Deploy** | `railway up -d` |
| **DB Push** | `supabase db push` |

---

## Infrastructure

```bash
# Railway
railway link -p 00b2ac99-4a09-4959-992f-169c7f981b96
railway up -d                 # Deploy
railway logs                  # Logs

# Supabase (cloud - no Docker)
supabase link --project-ref seywnbufuewbiwoouwkk
supabase db push              # Push migrations
supabase gen types typescript --project-id seywnbufuewbiwoouwkk > src/lib/types/database.ts
```

---

## Database

### Core Tables
- **peaks** - All 58 Colorado 14ers (name, slug, elevation, rank, range, coordinates, etc.)
  - Elevations updated to 2024 National Geodetic Survey measurements
  - Mt. Evans renamed to Mt. Blue Sky (2022 official name change)
- **routes** - 66 climbing routes (58 standard + 8 alternate routes)
  - Core: distance, elevation_gain, difficulty_class, trail_geometry
  - Trailhead: name, latitude, longitude, elevation
  - Parking: type, capacity, fee_type, fee_amount, shuttle_available, overflow_options, recommended_arrival_time, parking_notes, restroom_available, cell_service
  - `trail_geometry` - GeoJSON LineString with coordinates [[lon, lat, elevation], ...] and properties

### User Tables
- **profiles** - User profiles (extends auth.users)
  - Core: display_name, username, avatar_url, cover_image_url, bio, tagline, location
  - Social: website_url, instagram_handle, strava_athlete_id
  - Hiking: favorite_peak_id, years_hiking
  - Privacy: is_public
- **user_summits** - Summit logs (user_id, peak_id, date_summited, route_id, conditions, notes)
- **user_reviews** - Peak reviews (user_id, peak_id, rating 1-5, title, body, date_climbed, conditions)
- **user_achievements** - Earned achievements (user_id, achievement_id, earned_at, notified)
- **trail_reports** - Trail conditions (user_id, peak_id, hike_date, trail_status, snow_depth, hazards)

### Social Tables
- **summit_reactions** - Congrats on summit entries (summit_id → user_summits, user_id, unique per user/summit)
- **summit_comments** - Comments on summit entries (summit_id → user_summits, user_id, body max 500 chars)

### RLS Policies
- Peaks/routes: public read
- Profiles: public read, users update own
- Summits: public read, users CRUD own
- Reviews: public read, users CRUD own (one review per peak)
- Achievements: public read, users insert own
- Trail reports: public read, users CRUD own
- Summit reactions/comments: public read, users insert/delete own

---

## Project Structure

```
src/
├── hooks.server.ts           → Security headers (X-Frame-Options, etc.)
│
├── lib/
│   ├── components/
│   │   ├── ui/        → Container, Badge, AchievementIcon, Skeleton
│   │   ├── admin/     → AdminTabs, StatCard
│   │   ├── layout/    → Header, Footer, ThemeToggle
│   │   ├── peak/      → PeakCard, PeakHero, StatsBar, QuickFacts
│   │   ├── route/     → RouteCard
│   │   ├── summit/    → SummitButton, SummitModal (Peak Bagger)
│   │   ├── review/    → StarRating, ReviewCard, ReviewForm, ReviewSection
│   │   ├── trail/     → TrailReportForm, TrailReportCard
│   │   ├── parking/   → ParkingCard
│   │   ├── profile/   → Achievements, ProfileHeader, ProfileTabs, ProfileStats, EditProfileModal, ActivityFeed
│   │   ├── gallery/   → ImageGallery, ImageUploader, Lightbox
│   │   ├── weather/   → WeatherCard
│   │   ├── map/       → PeakMap, TrailMap, ElevationProfile, TrailMapSection
│   │   └── search/    → SearchModal
│   ├── data/
│   │   ├── ranges.ts      → Mountain range metadata
│   │   └── achievements.ts → 23 achievement definitions
│   ├── server/
│   │   ├── supabase.ts       → SSR client
│   │   ├── peaks.ts          → Peak data queries
│   │   ├── summits.ts        → Summit CRUD + stats
│   │   ├── reviews.ts        → Review CRUD
│   │   ├── trailReports.ts   → Trail report CRUD
│   │   ├── achievements.ts   → Achievement checking + awarding
│   │   ├── leaderboard.ts    → Leaderboard aggregation
│   │   ├── images.ts         → Image gallery CRUD + optimization
│   │   ├── imageOptimizer.ts → Sharp-based image processing
│   │   ├── conditions.ts     → Weather fetch + queries
│   │   ├── admin.ts          → Admin auth (isAdmin, assertAdmin) + all admin dashboard queries
│   │   ├── subscriptions.ts  → Subscription helpers (getSubscription, isPro, canLogSummit)
│   │   ├── stripe.ts         → Stripe SDK stubs (checkout, portal, webhook verification)
│   │   ├── reactions.ts      → Summit reactions (toggle, batch-fetch with avatar stack)
│   │   ├── comments.ts       → Summit comments (create, delete, batch-fetch)
│   │   └── gpx.ts            → GPX to GeoJSON parsing
│   ├── utils/
│   │   └── geo.ts          → Geographic utilities (distance, elevation)
│   └── types/database.ts → Generated types
│
├── routes/
│   ├── +error.svelte             → Custom error page (404/500)
│   ├── +page.svelte              → Homepage
│   ├── auth/+page.svelte         → Login/signup
│   ├── peaks/+page.svelte        → All peaks (filterable)
│   ├── peaks/[slug]/+page.svelte → Peak detail (reviews, trail reports, weather)
│   ├── peaks/[slug]/[route]/     → Route detail (trail map + elevation profile + parking)
│   ├── ranges/+page.svelte       → All mountain ranges
│   ├── ranges/[slug]/+page.svelte → Range detail
│   ├── leaderboard/+page.svelte  → Global rankings + activity
│   ├── map/+page.svelte          → Full interactive map (peaks + trail overlay)
│   ├── learn/                    → Educational guides (first-fourteener, safety, gear, parking, difficulty-ratings, faq)
│   ├── blog/                     → Blog hub + posts (welcome, why-we-built-saltgoat)
│   ├── users/[id]/+page.svelte   → Public user profile
│   ├── admin/                    → Admin dashboard (nested routes)
│   │   ├── +layout.server.ts    → Auth guard + shared badge counts
│   │   ├── +layout.svelte       → Admin chrome (title, tabs, container)
│   │   ├── +page.*              → Overview tab (default)
│   │   ├── moderation/          → Flagged photos, flags, recent uploads, resolved history
│   │   ├── users/               → User management (search, sort, pagination)
│   │   ├── content/             → Content browser (photos, reviews, reports, traces)
│   │   └── subscriptions/       → Subscription metrics + table
│   ├── api/
│   │   ├── checkout/            → Stripe checkout session (stub)
│   │   ├── portal/              → Stripe billing portal (stub)
│   │   ├── export/summits/      → Pro-only CSV export of summit history
│   │   └── webhooks/            → Weather + Stripe webhooks
│   └── profile/+page.svelte      → "My 58" dashboard + achievements

static/brand/                     → Logo assets (SaltGoat_LogoGoat.png, SaltGoat_LogoGoat_White.png)
static/images/peaks/              → Custom peak hero images
```

---

## Key Features

### Peak Bagger ("My 58")
- Summit logging with date, route, conditions, notes
- Multiple summits per peak allowed
- Profile dashboard with "The 58" grid visualization
- Progress bars by class and range
- Prominent "My 58" nav link for logged-in users

### User Reviews
- 1-5 star ratings per peak
- Optional title, body, date climbed, conditions
- One review per user per peak
- Average rating displayed on peak pages
- Sort by newest/highest/lowest

### Mountain Ranges
- 7 ranges: Sawatch, Elk, San Juan, Sangre de Cristo, Mosquito, Front, Tenmile
- Rich metadata: description, best season, character, nearest towns
- Range detail pages with filtered peaks
- User progress tracking per range

### Trail Reports
- User-submitted trail conditions
- Trail status: clear, muddy, snowy, icy, mixed
- Snow depth tracking (inches)
- Crowd level and road access status
- Hazard selection: ice, rockfall, wildlife, weather, etc.
- Recent reports shown on peak detail pages

### Achievements
- 23 achievements across 5 categories
- **Milestones**: First summit, 10, 25, 29, 50, 58 peaks
- **Range completion**: One per mountain range (7 total)
- **Class mastery**: All Class 1, 2, 3, or 4 peaks
- **Community**: Reviews and trail reports
- **Seasonal**: Winter and summer summits
- Auto-awarded on summit/review/trail report actions
- SVG icons (no emoji) for premium aesthetic
- Progress tracking for in-progress achievements

### Leaderboard
- Global rankings by unique peaks summited
- Stats overview: total climbers, summits logged, peak baggers
- Tie handling for equal stats
- Recent activity feed sidebar
- "Peak Bagger" badge for users who've completed all 58

### Trail GPX Mapping
- Infrastructure built: TrailMap, ElevationProfile, TrailMapSection components
- Map type toggle: Topo (OpenTopoMap), Satellite (Esri), Street (OSM)
- Mountain-shaped markers with drop shadows and class colors
- Summited peaks show checkmark, unsummited show class number
- **Trail data currently REMOVED** -- original data had only 7-25 points per route (unusable)
- GPX import pipeline ready: `scripts/import-gpx.mjs`, `src/lib/server/gpx.ts`
- Pending: accurate CalTopo traces for all 66 routes (see Roadmap Phase 2)

### Trailhead Parking
- Comprehensive parking info for all 66 routes
- Parking type: free lot, paid lot, dispersed, permit required, private
- Capacity indicators: very limited → unlimited
- Fee information with pass acceptance notes
- Shuttle availability and booking info
- Recommended arrival times for busy weekends
- Restroom and cell service availability
- Overflow parking options
- ParkingCard component on route detail pages
- Dedicated Learn page at /learn/parking

### Data Accuracy (2024 NGS Survey)
- All peak elevations verified against 2024 National Geodetic Survey
- 14 peaks with elevation corrections >5 feet
- All 58 peak ranks corrected based on new survey data
- Mt. Evans renamed to Mt. Blue Sky (2022 official name change)
- Route data verified against 14ers.com: distance, elevation gain, difficulty class
- 9 difficulty class corrections (6 were underrated - safety critical)
- All 58 trailhead coordinates verified and corrected
- Data sources: 14ers.com, National Geodetic Survey, 5280.com

### Custom Peak Images
- 58 peak hero images (all peaks covered, optimized JPEG ~300KB each)
- Images stored in `static/images/peaks/` (served as `/images/peaks/`)
- Database fields: `peaks.hero_image_url`, `peaks.thumbnail_url`
- Migration: `supabase/migrations/20241227500000_custom_hero_images.sql`
- Use `/hero-image` skill to add new images

### Public User Profiles
- Viewable user profiles at `/users/[id]`
- Privacy toggle (is_public) for profile visibility
- Display name, bio, location, and summit stats
- Clickable usernames on leaderboard link to profiles

### Social Profile Infrastructure
- Profile header: cover photo (full-bleed), large square avatar (rounded-2xl, 120/140px), info panel below (no overlap)
- Tab-based layout: Overview, Activity, Photos, Trips, Buddies
- Social links: Instagram, Strava, personal website
- Profile fields: tagline, favorite peak, years hiking
- Image uploads to Supabase Storage (profile-images bucket)
- Edit profile modal with avatar/cover photo upload
- Quick stats bar showing peaks, progress, summits, badges
- Profile tabs fully implemented: Activity, Photos, Trips, Buddies
- Follow system with follower/following lists and suggestions
- Trip planning with create/edit/delete

### Social Engagement
- Summit reactions (congrats): single reaction type per user per summit, toggle button on all activity feeds
  - Congrats button with count, avatar stack of recent reactors (up to 3), overflow indicator
  - Available on profile activity tab, homepage friends feed, public profiles
  - Server: `src/lib/server/reactions.ts` — `toggleReaction()`, `getReactionsForSummits()` (batch fetch)
- Summit comments: lightweight text-only conversations on summit entries
  - Expandable comment section with count badge, max 500 chars per comment
  - Users can delete their own comments
  - Server: `src/lib/server/comments.ts` — `createComment()`, `deleteComment()`, `getCommentsForSummits()` (batch fetch)
- Both features are free for all authenticated users
- Form actions (`toggleReaction`, `addComment`, `deleteComment`) on `/profile`, `/`, `/users/[id]`

### Admin Dashboard
- 5-tab nested-route dashboard at `/admin` (overview, moderation, users, content, subscriptions)
- Auth centralized in `src/lib/server/admin.ts` — `isAdmin()`, `assertAdmin()`, all admin queries
- Layout guard at `src/routes/admin/+layout.server.ts` — single auth check for all tabs
- **Overview:** platform metrics (total users, active 7d, pro subs, pending moderation), content totals, recent signups, quick alerts
- **Moderation:** flagged photos with approve/remove, pending content flags with dismiss/action, recent uploads for proactive review, resolved flags history
- **Users:** searchable/sortable user table with pagination (25/page), plan badges, summit/photo counts, profile links
- **Content:** browse all UGC by type filter (photos, reviews, trail reports, GPX traces), status filter for photos, pagination, admin delete/moderate actions
- **Subscriptions:** pro/free/conversion metrics, status breakdown (active, trialing, canceled, past_due), full subscription table
- Shared components: `AdminTabs` (route-based `<a>` nav, not `?tab=` params), `StatCard` (metric card with variant colors)
- Admin check: hardcoded user ID for single admin, re-exported from `images.ts` for backward compat

### Monetization (Freemium)
- **Free tier:** Browse all peaks, log up to 5 summits, unlimited photo uploads, reviews, trail reports, leaderboard, achievements, trip planning, activity feed, watchlist
- **SaltGoat Pro ($29.99/yr):** Unlimited summit logging, advanced stats dashboard (pace trends, seasonal analysis, personal records, route preferences), export summit history (CSV), pro badge on profile & leaderboard
- Summit limit enforced server-side in `canLogSummit()` (`src/lib/server/subscriptions.ts`), upgrade prompt modal on peak pages
- Advanced stats gated in profile page server load — only fetched for pro users
- CSV export at `GET /api/export/summits` — requires auth + pro subscription
- Stripe integration stubbed (`src/lib/server/stripe.ts`) — checkout, portal, webhooks ready for real SDK
- Photo uploads have NO limit for any user (limit was removed — UGC benefits the platform)
- Pricing page at `/pricing` — feature comparison, FAQ, checkout/portal buttons

### Content & SEO
- Learn section: 6 guides (first-fourteener, safety, gear, parking, difficulty-ratings, faq)
- Blog at `/blog` with welcome + origin story posts
- JSON-LD structured data: Place + AggregateRating on peaks, FAQPage on learn hub, BreadcrumbList on all content pages, Article on blog posts
- "Hikers Also Climbed" section on peak detail (same range, elevation proximity)
- Sitemap includes all static and dynamic routes

---

## Svelte 5 Patterns

```typescript
// Props
let { peak, featured = false }: Props = $props();

// Reactive state
let count = $state(0);

// Derived (MUST use for prop-dependent values)
const difficultyClass = $derived(peak.standard_route?.difficulty_class ?? 1);

// Derived function (for sorting/filtering)
const sortedPeaks = $derived(() => {
  return [...peaks].sort((a, b) => b.elevation - a.elevation);
});

// Server load with auth
export async function load({ cookies }) {
  const supabase = createSupabaseServerClient(cookies);
  const { data: { session } } = await supabase.auth.getSession();
  return { peaks: await getAllPeaks(supabase), isLoggedIn: !!session };
}

// Form actions
export const actions: Actions = {
  logSummit: async ({ request, cookies }) => {
    // Handle form submission
  }
};
```

---

## Design System

| Element | Classes |
|---------|---------|
| Primary accent | `accent` (warm gold #C8A55C), `accent-light`, `accent-dark`, `accent-warm`, `accent-muted` |
| Semantic colors | `semantic-success` (sage), `semantic-danger` (brick), `semantic-warning` (ochre) — each with `-light`/`-dark` |
| Class 1-4 colors | `class-1` (muted sage), `class-2` (muted blue), `class-3` (muted ochre), `class-4` (muted brick) |
| Cards | `shadow-card`, `shadow-card-hover`, `shadow-card-elevated` |
| Glows | `shadow-glow-accent`, `shadow-glow-class-1` through `shadow-glow-class-4` |
| Animations | `animate-fade-in-up`, `animate-float`, `animate-pulse-subtle` |
| Gradients | `bg-gradient-to-r from-accent to-accent-warm` |
| Fonts | Display: Instrument Serif, Body: Inter |

Dark mode: `.dark` class on html element. Header + Footer use dual logo images: `SaltGoat_LogoGoat.png` (light) / `SaltGoat_LogoGoat_White.png` (dark) swapped via `dark:hidden` / `hidden dark:block`. Header also shows white logo when transparent (hero pages, not scrolled).

---

## Phases

| Phase | Status |
|-------|--------|
| 1. MVP + UI Polish | ✅ Complete |
| 1.5 All 58 Peaks | ✅ Complete |
| 2. User Auth & Peak Bagger | ✅ Complete |
| 2.5 Reviews & Ranges | ✅ Complete |
| 3. Image Gallery | ✅ Complete |
| 3.5 Weather & Conditions | ✅ Complete |
| 4. Trail Reports | ✅ Complete |
| 4.5 Achievements System | ✅ Complete |
| 5. Leaderboard | ✅ Complete |
| 6. Public User Profiles | ✅ Complete |
| 7. Trail GPX Mapping | ✅ Complete |
| 8. Custom Domain | ✅ Complete |
| 9. Advanced Search | ✅ Complete |
| 10. Data Accuracy Audit | ✅ Complete |
| 11. Launch Prep & Rebrand | ✅ Complete |
| 12. V2/V3 UI Polish | ✅ Complete |
| 13. Social Profile Infrastructure | ✅ Complete |

---

## Agent Rules

**Do:** Mobile-first, Svelte 5 runes, dark mode support, use existing components, graceful error handling
**Don't:** Over-engineer, add unplanned features, use Docker for Supabase, throw errors that break pages

---

## Timeline

- 2025-12-15: Project created
- 2025-12-18: MVP complete
- 2025-12-20: All 58 peaks, auth, Peak Bagger
- 2025-12-21: Reviews, ranges, "My 58" dashboard
- 2025-12-24: Image gallery, weather, trail reports
- 2025-12-25: Achievements (23 badges)
- 2025-12-26: Leaderboard, public profiles, GPX trail mapping
- 2025-12-27: Parking, data audit (2024 NGS), rebrand Summit58 -> SaltGoat, UI polish
- 2025-12-28: Homepage storytelling, peak hero images
- 2025-12-30: GPX data removed (bad quality), import infrastructure created
- 2026-01-02: Social profile infrastructure, edit profile modal
- 2026-01-03: Profile tabs (Activity, Photos, Trips, Buddies), follow system
- 2026-02-28: All 58 peak hero images complete (optimized JPEG)
- 2026-03-07: Launch audit, monetization strategy, roadmap created
- 2026-03-08: Phase 3 (monetization stubs) + Phase 4 (sharing, watchlist, advanced stats, friends feed)
- 2026-03-08: Phase 5 (SEO structured data, learn guides, blog, sitemap, "Hikers Also Climbed")
- 2026-03-12: Phase 6 (UGC photo uploads, moderation, flagging, admin page, community guidelines)
- 2026-03-12: Phase 6b (photo categories + gallery filters)
- 2026-03-13: Phase 6c started (GPX trace infrastructure, post-login redirect for auth CTAs)
- 2026-03-14: Rebrand Cairn58 → SaltGoat (domain saltgoat.co), Plausible → Umami analytics
- 2026-03-25: Color palette refactor (warm gold accent, desaturated semantics)
- 2026-03-25: UI polish — dark mode logo, profile header redesign, gallery overlay fixes, range table fixes
- 2026-03-26: Admin dashboard — 5-tab nested routes (overview, moderation, users, content, subscriptions), centralized admin auth in admin.ts
- 2026-03-27: Monetization accuracy pass — removed photo upload limit for free users, fixed pricing page (removed "coming soon" + "priority support", added export), built Pro CSV export endpoint, added export button to profile
- 2026-03-27: Phase 9 (social engagement) — summit reactions (congrats) + summit comments on all activity feeds

---

## Related Docs

- [Quick Start](./session-start/README.md) - Fast agent onboarding
- [Stack & Infrastructure](./session-start/stack.md)
- [Database Schema](./session-start/database.md)
- [Code Patterns](./session-start/patterns.md)
