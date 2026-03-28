# SaltGoat Mobile App Roadmap

## Context

SaltGoat is a Colorado 14ers tracking web app (SvelteKit + Supabase + Tailwind, deployed on Railway). The goal is to build a native mobile app for iOS and Android alongside the existing webapp. The target audience -- Colorado hikers -- are often at 14,000ft with no cell service, making offline-first architecture critical. UI/UX is paramount; this needs to feel like a proper native outdoor app (comparable to AllTrails/Gaia GPS), not a wrapped website.

### Dual-Platform Mandate

SaltGoat is maintained as **two systems**: a SvelteKit web app and a React Native mobile app, sharing a single Supabase backend. After the mobile app is deployed:

- **New features** must be implemented on both platforms (or explicitly scoped to one with justification).
- **Bug fixes** that affect shared logic (API, database, subscriptions, achievements) must be verified on both platforms.
- **Database migrations** affect both systems -- always consider mobile compatibility.
- **API changes** must maintain backward compatibility with deployed mobile clients (versioned at `/api/v1/`).
- The shared types package is the contract between platforms -- keep it in sync when regenerating Supabase types.

### Current State (Strengths)
- Mature PWA setup (service worker, standalone manifest, workbox caching for maps/images)
- Mobile-first responsive design (44px tap targets, safe area padding, dark mode)
- Clean, typed Supabase data layer in `src/lib/server/*.ts` -- modular, one file per domain
- Supabase handles auth, DB (with RLS), and storage
- 58 peaks, 66 routes, social features, subscriptions, achievements all built

### Current State (Gaps for Mobile)
- No standalone REST API -- everything is SvelteKit form actions and `+page.server.ts` loads
- Auth is cookie-based (SSR) -- mobile needs token-based auth
- Image optimization uses Sharp (Node-only)
- Maps use Leaflet.js (web-only, poor performance in WebView)
- No offline data sync, no GPS integration, no push notifications
- Payments are Stripe-only (App Store requires IAP)

---

## Phase Review Process

Every phase must pass a review gate before being marked complete. The review is a technical check performed at the end of the phase:

1. **Build verification** -- `npm run build` passes for web; `eas build` (or local dev build) succeeds for mobile
2. **Type safety** -- No TypeScript errors across both codebases; shared types are in sync
3. **Functional review** -- Manually test all features added/changed in the phase, on both platforms where applicable
4. **Regression check** -- Verify existing features still work (especially web app after API/auth changes in Phase 0)
5. **Offline testing** (Phase 4+) -- Test with airplane mode enabled; verify sync on reconnection
6. **Edge cases** -- Test with: no auth, expired auth, free tier limits, slow/no network
7. **Code quality** -- No dead code, no TODO stubs shipped, no hardcoded secrets, no console.logs

A phase is not complete until the review passes. If issues are found, fix them within the same phase before proceeding.

---

## Technology Decision: React Native with Expo

**Recommended over Capacitor and Flutter.**

| Option | Pros | Cons | Verdict |
|--------|------|------|---------|
| **Capacitor** (wrap SvelteKit) | Fastest (~4-8 weeks), reuses existing components | WebView maps are slow, limited offline capability, cookie auth issues in WebView, feels like a wrapped website | Rejected -- UX is paramount, outdoor users compare against AllTrails |
| **Flutter** | Great native performance, single codebase | Dart is a new language, Supabase Flutter SDK less mature, smaller outdoor/mapping ecosystem | Deprioritized -- learning Dart doubles cognitive load for a solo dev |
| **React Native + Expo** | TypeScript (same as web), native maps/GPS/camera, best offline ecosystem, Supabase JS SDK works directly, Expo handles builds/TestFlight without Xcode | Separate codebase from SvelteKit, longer build time (~20-28 sessions) | **Recommended** -- best native UX, shared language/types, proven for outdoor apps |

