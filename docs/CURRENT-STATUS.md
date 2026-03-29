# Current Status

**Last Updated:** 2026-03-29
**Current Phase:** Mobile 4 — Offline-First (Not Started)
**What's Next:** Local caching (peaks, routes, user data), sync outbox for mutations, offline map tiles, connectivity UI

## What's Built

### Web (Complete — Phases 1-13)
All web features shipped. Outstanding: affiliate partnerships (Phase 7), notifications/email digests/rate limiting/a11y audit (Phase 8 fragments).

### Mobile

**Phase 0 — Web-side prep**
- `@saltgoat/shared` monorepo package (types, data, utils)
- REST API layer at `/api/v1/` with token-based auth (`requireAuth`), CORS

**Phase 1 — RN scaffold**
- Expo Router, NativeWind, 5-tab nav, Supabase client, AuthProvider, design tokens

**Phase 2 — Read-only features**
- Explore tab (search/filter), peak detail, native map (58 markers), weather, profile/stats

**Phase 3A — Authentication**
- Email/password, Google OAuth (expo-web-browser), Apple Sign In (native), sign-out, reset password

**Phase 3B — Summit logging**
- Quick Summit screen (GPS auto-detect, celebration overlay), summit CRUD API, PeaksProvider context, edit/delete from profile

**Phase 3C — Reviews + trail reports**
- `POST /api/v1/peaks/[slug]/reviews` — star rating, title, body, duplicate detection, achievement trigger
- `POST /api/v1/peaks/[slug]/trail-reports` — chip selectors (trail status, crowd, road), conditional snow depth, multi-select hazards, achievement trigger
- Interactive StarRating component (display + tap-to-rate modes)
- Peak detail CTAs: "Write a Review" (hidden if already reviewed), "Report Trail Conditions"
- Reviews/trail reports sections always visible (empty states when no content)

**Phase 3D — Social features**
- Activity feed with Following/You tabs, public user profiles, follow/unfollow system
- Summit reactions (congrats), comments bottom sheet, suggested climbers
- API endpoints: `/api/v1/activity`, `/api/v1/users/[id]`, `/api/v1/follows`, `/api/v1/reactions`, `/api/v1/comments`

**Phase 3E — Photo upload**
- `POST /api/v1/peaks/[slug]/images` — multipart/form-data upload, server-side Sharp optimization
- Upload modal: camera/library picker (expo-image-picker), image preview, caption, category chips (10 categories), private toggle
- Client-side resize via `expo-image-manipulator` (1600x1200, JPEG 0.8), XHR-based upload with progress bar
- Full-screen gallery viewer (react-native-image-viewing) — pinch-to-zoom, swipe between images, caption/category/uploader footer
- Peak detail: "Add a Photo" CTA, tappable thumbnails, photos section always visible, useFocusEffect refresh

Feature-complete beta milestone reached.

## Phase Summary

| Phase | Status |
|-------|--------|
| Mobile 0 (Web prep) | COMPLETE |
| Mobile 1 (Scaffold) | COMPLETE |
| Mobile 2 (Read-only) | COMPLETE |
| Mobile 3A (Auth) | COMPLETE |
| Mobile 3B (Summit logging) | COMPLETE |
| Mobile 3C (Reviews + trail reports) | COMPLETE |
| Mobile 3D (Social features) | COMPLETE |
| Mobile 3E (Photo upload) | COMPLETE |
| Mobile 4 (Offline-first) | NOT STARTED |
| Mobile 5 (Payments) | NOT STARTED |
| Mobile 6 (App Store) | NOT STARTED |

## Known Issues

- Supabase config needed: `saltgoat://auth/callback` redirect URL, Google OAuth iOS client ID, Apple provider
- GPX trail data removed (bad quality) — `routes.trail_geometry` empty
- No rate limiting on API endpoints
- No error monitoring (Sentry)
- Stripe integration stubbed
- Date inputs on mobile are plain TextInput (YYYY-MM-DD) — no native picker yet
