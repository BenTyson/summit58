# Mobile App Roadmap

## Architecture

**Decision:** React Native + Expo over Capacitor (WebView perf) and Flutter (Dart learning curve). Shared TS types + Supabase JS SDK + native maps/GPS/camera.

**Two codebases, one backend.** Web (SvelteKit) and mobile (Expo) share Supabase. Server modules in `src/lib/server/` accept `SupabaseClient<Database>` — portable to API endpoints. API at `/api/v1/` is the contract between platforms.

## Completed Phases

| Phase | What | Key Output |
|-------|------|------------|
| 0 | Web-side prep | `@saltgoat/shared` package, REST API layer, token-based auth (`requireAuth`), CORS |
| 1 | RN scaffold | Expo Router, NativeWind, 5-tab nav, Supabase client, AuthProvider, design tokens |
| 2 | Read-only features | Explore (search/filter), peak detail, native map (58 markers), weather, profile/stats |
| 3A | Authentication | Email/password, Google OAuth (expo-web-browser), Apple Sign In (native), sign-out, reset password |
| 3B | Summit logging | Quick Summit screen (GPS auto-detect, celebration overlay), summit CRUD API, PeaksProvider context, edit/delete from profile |
| 3C | Reviews + trail reports | Review modal (star rating, title, body), trail report modal (chip selectors, conditional snow depth, multi-select hazards), API endpoints, peak detail CTAs |
| 3D | Social features | Activity feed (Following/You tabs), public user profiles, follow/unfollow, summit reactions, comments bottom sheet, suggested climbers |
| 3E | Photo upload | `POST /api/v1/peaks/[slug]/images`, upload modal (camera/library, categories, progress bar), full-screen gallery viewer (pinch-to-zoom, swipe) |
| 4 | Offline-first | SQLite cache (3 tiers), sync outbox (summits/reviews/trail reports/photos), background prefetch (58 peak details + hero images), connectivity detection, offline UI (banner, sync badge, stale indicators, sync toast), storage management modal, auth cleanup on sign-out |

**Supabase config still needed:** Add `saltgoat://auth/callback` to redirect URLs, configure Google OAuth iOS client ID, enable Apple provider.

## Phase 5: Payments (2-3 sessions)

**RevenueCat** (`react-native-purchases`) for App Store + Google Play alongside existing Stripe web subscriptions. Apple requires IAP.

- Add `platform`, `app_store_transaction_id` columns to `user_subscriptions`
- RevenueCat webhooks update subscriptions
- `isPro()` check unchanged — works regardless of platform
- Paywall screen, restore purchases, manage subscription link

## Phase 6: App Store Submission (2-3 sessions)

- EAS Build for iOS + Android
- App icon (1024x1024), screenshots, description
- TestFlight beta (5-10 Colorado 14er testers)
- **Rejection traps:** unauthenticated browsing must work, IAP required (not Stripe), privacy policy in-app, location permission explained

## Phase 7: Mobile-Only Enhancements (Ongoing)

- Offline map tiles (Mapbox SDK, user-initiated download per peak/range, Pro feature)
- GPS tracking (live trace, auto-detect summit, save GPX)
- Push notifications (`expo-notifications`): achievements, trail reports, follower activity, weather alerts
- iOS widget (progress bar, next trip, weather)
- Haptic feedback (`expo-haptics`)
- Share branded summit card, import GPX from Strava/Gaia

## UX Requirements

**Field mode** (on mountain): no connectivity, gloved hands, bright sunlight, battery precious. Large tap targets, 2-tap summit logging, offline everything, high contrast, reduced animations.

**Home mode** (planning): full connectivity, rich browsing, social engagement, trip planning, photo management.

| Principle | Detail |
|-----------|--------|
| Summit logging | 2 taps max from any screen (center tab → confirm) |
| Offline indicators | Always visible, never hidden in settings |
| One-hand operation | Core field actions operable with one hand |
| Camera access | 1 tap from any peak screen |
| Pull-to-refresh | All list views |
| Bottom sheets | Contextual actions (map marker, quick options) |

**Colors:** Gold accent (#C8A55C) visible in sunlight. Dark mode for alpine starts. Class colors (sage/blue/ochre/brick) have outdoor contrast. Min 16px body text.

## Risks

| Risk | Mitigation |
|------|------------|
| Apple IAP rejection | RevenueCat (battle-tested), test on TestFlight early |
| Offline sync data loss | Summits are append-only (no conflict), thorough local persistence |
| Map tile storage | User chooses which peaks to download, show storage usage |
| JWT expires while offline | 7-day refresh window; queue actions, re-auth on return |
| Two-codebase maintenance | Shared types minimize drift, API layer = no duplicated business logic |

## Timeline Estimate

| Phase | Sessions | Milestone |
|-------|----------|-----------|
| ~~3C-3E~~ | ~~3-4~~ | ~~Feature-complete beta~~ (done) |
| ~~4~~ | ~~5~~ | ~~Field-testable beta~~ (done) |
| 5 | 2-3 | Monetization ready |
| 6 | 2-3 | **Public launch** |
| 7 | Ongoing | Enhancements |

Phase 4 complete. Field-testable beta reached. Offline map tiles (Mapbox) deferred to Phase 7. Next: Phase 5 (RevenueCat payments).