**Key enablers:**
- All `src/lib/server/*.ts` query functions accept a `SupabaseClient` param -- portable to React Native
- `src/lib/types/database.ts` (generated Supabase types) shared directly
- Static data (`ranges.ts`, `achievements.ts`, `categories.ts`) and utils (`geo.ts`) are pure TS, zero framework deps
- Expo SDK provides: `expo-location`, `expo-sqlite`, `expo-camera`, `expo-secure-store`, `expo-notifications`, EAS Build

---

## Phase 0: Web-Side Preparation (3-5 sessions)

Prepare the shared backend so mobile can consume the same data/auth without duplicating business logic. **This work happens in the existing SvelteKit codebase.**

### 0A: Extract Shared Types and Data -- COMPLETE

`@saltgoat/shared` package at `packages/shared/` via npm workspaces. Web `src/lib/types/database.ts` re-exports from shared. Exports: `types/database`, `types/helpers`, `data/achievements`, `data/ranges`, `data/categories`, `utils/geo`, `utils/weather`, `constants`.

### 0B: Build REST API Layer -- PARTIAL (built incrementally with Phase 2)

Endpoints built so far (GET only, thin wrappers around server modules):

| Endpoint | Status | Notes |
|----------|--------|-------|
| `GET /api/v1/peaks` | DONE | All 58 peaks + optional summitedPeakIds with auth |
| `GET /api/v1/peaks/[slug]` | DONE | Aggregated: peak + reviews + images + conditions + trail reports + related peaks |
| `GET /api/v1/peaks/[slug]/conditions` | DONE | 7-day forecast, separate for refresh-on-demand |
| `GET /api/v1/profile` | DONE | Auth-required: stats + summits + achievements + grid data |

Remaining (needed for Phase 3 write operations and beyond):

| Endpoint | Methods | Phase |
|----------|---------|-------|
| `/api/v1/summits` | POST | Phase 3 |
| `/api/v1/summits/[id]` | PATCH, DELETE | Phase 3 |
| `/api/v1/peaks/[slug]/reviews` | POST | Phase 3 |
| `/api/v1/peaks/[slug]/trail-reports` | POST | Phase 3 |
| `/api/v1/peaks/[slug]/images` | POST | Phase 3 |
| `/api/v1/users/[id]` | GET | Phase 3 |
| `/api/v1/activity` | GET | Phase 3 |
| `/api/v1/follows` | POST, DELETE | Phase 3 |

### 0C: Token-Based Auth for Mobile -- COMPLETE

Added to `src/lib/server/supabase.ts`:
- `createSupabaseApiClient(request)` — extracts Bearer token, creates RLS-scoped client. Returns `{ supabase, error }` (null if no auth header).
- `requireAuth(request)` — validates token via `getUser()`, returns `{ supabase, user, error }`.
- CORS for `/api/v1/` handled in `src/hooks.server.ts` (preflight OPTIONS + response headers).

**Still needed (Supabase config):**
- Add mobile deep link scheme (`saltgoat://`) to allowed redirect URLs
- Configure Google OAuth with iOS/Android client IDs (separate from web)
- Set up Apple Sign In (required for App Store if any social login is offered)

### 0D: Image Upload Without Sharp

Mobile can't use Sharp. Options:
1. Client-side resize on mobile (`expo-image-manipulator`) before upload
2. Accept larger uploads with `X-Client-Optimized: true` header to skip Sharp step

**Recommendation**: Option 1. Keep Sharp for web, client-side resize for mobile.

### 0E: Rate Limiting and API Security

- Rate limiting on `/api/v1/` endpoints (currently missing per CLAUDE.md known issues)
- API versioning so future changes don't break deployed mobile clients
- Request validation

### Phase 0 Review Gate
- [x] API endpoints return correct JSON for authenticated and unauthenticated requests
- [x] Token-based auth works alongside existing cookie auth (no regression)
- [x] Web app `npm run build` passes, all existing features still work
- [x] Shared types package compiles independently
- [ ] Rate limiting confirmed on API endpoints (0E not started)
- [ ] Test with: expired token, missing token, malformed token

---

## Phase 1: React Native Project Scaffolding -- COMPLETE

