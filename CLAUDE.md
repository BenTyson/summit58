# SaltGoat - Agent Guide

Colorado 14ers tracking app. Users log summits, write reviews, track progress across all 58 peaks.

## Stack

SvelteKit 5 (App Router) + Supabase (cloud) + Tailwind 3 + Railway

- **Dev:** `npm run dev` (localhost:4466)
- **Build:** `npm run build`
- **Deploy:** `railway up -d`
- **DB Push:** `supabase db push`
- **Gen Types:** `supabase gen types typescript --project-id seywnbufuewbiwoouwkk > src/lib/types/database.ts`

## Project Structure

```
src/lib/components/   UI components (peak/, profile/, map/, search/, etc.)
src/lib/server/       Server-side queries & mutations (peaks, summits, reviews, etc.)
src/lib/data/         Static data (ranges, achievements)
src/lib/utils/        Utilities (geo.ts)
src/lib/types/        Generated Supabase types
src/routes/           Pages & API endpoints
static/images/peaks/  Peak hero images (58 optimized JPEGs, NOT in Supabase storage)
supabase/migrations/  Database migrations (46+)
scripts/              Utility scripts (image optimization, GPX import)
```

## Key Patterns

- **Svelte 5 runes** throughout: `$props()`, `$state()`, `$derived()`
- **Server loads** in `+page.server.ts`, mutations via **form actions**
- **Custom SVG icons** (not Lucide) in `src/lib/components/ui/AchievementIcon.svelte`
- **Dark mode:** `.dark` class on `<html>`, all components support both themes
- **Design system:** `class-1`..`class-4` colors, `shadow-card` variants, Instrument Serif + Inter fonts
- **Auth:** `createSupabaseServerClient(cookies)` for server-side, email + Google OAuth
- **Images:** Sharp for optimization on upload, peak images served from `/images/peaks/`

## Database (Quick Ref)

Core: `peaks` (58), `routes` (66), `peak_conditions` (weather)
User: `profiles`, `user_summits`, `user_reviews`, `user_achievements`, `trail_reports`, `peak_images`, `user_follows`, `planned_trips`, `planned_trip_peaks`, `peak_watchlist`, `user_subscriptions`, `content_flags`
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
| `/admin` | Moderation dashboard (admin-only) |
| `/guidelines` | Community guidelines |

## Known Issues

- GPX trail data was REMOVED (bad data, only 7-25 points per route) -- no trails on map
- No rate limiting, no error monitoring (Sentry)
- Umami analytics configured (self-hosted on Railway)

## Build Notes

- PWA glob warning is harmless (ignore it)
- `semver` circular dependency warning in node_modules (harmless)
- API endpoints: `/api/webhooks/weather`, `/api/checkout`, `/api/portal`, `/api/webhooks/stripe` (last 3 are stubs)
- Admin check: hardcoded user ID in `src/lib/server/images.ts` (used for admin page gate + moderation)

## Deep Dive Docs

- [Database Schema](docs/session-start/database.md)
- [Code Patterns](docs/session-start/patterns.md)
- [Stack & Infrastructure](docs/session-start/stack.md)
- [Full Reference](docs/SALTGOAT.md)
- [Launch Roadmap](docs/ROADMAP.md)
