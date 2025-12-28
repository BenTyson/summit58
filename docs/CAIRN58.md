# Cairn58 - Full Reference

> **Quick start?** See [session-start/README.md](./session-start/README.md) for fast onboarding.

Comprehensive reference for Cairn58 development.

---

## Quick Reference

| Key | Value |
|-----|-------|
| **Stack** | SvelteKit 5 + Supabase (cloud) + Tailwind 3 + Railway |
| **Status** | All phases complete (Custom Domain, Advanced Search, Trail GPX) |
| **Dev** | `npm run dev` → http://localhost:4466 |
| **Prod** | https://cairn58.com |
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
- **profiles** - User profiles (extends auth.users) - display_name, avatar_url, bio, location
- **user_summits** - Summit logs (user_id, peak_id, date_summited, route_id, conditions, notes)
- **user_reviews** - Peak reviews (user_id, peak_id, rating 1-5, title, body, date_climbed, conditions)
- **user_achievements** - Earned achievements (user_id, achievement_id, earned_at, notified)
- **trail_reports** - Trail conditions (user_id, peak_id, hike_date, trail_status, snow_depth, hazards)

### RLS Policies
- Peaks/routes: public read
- Profiles: public read, users update own
- Summits: public read, users CRUD own
- Reviews: public read, users CRUD own (one review per peak)
- Achievements: public read, users insert own
- Trail reports: public read, users CRUD own

---

## Project Structure

```
src/lib/
├── components/
│   ├── ui/        → Container, Badge, AchievementIcon
│   ├── layout/    → Header, Footer, ThemeToggle
│   ├── peak/      → PeakCard, PeakHero, StatsBar, QuickFacts
│   ├── route/     → RouteCard
│   ├── summit/    → SummitButton, SummitModal (Peak Bagger)
│   ├── review/    → StarRating, ReviewCard, ReviewForm, ReviewSection
│   ├── trail/     → TrailReportForm, TrailReportCard
│   ├── parking/   → ParkingCard
│   ├── profile/   → Achievements
│   ├── gallery/   → ImageGallery, ImageUploader
│   ├── weather/   → WeatherCard
│   ├── map/       → PeakMap, TrailMap, ElevationProfile, TrailMapSection
│   └── search/    → SearchModal
├── data/
│   ├── ranges.ts      → Mountain range metadata
│   └── achievements.ts → 23 achievement definitions
├── server/
│   ├── supabase.ts     → SSR client
│   ├── peaks.ts        → Peak data queries
│   ├── summits.ts      → Summit CRUD + stats
│   ├── reviews.ts      → Review CRUD
│   ├── trailReports.ts → Trail report CRUD
│   ├── achievements.ts → Achievement checking + awarding
│   ├── leaderboard.ts  → Leaderboard aggregation
│   ├── images.ts       → Image gallery CRUD
│   ├── conditions.ts   → Weather fetch + queries
│   └── gpx.ts          → GPX to GeoJSON parsing
├── utils/
│   └── geo.ts          → Geographic utilities (distance, elevation)
└── types/database.ts → Generated types

src/routes/
├── +page.svelte              → Homepage
├── auth/+page.svelte         → Login/signup
├── peaks/+page.svelte        → All peaks (filterable)
├── peaks/[slug]/+page.svelte → Peak detail (reviews, trail reports, weather)
├── peaks/[slug]/[route]/     → Route detail (trail map + elevation profile + parking)
├── ranges/+page.svelte       → All mountain ranges
├── ranges/[slug]/+page.svelte → Range detail
├── leaderboard/+page.svelte  → Global rankings + activity
├── map/+page.svelte          → Full interactive map (peaks + trail overlay)
├── learn/parking/+page.svelte → Trailhead parking guide
├── users/[id]/+page.svelte   → Public user profile
└── profile/+page.svelte      → "My 58" dashboard + achievements

static/images/peaks/          → Custom peak images
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
- Interactive trail visualization on topographic maps (OpenTopoMap tiles)
- Trail polylines for all 58 peaks with difficulty-based coloring
- Canvas-based elevation profiles with hover interaction
- Synchronized hover between map and elevation chart
- Route detail pages: TrailMapSection with map + elevation profile
- Main map page: "Show Trails" toggle to display all trail overlays
- GeoJSON storage with elevation data at each waypoint
- Trailhead and summit markers with popup details

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

### Public User Profiles
- Viewable user profiles at `/users/[id]`
- Privacy toggle (is_public) for profile visibility
- Display name, bio, location, and summit stats
- Clickable usernames on leaderboard link to profiles

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
| Class 1-4 colors | `class-1` (green), `class-2` (blue), `class-3` (yellow), `class-4` (red) |
| Cards | `shadow-card`, `shadow-card-hover`, `shadow-card-elevated` |
| Glows | `shadow-glow-class-1` through `shadow-glow-class-4` |
| Animations | `animate-fade-in-up`, `animate-float`, `animate-pulse-subtle` |
| Gradients | `bg-gradient-to-r from-sunrise to-sunrise-coral` |
| Fonts | Display: Instrument Serif, Body: Inter |

Dark mode: `.dark` class on html element.

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

---

## Agent Rules

**Do:** Mobile-first, Svelte 5 runes, dark mode support, use existing components, graceful error handling
**Don't:** Over-engineer, add unplanned features, use Docker for Supabase, throw errors that break pages

---

## Session Log

- 2025-12-15: Project created
- 2025-12-18: MVP complete, Supabase cloud connected
- 2025-12-19: V2 UI, Railway deploy
- 2025-12-20: All 58 peaks added, QuickFacts component, parallax hero, content expansion schema
- 2025-12-20: User authentication, profiles table, Peak Bagger feature with summit logging
- 2025-12-21: "My 58" dashboard with grid visualization, progress tracking
- 2025-12-21: Mountain Ranges pages with rich metadata and user progress
- 2025-12-21: User Reviews system with star ratings, CRUD operations
- 2025-12-22: Fixed range detail page layout, review query error handling
- 2025-12-22: Created session-start/ quick reference docs
- 2025-12-24: Image Gallery with lightbox, Weather Conditions with 7-day forecast
- 2025-12-24: Trail Reports system with hazards, conditions, and crowd tracking
- 2025-12-25: Achievements system with 23 badges, database persistence
- 2025-12-26: V2 UI Polish - replaced emoji icons with custom SVG icons
- 2025-12-26: Leaderboard with global rankings and recent activity feed
- 2025-12-26: Public User Profiles with privacy toggle, clickable leaderboard links
- 2025-12-26: Trail GPX Mapping - interactive trail visualization on topographic maps
- 2025-12-26: Comprehensive trail geometry for all 58 peaks with elevation profiles
- 2025-12-27: Trailhead Parking feature - parking cards, trail report parking status, Learn page
- 2025-12-27: Data Accuracy Audit - comprehensive verification against 14ers.com
  - Peak data updated to 2024 NGS survey (14 elevation corrections, all 58 ranks)
  - Mt. Evans renamed to Mt. Blue Sky (2022 official name change)
  - Route data corrected: 9 difficulty class fixes (6 were underrated safety risk)
  - Trailhead coordinates verified and corrected for all 58 routes
  - Complete parking data added: fees, capacity, restrooms, cell service, arrival times
  - 8 high-priority alternate routes added (Longs, Elbert, Torreys, Quandary, Bierstadt)

---

## Related Docs

- [Quick Start](./session-start/README.md) - Fast agent onboarding
- [Stack & Infrastructure](./session-start/stack.md)
- [Database Schema](./session-start/database.md)
- [Code Patterns](./session-start/patterns.md)