Expo SDK 55 app at `/mobile/` with npm workspaces monorepo.

- Expo Router (file-based routing, typed routes), NativeWind v4
- Supabase client with `expo-secure-store` (`mobile/lib/supabase.ts`)
- AuthProvider with `useSession()` hook (`mobile/lib/auth/AuthProvider.tsx`)
- 5-tab nav: Explore, Map, Summit (center/gold), Activity, Profile
- Stack screens: `peaks/[slug]`, `users/[id]`, `trips/[id]`; modal group; auth group
- Fonts: Inter (4 weights) + Instrument Serif; SymbolView for icons
- Color tokens: `mobile/lib/theme/colors.ts`, shadows: `mobile/lib/theme/shadows.ts`

### Phase 1 Review Gate
- [x] Expo dev build runs on iOS simulator
- [x] Tab navigation works
- [x] Design system tokens match web
- [x] Supabase client connects and auth state persists
- [x] Shared types import correctly
- [ ] Dark mode toggles correctly (tokens exist, not fully wired)

---

## Phase 2: Core Features -- Read Only (3-4 sessions)

### 2A: Peak Browsing -- COMPLETE

**API:** `GET /api/v1/peaks` at `src/routes/api/v1/peaks/+server.ts`
- Returns all 58 peaks with standard route, ordered by rank
- Optional `?range=` and `?class=` server-side filters
- If authenticated: includes `summitedPeakIds[]`
- Resolves static image paths to absolute URLs via `url.origin`

**Mobile:** `mobile/app/(tabs)/index.tsx` (Explore tab)
- Search bar (client-side name filter), filter chips (class 1-4, 7 ranges)
- FlatList with PeakCard components, pull-to-refresh
- Checkmark overlay on summited peaks

**API:** `GET /api/v1/peaks/[slug]` at `src/routes/api/v1/peaks/[slug]/+server.ts`
- Aggregated: peak + reviews (limit 10) + review stats + images (limit 20) + conditions + trail reports + related peaks
- Gallery images via `getImageUrl()` (Supabase storage, already absolute)
- If authenticated: userSummits, userReview, isWatched

**Mobile:** `mobile/app/peaks/[slug]/index.tsx` (peak detail)
- Hero image, peak info header (name, elevation, range, rank, class badge)
- Sections: weather, routes, reviews, trail reports, photo gallery, related peaks, description
- All components: RouteCard, ReviewCard, TrailReportCard, PeakCard (reused)

### 2B: Native Maps -- NOT STARTED
- Library decision needed: `react-native-maps` vs Mapbox GL Native
- 58 peak markers, color-coded by difficulty class
- Map type switching, bottom sheet on marker tap, current location
- Can reuse `GET /api/v1/peaks` data (already has lat/lon)

### 2C: Weather Display -- COMPLETE

**API:** `GET /api/v1/peaks/[slug]/conditions` at `src/routes/api/v1/peaks/[slug]/conditions/+server.ts`
- 7-day forecast from `peak_conditions` table (populated by weather cron)
- Separate from peak detail for refresh-on-demand

**Mobile:** Embedded in peak detail screen
- `CurrentConditionsPill` — today's temp + description + wind, severity-colored background
- `ForecastCard` — single day: weekday, description, high/low, wind
- `WeatherSection` — container rendering pill + horizontal forecast FlatList
- Uses `weatherCodeToDescription()` and `degreesToCardinal()` from `@saltgoat/shared/utils/weather`

### 2D: User Profile and Stats -- COMPLETE

**API:** `GET /api/v1/profile` at `src/routes/api/v1/profile/+server.ts`
- Auth required (`requireAuth`)
- Returns: profile, summitStats, summits, achievements, uniquePeakIds, allPeaks (58 items for grid)

**Mobile:** `mobile/app/(tabs)/profile.tsx`
- Auth gate: sign-in prompt if not authenticated
- Cover image + avatar + display name + tagline + location
- StatsBar: summits count, unique peaks /58, completion %
- My58Grid: 6-column grid, gold fill for summited, gray for not
- Achievement badges (horizontal scroll)
- Summit history (SummitHistoryItem, navigates to peak detail)
- Additional stats: elevation gain, distance, highest peak, avg elevation

