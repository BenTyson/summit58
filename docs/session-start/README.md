# SaltGoat - Session Start Docs

> **Primary agent guide is now [CLAUDE.md](../../CLAUDE.md) at project root.**
> These docs provide deep-dive reference that CLAUDE.md links to.

## Current Status

Web app is live and feature-complete. Mobile app (React Native/Expo) is in active development.

**Mobile progress:** Phases 0-2 complete (shared types, REST API, scaffolding, read-only features, native maps). Phase 3A (authentication) complete. Phase 3B (summit logging) is next — the highest-value mobile feature.

See [Mobile Roadmap](../mobile_roadmap.md) for phase details and what's been built.

## What to Read

| Doc | When to read | Size |
|-----|-------------|------|
| [CLAUDE.md](../../CLAUDE.md) | Always — project overview, patterns, routes | ~130 lines |
| [Mobile Roadmap](../mobile_roadmap.md) | Working on mobile features | ~590 lines |
| [Database Schema](./database.md) | Touching tables, writing queries, API endpoints | ~170 lines |
| [Code Patterns](./patterns.md) | Writing web or mobile code — conventions, component inventory | ~210 lines |
| [Stack & Infrastructure](./stack.md) | Build/deploy questions, project IDs, directory layout | ~100 lines |
| [Full Reference](../SALTGOAT.md) | Deep dive on specific web features | ~420 lines |

## Key Context for Next Session

- **Phase 3B needs:** `POST /api/v1/summits` endpoint (wraps `createSummit` from `src/lib/server/summits.ts`), Quick Summit screen with GPS auto-detect (`haversineDistance` from `@saltgoat/shared/utils/geo`), summit-log modal, achievement toast
- **Server modules** accept `SupabaseClient<Database>` as first param — portable between web form actions and API endpoints
- **Free tier limit:** 5 summits (`canLogSummit` in `src/lib/server/subscriptions.ts`), enforced on both platforms
- **Native build:** Requires Xcode 26.4, `react-native-gesture-handler` 2.30.1. Build with `cd mobile && npx expo prebuild --clean && xcodebuild -workspace ios/SaltGoat.xcworkspace -scheme SaltGoat -sdk iphonesimulator build`
