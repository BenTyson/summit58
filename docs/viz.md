# 3D Route Viewer — Implementation Plan

## Context

14ers.com has a 3D route flythrough built on Cesium.js + jQuery — functional but dated and clunky. SaltGoat will build a modern, owned equivalent using **MapLibre GL JS** (open-source) + **MapTiler** (free-tier terrain/satellite tiles). The goal is a cinematic 3D terrain viewer that's a genuine competitive differentiator — something that makes people share the page.

**Tech decisions:**
- **Renderer:** MapLibre GL JS (open-source, no vendor lock-in)
- **Tile provider:** MapTiler free tier (terrain DEM, satellite imagery, topo tiles — 100K tiles/month free, can self-host from USGS later)
- **Trail data:** CalTopo manual curation for 66 routes' GPX data
- **Platforms:** Web (SvelteKit) + Mobile (Expo/React Native) from the start
- **Leaflet:** Keep existing 2D maps. MapLibre is additive, not a replacement.

---

## Gating Strategy

Freemium — show the wow, gate the depth. The 3D viewer's biggest value is as a conversion engine. If free users never see it, it can't sell Pro. Follows the weather page pattern (`src/routes/peaks/[slug]/weather/+page.server.ts:56-63`).

| Feature | Free | Pro |
|---------|------|-----|
| 3D terrain + route line + orbit controls | Yes | Yes |
| Summit/trailhead/treeline markers | Yes | Yes |
| Elevation profile synced to 3D | Yes | Yes |
| Flythrough animation | 3-sec teaser, then upsell | Full playback + speed control |
| Camera presets (Bird's Eye, Hiker POV) | No | Yes |
| Community traces overlaid on 3D | No | Yes |
| Weather bands on terrain | No | Yes |
| Screenshot export / share link | No | Yes |

Free users get the full static 3D experience — the "holy shit" moment. They can orbit, zoom, see the route. But the cinematic flythrough (the thing they'll want most) gives them a 3-second taste then fades to an upsell.

Server-side gating: `isAdmin()` check, then `getSubscription()` + `isPro()`. Pass `isPro` boolean to client.

---

## UI/UX Vision

14ers.com feels like a GIS tool. SaltGoat should feel like a game engine cutscene.

**Design principles:**
- **Zero chrome.** Terrain fills the container. Controls are floating, minimal, semi-transparent glass-morphism. No toolbars, no panels.
- **Cinematic defaults.** Initial camera pitched 60 degrees, bearing auto-aligned to trail direction. Terrain exaggeration at 1.3x for drama without distortion.
- **Smooth everything.** All camera transitions use eased `flyTo()` animations. No snapping.
- **Dark mode native.** Dark mode switches to a dark topo base with muted satellite imagery — not just "same map but darker."
- **Progressive reveal.** Terrain loads progressively (low-res first, sharpens). Skeleton placeholder while MapLibre initializes.
- **Designed markers.** Treeline, crux, summit — each has a custom styled marker consistent with SaltGoat's design language (class colors, Instrument Serif labels). Not default pins.
- **Mobile-first touch.** Pinch to zoom, two-finger orbit, single-tap waypoint info. 44px minimum touch targets.

**Integration:** The 3D viewer lives inside the existing `TrailMapSection` via a 2D/3D toggle pill — not a separate page. The elevation profile stays visible and syncs bidirectionally.

---

## Upstream & Downstream Implications

### Upstream (must exist before 3D viewer works)
- **Trail data** — `routes.trail_geometry` is currently empty for all 66 routes. CalTopo sourcing is Phase 0 and the critical path blocker. GPX parser (`src/lib/server/gpx.ts`) and import script (`scripts/import-gpx.mjs`) are ready.
- **MapTiler API key** — Sign up, get key, add to env.

### Downstream (things the 3D viewer affects)
- **Route detail page** (`src/routes/peaks/[slug]/[route]/+page.server.ts`) — Needs `isPro` added to server load. Already loads traces + forecast.
- **Peak detail page** (`src/routes/peaks/[slug]/+page.svelte`) — Future: small auto-rotating 3D terrain preview as teaser.
- **Community traces** — Already loaded by route page (lines 41-52 of `+page.server.ts`). 3D viewer overlays them on terrain for Pro users.
- **Weather forecasts** — Already loaded by route page (lines 33-38). Elevation-banded data maps to colored terrain zones.
- **Subscription system** — New Pro gate on route page, following existing pattern.
- **Bundle size** — MapLibre GL JS ~200KB gzipped. Must be lazy-loaded via dynamic import only when user clicks "3D". Not in main bundle.
- **Mobile** — `@maplibre/maplibre-react-native` uses same style spec as web. Shared types go in `@saltgoat/shared`.
- **SEO** — 3D viewer is client-only (WebGL). Route page's existing SSR content provides SEO value. Add schema.org HikingTrail structured data.

---

## Phases

Each phase is an independent terminal session with clean context.

---

### Phase 0: Trail Data Pipeline

**Goal:** Populate `routes.trail_geometry` for 5-10 priority routes so the 3D viewer has data to render.

**Prerequisites:** Ben sources GPX files from CalTopo.

**Steps:**
1. Create GPX files from CalTopo for priority routes, save to `data/gpx/`
2. Review/update `scripts/import-gpx.mjs` if needed for current schema
3. Run import: `node scripts/import-gpx.mjs data/gpx/`
4. Verify `trail_geometry` is populated via Supabase query
5. Confirm existing 2D TrailMap renders the imported geometry on route detail pages

**Key files:**
- `scripts/import-gpx.mjs` — existing import script
- `src/lib/server/gpx.ts` — GPX parser (Douglas-Peucker simplification, elevation stats)
- `docs/gpx-import-guide.md` — CalTopo workflow reference

**Done when:** Route detail pages show 2D trail maps for imported routes.

---

### Phase 1: MapLibre Foundation + Static 3D Terrain

**Goal:** Install MapLibre, configure MapTiler, create the core `TerrainViewer3D.svelte` component that renders 3D terrain with a route line.

**Install:** `npm install maplibre-gl`

**Env:** Add `PUBLIC_MAPTILER_API_KEY` to `.env` and `.env.example`

**New files:**
| File | Purpose |
|------|---------|
| `src/lib/components/map/TerrainViewer3D.svelte` | Core 3D viewer component |
| `src/lib/components/map/terrain-styles.ts` | MapLibre style builder |

**TerrainViewer3D.svelte specs:**
- Dynamic import of `maplibre-gl` (client-only, same pattern as TrailMap.svelte)
- MapTiler terrain DEM source for 3D relief
- Satellite imagery base layer
- Route line as GeoJSON layer, colored by difficulty class (reuse colors from TrailMap.svelte)
- Summit + trailhead markers (reuse SVG patterns from TrailMap.svelte)
- Initial camera: pitched 60deg, bearing auto-aligned to trail direction
- Dark mode support (detect `.dark` class, switch tile style)
- Props: `trailGeometry`, `summitCoords`, `trailheadCoords`, `difficultyClass`, `peakName`, `routeName`, `hoveredIndex`, `onPointHover`, `isPro`

**terrain-styles.ts specs:**
- `buildTerrainStyle(apiKey, mode: 'light' | 'dark')` returns MapLibre StyleSpecification
- Terrain DEM config, satellite/topo layers, route line style, marker styles

**Modify:**
- `.env.example` — MapTiler key placeholder
- `vite.config.ts` — Add `maplibre-gl` to `optimizeDeps.include` if needed

**Manual steps:** See `docs/ben.md` > "3D Route Viewer (MapTiler)" for API key setup and GPX sourcing.

**Done when:** TerrainViewer3D renders 3D terrain with route line and markers. Orbit/zoom works. Dark mode works.

---

### Phase 2: Route Page Integration + View Toggle + Elevation Sync

**Goal:** Wire TerrainViewer3D into the route detail page with a 2D/3D toggle. Sync hover between elevation profile and 3D viewer.

**New files:**
| File | Purpose |
|------|---------|
| `src/lib/components/map/ViewModeToggle.svelte` | 2D/3D pill toggle |

**ViewModeToggle specs:**
- Props: `mode`, `onChange`, `loading3D`
- Style: rounded pill, accent color active state, matches existing map layer toggle

**Modify:**
- `src/lib/components/map/TrailMapSection.svelte` — The orchestrator
  - Add `viewMode` state (`'2d' | '3d'`)
  - Lazy-load TerrainViewer3D only when user clicks "3D"
  - Add ViewModeToggle to section header
  - Conditionally render TrailMap vs TerrainViewer3D
  - Pass same `hoveredIndex`/`onPointHover` to 3D viewer for elevation sync
  - Crossfade transition between views
- `src/lib/components/map/TerrainViewer3D.svelte` — Add hover interaction
  - `mousemove` on route line layer -> find closest trail coordinate -> call `onPointHover(index)`
  - When `hoveredIndex` changes externally -> move highlight marker on 3D route

**Done when:** Toggle between 2D/3D on route page. Hover syncs bidirectionally with elevation profile. 3D only loads when toggled (verify in network tab). Works on mobile viewport. Dark mode works for both views.

---

### Phase 3: Camera Controls, Waypoints, and Loading Polish

**Goal:** Add camera presets, auto-detected waypoint markers (treeline, crux, summit), progressive loading, WebGL fallback.

**New files:**
| File | Purpose |
|------|---------|
| `src/lib/components/map/camera-presets.ts` | Camera position computation |
| `src/lib/components/map/waypoint-utils.ts` | Auto-detect treeline, crux, summit |
| `src/lib/components/map/CameraControls.svelte` | Floating camera control buttons |
| `src/lib/utils/webgl.ts` | WebGL capability detection |

**camera-presets.ts specs:**
- `computeOverviewCamera(trailGeometry)` — pitched 50deg, full route visible
- `computeBirdsEyeCamera(trailGeometry)` — pitched 75deg, zoomed to midpoint
- `computeHikerPOVCamera(trailGeometry, pointIndex)` — pitched 70deg, bearing aligned to trail direction at point

**waypoint-utils.ts specs:**
- Treeline: coordinate closest to 11,400ft (standard Colorado treeline)
- Crux: steepest sustained section for Class 2+ routes (highest gradient over 0.1mi)
- Summit/trailhead: from existing data

**CameraControls.svelte specs:**
- Overview, Bird's Eye, Reset buttons
- Glass-morphism floating buttons, bottom-right
- 44px mobile touch targets

**webgl.ts specs:**
- `isWebGLSupported()` — hide 3D toggle if false
- `getGPUTier()` — reduce terrain quality on weak devices

**Modify:**
- `src/lib/components/map/TerrainViewer3D.svelte` — Camera presets, waypoint markers, loading skeleton, WebGL detection
- `src/lib/components/map/TrailMapSection.svelte` — Hide 3D toggle if WebGL unsupported

**Done when:** Camera presets animate smoothly. Waypoints at correct elevations. Skeleton during load. No-WebGL browsers see only 2D. Controls tappable on mobile.

---

### Phase 4: Pro Gating + Flythrough Animation

**Goal:** Build the flythrough camera animation (Pro), implement Pro/free gating on route page, create teaser + upsell UX.

**New files:**
| File | Purpose |
|------|---------|
| `src/lib/components/map/flythrough.ts` | Flythrough animation engine |
| `src/lib/components/map/FlythroughControls.svelte` | Playback UI |
| `src/lib/components/map/ProUpsellOverlay.svelte` | Upsell overlay for locked features |

**flythrough.ts specs:**
- `startFlythrough(options)` returns `{ stop, pause, resume }`
- Camera follows route coordinates via `requestAnimationFrame`
- Bearing auto-adjusts to face direction of travel (smoothed over next 5-10 points)
- Pitch 65-70deg, configurable altitude above terrain
- Progress callback syncs with elevation profile
- Cubic interpolation between points for smoothness

**FlythroughControls.svelte specs:**
- Play/Pause, speed selector (0.5x/1x/2x), progress bar, stop/exit
- Semi-transparent dark gradient at bottom

**ProUpsellOverlay.svelte specs:**
- Glass-morphism overlay, feature name, brief pitch, CTA to `/pricing`, dismiss
- Props: `feature: 'flythrough' | 'camera_modes' | 'traces_3d' | 'weather_3d'`

**Free user flythrough teaser:**
1. Play 3 seconds (~20 coordinates)
2. Smooth fade to semi-transparent upsell overlay
3. Camera returns to overview on dismiss

**Modify:**
- `src/routes/peaks/[slug]/[route]/+page.server.ts` — Add `isPro` to load return (follow weather page pattern at lines 56-63)
- `src/routes/peaks/[slug]/[route]/+page.svelte` — Pass `isPro` to TrailMapSection
- `src/lib/components/map/TrailMapSection.svelte` — Accept `isPro`, pass through
- `src/lib/components/map/TerrainViewer3D.svelte` — Flythrough integration, Pro gates
- `src/lib/components/map/CameraControls.svelte` — Lock icon on Pro-only presets

**Done when:** Pro users get full flythrough. Free users see teaser + upsell. Admin gets Pro. Flythrough syncs with elevation profile. `npm run build` passes.

---

### Phase 5: Community Traces + Weather Overlay on 3D (Pro)

**Goal:** Overlay community GPS traces and weather elevation bands on 3D terrain, both Pro-gated.

**New files:**
| File | Purpose |
|------|---------|
| `src/lib/components/map/weather-overlay.ts` | Weather band visualization |

**weather-overlay.ts specs:**
- `buildWeatherLayers(forecast, trailGeometry)` returns MapLibre layer specs
- Colored transparent zones at base/mid/summit elevation bands
- Blue tint for freezing, red/orange for high wind, gray for cloud cover
- Opacity 0.15-0.25 so terrain shows through

**Modify:**
- `src/lib/components/map/TerrainViewer3D.svelte`
  - Community traces: additional GeoJSON line layers, semi-transparent, contrasting colors. Active trace full opacity, others muted.
  - Weather overlay toggle
  - Both gated behind `isPro`
- `src/lib/components/map/TrailMapSection.svelte` — Pass `allTraces` and `forecast` to 3D viewer
- `src/lib/components/map/CameraControls.svelte` — Weather toggle, traces toggle

**Done when:** Pro users see traces + weather bands on 3D terrain. Toggles work. Free users see neither. Performance acceptable.

---

### Phase 6: Mobile 3D Viewer [COMPLETE]

**Goal:** Implement 3D terrain viewer in Expo/React Native using `@maplibre/maplibre-react-native`.

**Install:** `cd mobile && npx expo install @maplibre/maplibre-react-native`

**New files:**
| File | Purpose |
|------|---------|
| `mobile/components/map/TerrainViewer3D.tsx` | Native 3D viewer — MapTiler terrain DEM + satellite/topo, route line (ShapeSource + LineLayer), summit/trailhead markers, camera presets, flythrough animation, Pro teaser overlay, dark mode |
| `mobile/components/map/FlythroughControls.tsx` | Native playback controls — play/pause (SF Symbols via expo-symbols), progress bar, speed selector (0.5x/1x/2x), stop button |
| `src/routes/api/v1/peaks/[slug]/routes/[route]/+server.ts` | REST endpoint returning peak, route, and trail geometry (prefers community trace from `route_traces`, falls back to `routes.trail_geometry`) |

**Modified:**
- `packages/shared/src/types/helpers.ts` — Added `ViewerCameraPosition`, `ViewerWaypoint`, `TrailGeometry` shared types
- `mobile/lib/types/api.ts` — Added `RouteDetailResponse` type, re-exported `TrailGeometry`
- `mobile/app/peaks/[slug]/[route].tsx` — Full route detail screen with 2D/3D toggle, cached API fetch, trail stats in 2D mode
- `mobile/app/peaks/[slug]/index.tsx` — RouteCards now tappable, navigate to route detail
- `mobile/.env` / `mobile/.env.example` — Added `EXPO_PUBLIC_MAPTILER_API_KEY`
- `mobile/app.json` — Added `@maplibre/maplibre-react-native` config plugin, removed broken `react-native-purchases` plugin entry (SDK still works via auto-linking)

**Architecture notes:**
- Uses named imports from `@maplibre/maplibre-react-native` (`MapView`, `Camera`, `ShapeSource`, `LineLayer`, `PointAnnotation`) — not the deprecated default namespace
- `MapView` accepts `mapStyle` prop (JSON string), same tile URLs as web `buildTerrainStyle()`
- Camera ref typed as `CameraRef`, uses `setCamera()` with `CameraStop` shape (`zoomLevel`, `heading`, `pitch`, `centerCoordinate`)
- Flythrough uses `requestAnimationFrame` loop with cubic interpolation + smooth bearing — ported from web `flythrough.ts`
- Requires native build (`npx expo prebuild`, then `npx expo run:ios`) — not compatible with Expo Go

**Done:** 3D terrain renders in iOS simulator. Touch gestures work (native MapLibre). Route line visible. Flythrough for Pro. Camera presets (Overview, Bird's Eye). 2D/3D toggle.

---

### Phase 7: Performance, SEO, and Production Hardening

**Goal:** Bundle optimization, tile caching, SEO structured data, analytics.

**Tasks:**
- Verify MapLibre in separate chunk (not main bundle) via `npm run build`
- Add MapTiler tile domains to PWA workbox `runtimeCaching` in `vite.config.ts`
- Add schema.org `HikingTrail` structured data to route pages
- Track events: `3d_viewer_loaded`, `flythrough_started`, `flythrough_teaser_shown`, `pro_upsell_clicked`
- Reduce terrain quality on low-tier GPUs (from Phase 3 `getGPUTier()`)
- `<noscript>` fallback content

**Done when:** Lighthouse score stays high. Tiles cache in PWA mode. Build passes. Analytics fire.

---

### Phase 8 (Stretch): Peak Detail 3D Preview

**Goal:** Small auto-rotating 3D terrain preview on peak detail pages as teaser.

- 300px tall terrain view, no route line, just mountain + summit marker
- Auto-rotating (1 deg/sec bearing)
- Click navigates to standard route's detail with 3D active
- Reuse TerrainViewer3D with `preview` mode prop (no interaction, fixed camera, lower tile quality)

**Modify:** `src/routes/peaks/[slug]/+page.svelte`, `TerrainViewer3D.svelte`

---

## Cost Estimate

| Component | Monthly Cost |
|-----------|-------------|
| MapTiler free tier (terrain + satellite + topo) | $0 |
| MapLibre GL JS (open source) | $0 |
| GPX route data (CalTopo, one-time) | $0 |
| **Total at SaltGoat's current scale** | **$0** |

If traffic exceeds MapTiler's 100K tiles/month free tier: paid plans start at ~$25/month, or self-host from USGS data for $0.

---

## Reference: Existing Code to Reuse

| File | Reuse |
|------|-------|
| `src/routes/peaks/[slug]/weather/+page.server.ts:56-63` | Pro gating pattern |
| `src/lib/components/map/TrailMap.svelte` | Marker SVGs, difficulty colors, dynamic import pattern |
| `src/lib/components/map/ElevationProfile.svelte` | Hover sync interface (`hoveredIndex`, `onHover`) |
| `src/lib/server/gpx.ts` | Trail geometry types, `getCumulativeDistances()` |
| `src/lib/server/subscriptions.ts` | `isPro()`, `getSubscription()` |
| `src/lib/server/admin.ts` | `isAdmin()` |
| `src/lib/server/conditions.ts` | `getForecastForPeak()` — already called by route page |
| `src/lib/server/traces.ts` | `getBestTrace()`, `getTracesForRoute()` — already called by route page |