### Mobile Infrastructure Built

| File | Purpose |
|------|---------|
| `mobile/lib/api.ts` | `apiFetch<T>()` — shared fetch wrapper, auto Bearer token, 401 retry |
| `mobile/lib/types/api.ts` | Response interfaces for all 4 API endpoints |
| `mobile/components/ui/ClassBadge.tsx` | Difficulty class colored pill |
| `mobile/components/ui/LoadingState.tsx` | Centered spinner with message |
| `mobile/components/ui/ErrorState.tsx` | Error message with retry button |
| `mobile/components/ui/StarRating.tsx` | 5-star display using SymbolView |
| `mobile/components/peaks/PeakCard.tsx` | Peak list card (thumbnail, name, elevation, class badge, checkmark) |
| `mobile/components/peaks/RouteCard.tsx` | Route info (class, distance, gain, time) |
| `mobile/components/peaks/ReviewCard.tsx` | Review display (stars, author, date, body) |
| `mobile/components/peaks/TrailReportCard.tsx` | Trail report (status badge, crowd, snow, notes) |
| `mobile/components/weather/*.tsx` | WeatherSection, CurrentConditionsPill, ForecastCard |
| `mobile/components/profile/*.tsx` | StatsBar, My58Grid, AchievementBadge, SummitHistoryItem |

### Phase 2 Review Gate
- [x] All 58 peaks load and display correctly
- [x] Peak detail shows all sections with real data from API
- [ ] Map displays all 58 markers (2B not started)
- [x] Weather data displays and matches web
- [x] Profile displays correct stats for a test user
- [x] Pull-to-refresh works on all list screens
- [ ] Performance: peak list scrolls at 60fps, map pans smoothly (needs device testing)
- [ ] Test on both iOS and Android (needs device testing)

---

## Phase 3: Core Features -- Write Operations (3-4 sessions)

### 3A: Authentication
- Email/password login and signup
- Google OAuth via Expo AuthSession
- Apple Sign In (required for App Store)
- Password reset
- Persistent session via `expo-secure-store`
- Deep link callback (`saltgoat://auth/callback`)

### 3B: Summit Logging (Most Important Mobile Feature)

Port from `logSummit` action in `src/routes/peaks/[slug]/+page.server.ts`.

**"Quick Summit" in-the-field mode (center tab):**
1. GPS auto-detect nearest peak using `haversineDistance` from `geo.ts` (compare device coords against all 58 peaks). If within 500m: "Are you on [Peak Name]?"
2. Giant "I Summited!" button -- one tap minimum. Date auto-fills today.
3. Optional condition chips (large targets for gloved hands): Bluebird, Cloudy, Windy, Snow
4. Optional quick photo capture
5. Everything else (notes, times, party size, route) editable later
6. Post-summit: achievement toast + share prompt

### 3C: Reviews and Trail Reports
- Review form (rating, title, body)
- Trail report form (status, snow, crowd, hazards)
- Both work offline (queued for sync)

### 3D: Social Features
- Activity feed (port `ActivityFeed.svelte`)
- Summit reactions (congrats)
- Summit comments (bottom sheet on mobile)
- Follow/unfollow
- Public user profiles

### 3E: Photo Upload
- Native camera capture via `expo-image-picker` (not file picker)
- Client-side resize via `expo-image-manipulator`
- Category selection, caption, private/public toggle
- Upload progress indicator
- Full-screen gallery with swipe + pinch-to-zoom

### Phase 3 Review Gate
- [ ] Full auth flow works: signup, login, OAuth, password reset, persistent session
- [ ] Summit logged on mobile appears on web (and vice versa)
- [ ] Free tier limit enforced (5 summits), upgrade prompt shown
- [ ] Achievements trigger correctly after summit logging
- [ ] Reviews and trail reports created on mobile appear on web
- [ ] Photo upload from camera works, image appears in gallery on both platforms
- [ ] Social features work: follow, react, comment -- all visible cross-platform
- [ ] Test with: new user, free user at limit, Pro user

