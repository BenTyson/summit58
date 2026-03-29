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

**Supabase config still needed:** Add `saltgoat://auth/callback` to redirect URLs, configure Google OAuth iOS client ID, enable Apple provider.

## Phase 3D: Social Features

- `GET /api/v1/activity` — unified activity feed
- `GET /api/v1/users/[id]` — public user profile
- `POST/DELETE /api/v1/follows` — follow/unfollow
- Activity tab (currently placeholder), summit reactions, summit comments (bottom sheet), follow/unfollow, public user profiles

## Phase 3E: Photo Upload

- `POST /api/v1/peaks/[slug]/images` — wraps image upload pipeline
- `expo-image-picker` for camera/gallery, `expo-image-manipulator` for client-side resize (no Sharp on mobile)
- Category selection, caption, private/public toggle
- Upload progress indicator
- Full-screen gallery with swipe + pinch-to-zoom

## Phase 4: Offline-First (4-6 sessions)

The defining differentiator. Users on mountains with no cell service.

### Storage Tiers
| Tier | Data | Size |
|------|------|------|
| 1 (always cached) | 58 peaks + 66 routes + static data + hero images | ~21MB |
| 2 (synced on auth) | User summits, achievements, watchlist, profile | <15KB |
| 3 (on demand) | Weather (6hr), trail reports (4hr), reviews (12hr), thumbnails (30d) | Variable |
| 4 (selective) | Map tiles per peak (~4MB) or per range (~30-80MB) | User choice |

### Sync Engine (Outbox Pattern)
Local `sync_outbox` table, priority: watchlist > summits > trail reports > photos. Triggers: app foreground, connectivity change, 15min timer, pull-to-refresh.

### Offline Map Tiles
Mapbox SDK (first-class offline). User-initiated download per peak or range. Pro feature opportunity.

### Connectivity UI
"Offline Mode" banner, pending sync badge, stale data indicators, auto-sync toast on reconnection.

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
| 3C-3E | 3-4 | Feature-complete beta |
| 4 | 4-6 | Field-testable beta |
| 5 | 2-3 | Monetization ready |
| 6 | 2-3 | **Public launch** |
| 7 | Ongoing | Enhancements |

Phases 5 and 4 can run in parallel.
