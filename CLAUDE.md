# SaltGoat - Agent Guide

Colorado 14ers tracking app. Users log summits, write reviews, track progress across all 58 peaks.

## Stack

**Web:** SvelteKit 5 + Supabase (cloud) + Tailwind 3 + Railway
**Mobile:** Expo SDK 55 + React Native + NativeWind + Expo Router
**Shared:** `@saltgoat/shared` monorepo package (types, data, utils)

- **Dev (web):** `npm run dev` (localhost:4466)
- **Dev (mobile):** `cd mobile && npx expo start` (iOS simulator)
- **Build:** `npm run build`
- **Deploy:** `railway up -d`
- **DB Push:** `supabase db push`
- **Gen Types:** `supabase gen types typescript --project-id seywnbufuewbiwoouwkk > src/lib/types/database.ts`

## Project Structure

```
src/lib/components/     UI components (peak/, profile/, map/, search/, admin/, etc.)
src/lib/server/         Server-side queries & mutations (peaks, summits, reviews, admin, etc.)
src/lib/data/           Static data (ranges, achievements) — re-exports from @saltgoat/shared
src/lib/utils/          Utilities (geo.ts) — re-exports from @saltgoat/shared
src/lib/types/          Generated Supabase types — re-exports from @saltgoat/shared
src/routes/             Pages & API endpoints
src/routes/api/v1/      REST API for mobile (peaks, profile, conditions)
src/routes/admin/       Admin dashboard (nested routes)
static/images/peaks/    Peak hero images (58 optimized JPEGs, NOT in Supabase storage)
supabase/migrations/    Database migrations (46+)
scripts/                Utility scripts
packages/shared/        @saltgoat/shared — types, data, utils shared between web + mobile
mobile/                 Expo/React Native mobile app
mobile/app/             Expo Router screens (tabs, stacks, modals)
mobile/components/      React Native components (peaks/, profile/, weather/, ui/)
mobile/lib/             Supabase client, API client, auth provider, theme
```

## Key Patterns

- **Svelte 5 runes** throughout: `$props()`, `$state()`, `$derived()`
- **Server loads** in `+page.server.ts`, mutations via **form actions**
- **Custom SVG icons** (not Lucide) in `src/lib/components/ui/AchievementIcon.svelte`
- **Dark mode:** `.dark` class on `<html>`, all components support both themes
- **Design system:** `class-1`..`class-4` colors, `shadow-card` variants, Instrument Serif + Inter fonts
- **Auth (web):** `createSupabaseServerClient(cookies)` for SSR pages, email + Google OAuth
- **Auth (API):** `createSupabaseApiClient(request)` extracts Bearer token, `requireAuth(request)` validates user — both in `src/lib/server/supabase.ts`
- **Images:** Sharp for optimization on upload, peak images served from `/images/peaks/`
- **API pattern:** endpoints at `/api/v1/` are thin wrappers around server modules. Public endpoints use anon client fallback; auth-required use `requireAuth`. CORS handled in `hooks.server.ts`

## Database (Quick Ref)

Core: `peaks` (58), `routes` (66), `peak_conditions` (weather)
User: `profiles`, `user_summits`, `user_reviews`, `user_achievements`, `trail_reports`, `peak_images`, `user_follows`, `planned_trips`, `planned_trip_peaks`, `peak_watchlist`, `user_subscriptions`, `content_flags`, `summit_reactions`, `summit_comments`
Storage buckets: `peak-images` (gallery, all authenticated users), `profile-images` (avatar/cover)
RLS: public read on most tables, users CRUD own data

See [docs/session-start/database.md](docs/session-start/database.md) for full schema.

## Key Routes

| Route | Purpose |
|-------|---------|
| `/` | Homepage |
| `/peaks` | Browse all 58 peaks |
| `/peaks/[slug]` | Peak detail (reviews, weather, trail reports) |
| `/peaks/[slug]/[route]` | Route detail (trail map, elevation, parking) |
| `/ranges`, `/ranges/[slug]` | Mountain ranges |
| `/map` | Interactive map |
| `/leaderboard` | Rankings + activity |
| `/profile` | User dashboard (tabs: activity, photos, trips, buddies) |
| `/users/[id]` | Public profiles |
| `/pricing` | Free vs Pro comparison |
| `/trips/[id]` | Public trip detail |
| `/auth` | Login/signup |
| `/learn/*` | Educational guides (first-fourteener, safety, gear, parking, difficulty-ratings, faq) |
| `/blog`, `/blog/*` | Blog hub + posts |
| `/admin` | Admin dashboard — overview (default tab) |
| `/admin/moderation` | Content moderation (flagged photos, flags, recent uploads) |
| `/admin/users` | User management (search, sort, pagination) |
| `/admin/content` | Content browser (photos, reviews, trail reports, traces) |
| `/admin/subscriptions` | Subscription metrics + user subscription table |
| `/guidelines` | Community guidelines |

## Known Issues

- GPX trail data was REMOVED (bad data, only 7-25 points per route) -- no trails on map
- No rate limiting, no error monitoring (Sentry)
- Umami analytics configured (self-hosted on Railway)

## Build Notes

- PWA glob warning is harmless (ignore it)
- `semver` circular dependency warning in node_modules (harmless)
- Social engagement: `summit_reactions` + `summit_comments` tables, server modules in `src/lib/server/reactions.ts` and `src/lib/server/comments.ts`, UI in `ActivityFeed.svelte` + public profile page
- **Web API endpoints:** `/api/webhooks/weather`, `/api/checkout`, `/api/portal`, `/api/webhooks/stripe` (last 3 are stubs), `/api/export/summits` (Pro-only CSV download)
- **Mobile API endpoints (v1):** `GET /api/v1/peaks` (all peaks + optional summitedPeakIds), `GET /api/v1/peaks/[slug]` (aggregated detail), `GET /api/v1/peaks/[slug]/conditions` (7-day weather), `GET /api/v1/profile` (auth-required, stats + summits + achievements + grid)
- Static image paths (`/images/peaks/...`) are resolved to absolute URLs via `url.origin` in v1 API responses (mobile has no same-origin)
- Admin check: centralized in `src/lib/server/admin.ts` — `isAdmin()` + `assertAdmin()` (hardcoded user ID, re-exported from `images.ts` for backward compat)
- Admin dashboard uses nested routes (not `?tab=` params) — each tab has its own `+page.server.ts` with scoped data loading and form actions
- Admin layout at `src/routes/admin/+layout.server.ts` handles auth guard once for all tabs

## Dual-Platform Development

SaltGoat is maintained as two systems: a **SvelteKit web app** and a **React Native (Expo) mobile app**, sharing a single Supabase backend. When building new features or fixing bugs:

- **New features** must be implemented on both platforms (or explicitly scoped to one with justification)
- **Bug fixes** affecting shared logic (API, database, subscriptions, achievements) must be verified on both platforms
- **Database migrations** affect both systems -- always consider mobile compatibility
- **API changes** (`/api/v1/`) must maintain backward compatibility with deployed mobile clients
- Keep the shared types package in sync when regenerating Supabase types

See [Mobile Roadmap](docs/mobile_roadmap.md) for the full mobile app plan and phase details.

## Deep Dive Docs

- [Database Schema](docs/session-start/database.md)
- [Code Patterns](docs/session-start/patterns.md)
- [Stack & Infrastructure](docs/session-start/stack.md)
- [Full Reference](docs/SALTGOAT.md)
- [Launch Roadmap](docs/ROADMAP.md)
- [Mobile Roadmap](docs/mobile_roadmap.md)