---

## Phase 4: Offline-First Architecture (4-6 sessions)

**The defining differentiator.** Users are on remote mountains with no cell service for hours.

### 4A: Local Database (SQLite via `expo-sqlite`)

**Tier 1 -- Always cached (first launch, ~21MB):**
- All 58 peaks + 66 routes (~80KB JSON)
- Static data (ranges, achievements, categories -- ~8KB)
- Peak hero images (58 JPEGs, ~18MB)
- Peak thumbnails (~3MB)

**Tier 2 -- User data (synced when authenticated):**
- User's summit history, achievements, watchlist, profile, subscription status (<15KB per user)

**Tier 3 -- Cached on demand (freshness-sensitive):**
- Weather forecasts (6hr freshness)
- Trail reports (4hr freshness)
- Reviews (12hr freshness)
- Gallery image thumbnails (30 days)

**Tier 4 -- Map tiles (selective download):**
- Per-peak: ~4MB per peak at zoom 10-17 (5km radius)
- Per-range: ~30-80MB per range
- All 58 peaks at zoom 10-15: ~50MB

### 4B: Sync Engine (Outbox Pattern)

All offline writes go into a local `sync_outbox` table with priority ordering:

1. Watchlist changes (smallest, <1KB)
2. Summit logs (~0.5KB each)
3. Trail reports (~1KB each)
4. Photos (large, background upload)

**Sync triggers:** app foreground + connectivity, connectivity change (offline->online), periodic 15min timer when active, manual pull-to-refresh.

**Conflict resolution:**
- Summit logged offline + subscription expired: accept summit, server validates. If rejected, show clear upgrade prompt. Store locally regardless.
- Duplicate summit (same peak/date): client dedup before sync, user merges.
- Trail reports: no conflict (not unique per peak+date).
- Watchlist: collapse toggles to final state.

### 4C: Offline Map Tiles

Use **Mapbox SDK** (first-class offline support) or MapLibre with MBTILES:
- User-initiated "Download for Offline" per peak (fetches zoom 10-17 tiles, ~4MB)
- "Range pack" download option (all peaks in a range)
- Pro feature opportunity: unlimited offline downloads

### 4D: Connectivity-Aware UI
- Persistent "Offline Mode" banner when no connectivity
- Pending sync badge on items ("3 summit logs pending sync")
- Stale data indicator ("Weather last updated 2 days ago")
- Auto-sync toast on reconnection

### Phase 4 Review Gate
- [ ] Enable airplane mode: peak browsing, map, weather (cached) all work
- [ ] Log summit in airplane mode, re-enable connectivity: summit syncs and appears on web
- [ ] Submit trail report offline: syncs correctly on reconnection
- [ ] Stage photo offline: uploads on reconnection
- [ ] Offline map tiles load for downloaded peak areas
- [ ] Stale data indicators show correct timestamps
- [ ] Sync outbox processes in correct priority order
- [ ] No data loss after: kill app while offline, relaunch with connectivity
- [ ] Storage usage is within estimates (~21MB base + user-selected tiles)
- [ ] Test conflict: log summit offline, expire subscription on web, reconnect -- verify graceful handling

---

## Phase 5: Payments and Monetization (2-3 sessions)

### 5A: Revenue Strategy

| Channel | Price | Platform Cut | Net |
|---------|-------|-------------|-----|
| Web (Stripe) | $29.99/yr | 0% | $29.99 |
| App Store Year 1 | $29.99/yr | 30% ($9.00) | $20.99 |
| App Store Year 2+ | $29.99/yr | 15% ($4.50) | $25.49 |

**Recommendation**: Use **RevenueCat** (`react-native-purchases`) to manage App Store + Google Play subscriptions alongside existing Stripe web subscriptions. Apple requires IAP for in-app subscriptions -- no way around this.

### 5B: Unified Subscription Backend
- Add columns to `user_subscriptions`: `platform` (web/ios/android), `app_store_transaction_id`, `google_play_token`
- RevenueCat webhooks update `user_subscriptions` via a new endpoint
- `isPro()` check in `subscriptions.ts` stays the same -- checks `plan === 'pro' && status === 'active'` regardless of platform

### 5C: Mobile Subscription UI
- Paywall screen with feature comparison
- Native App Store subscription sheet via RevenueCat
- Restore purchases flow
- Manage subscription (links to App Store settings)

### 5D: Mobile-Specific Pro Features to Consider
- Unlimited offline map downloads
- Background GPS tracking
- Advanced stats dashboard
- Export summit history

### Phase 5 Review Gate
- [ ] Sandbox IAP purchase flow works end-to-end on iOS and Android
- [ ] RevenueCat webhook updates `user_subscriptions` correctly
- [ ] `isPro()` returns true for both Stripe-subscribed and IAP-subscribed users
- [ ] Restore purchases works for previously subscribed users
- [ ] Free tier limits enforced identically on web and mobile
- [ ] Subscription purchased on web unlocks Pro on mobile (and vice versa)
- [ ] Web Stripe flow still works (no regression from adding `platform` column)
- [ ] Database migration is backward-compatible

---

## Phase 6: App Store Submission (2-3 sessions)

### 6A: App Store Assets
- App icon at 1024x1024 (adapt SaltGoat logo from existing `static/icons/`)
- Screenshots for iPhone 15 Pro Max, iPhone SE, iPad Pro
- App preview video (optional but high-impact for outdoor apps)
- Description, keywords, category (Navigation or Sports)

### 6B: TestFlight Beta
- Configure EAS Build for iOS
- Apple Developer account ($99/yr)
- Recruit 5-10 beta testers from Colorado 14er community
- **Critical: test offline scenarios on actual peaks**

### 6C: App Review -- Common Rejection Traps
- **Login required**: Peak browsing, weather, and map must work without auth
- **IAP**: Must use Apple IAP, not Stripe, for in-app subscriptions
- **Privacy policy**: Must be accessible within the app
- **Location permission**: Must clearly explain why GPS is needed
- **Minimum functionality**: Must be more than a wrapped website (it will be -- fully native)

### 6D: Google Play
- Google Play Developer account ($25 one-time)
- EAS Build for Android
- Signed AAB, store listing, submit

### Phase 6 Review Gate
- [ ] TestFlight build installs and runs on physical iPhone
- [ ] Google Play internal testing build installs on physical Android device
- [ ] All App Store rejection traps addressed (unauthenticated browsing works, IAP works, privacy policy accessible, location permission explained)
- [ ] Beta tester feedback incorporated (minimum 1 week of testing)
- [ ] At least one offline field test on an actual 14er
- [ ] Screenshots and metadata are accurate and polished
- [ ] App Store and Play Store listings match (consistent branding)

---

## Phase 7: Mobile-Only Enhancements (Ongoing)

### 7A: GPS Tracking
- Live GPS trace recording during hikes
- Auto-detect summit reached (within 100m of peak coords + elevation threshold)
- Save GPS trace as GPX (replaces manual GPX upload via `src/lib/server/traces.ts`)
- Background location with battery optimization

### 7B: Push Notifications (`expo-notifications`)
- Achievement earned
- Trail report on watched peak
- Follower summit activity
- Weather alert for planned trip peaks

### 7C: iOS Widget
- Progress bar (X/58 peaks)
- Next planned trip
- Weather for favorited peak

### 7D: Haptic Feedback (`expo-haptics`)
- Summit logged (success)
- Achievement earned (notification)
- Pull-to-refresh, tab switching

### 7E: Share & Import
- Share summit to social media with branded card
- Import GPX from Strava/Gaia GPS

---

## UX Philosophy for an Outdoor App

### Field Mode vs Home Mode

The app serves two contexts with very different constraints:

**Field (on the mountain):**
- No connectivity, possibly for hours
- Cold/gloved hands, one hand on trekking pole
- Bright sunlight or pre-dawn darkness
- Battery is precious
- **Design for**: large tap targets, minimal taps to log summit, offline everything, high contrast, reduced animations

**Home (planning/reviewing):**
- Full connectivity, comfortable setting
- Two hands, no time pressure
- **Design for**: rich browsing, social engagement, trip planning, photo management, stats review

### Key Interaction Principles

1. **Summit logging in 2 taps maximum** from any screen (center tab -> confirm)
2. **Offline indicators always visible** -- never hidden in settings
3. **One-hand operation** for core field actions
4. **Camera 1 tap away** from any peak screen
5. **Pull-to-refresh** on all list views
6. **Bottom sheets** for contextual actions (map marker tap, quick options)
7. **Swipe gestures** for common actions (react to summit, dismiss notification)
8. **Haptic confirmation** for all write actions

### Color/Typography Notes
- Warm gold accent (#C8A55C) is visible in sunlight
- Dark mode critical for alpine starts (3-4 AM)
- Difficulty class colors (sage/blue/ochre/brick) have sufficient contrast for outdoor use
- Minimum 16px body text for mobile readability
- Instrument Serif headings maintain premium outdoor brand feel

---

## Timeline Estimate

| Phase | Sessions | Dependencies | Milestone |
|-------|----------|-------------|-----------|
| **Phase 0**: Web-side prep | 3-5 | None | API layer available |
| **Phase 1**: RN scaffolding | 2-3 | Phase 0A (shared types) | Dev build running |
| **Phase 2**: Read-only features | 3-4 | Phase 0B (API), Phase 1 | Internal demo |
| **Phase 3**: Write + auth | 3-4 | Phase 2, Phase 0C (auth) | Feature-complete beta |
| **Phase 4**: Offline-first | 4-6 | Phase 3 | Field-testable beta |
| **Phase 5**: Payments | 2-3 | Phase 3 | Monetization ready |
| **Phase 6**: App Store | 2-3 | Phases 2-5 | **Public launch** |
| **Phase 7**: Enhancements | Ongoing | Phase 6 | Ongoing updates |

**Total to App Store launch: ~20-28 sessions**

Phases 2 and 3 can partially overlap. Phase 5 can begin in parallel with Phase 4.

---

## Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Apple rejects IAP implementation | Blocks launch | Use RevenueCat (battle-tested), test on TestFlight early |
| Offline sync loses data | User trust destroyed | Summit logs are append-only (user's own data = no conflict), thorough local persistence |
| Map tile storage exceeds device | Poor offline UX | User chooses which peaks to download, show storage usage |
| Supabase JWT expires while offline | Auth fails on reconnect | 7-day refresh token window; for longer trips, queue actions and re-auth on return |
| Maintaining two codebases as solo dev | Burnout/stall | Shared types/constants minimize drift, API layer = no duplicated business logic |
| React Native performance on old devices | Poor UX | Target iOS 16+ and Android 12+, test on low-end early |

---

## Critical Files Reference

| Purpose | File |
|---------|------|
| Auth client (extend for token auth) | `src/lib/server/supabase.ts` |
| Summit CRUD + stats (API + offline sync schema) | `src/lib/server/summits.ts` |
| Supabase generated types (share with mobile) | `src/lib/types/database.ts` |
| Peak detail form actions (10 actions, each needs API equivalent) | `src/routes/peaks/[slug]/+page.server.ts` |
| Subscription gating (must work same on web + mobile IAP) | `src/lib/server/subscriptions.ts` |
| Haversine distance (GPS peak detection) | `src/lib/utils/geo.ts` |
| Design system source (port to RN theme) | `tailwind.config.js`, `src/app.css` |
| Static data (share directly) | `src/lib/data/achievements.ts`, `ranges.ts`, `categories.ts` |
| Image optimization (Sharp, needs mobile alternative) | `src/lib/server/imageOptimizer.ts` |
| Current PWA config (reference for offline strategy) | `vite.config.ts` |
