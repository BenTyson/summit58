# Code Patterns

[← Back to Quick Start](./README.md)

## Svelte 5 Runes

```typescript
// Props
let { peak, featured = false }: Props = $props();

// State
let count = $state(0);

// Derived (MUST use for prop-dependent values)
const difficultyClass = $derived(peak.standard_route?.difficulty_class ?? 1);

// Derived function (for dynamic lists)
const sortedPeaks = $derived(() => [...peaks].sort((a, b) => b.elevation - a.elevation));
```

## Server Load + Auth

```typescript
export async function load({ cookies }) {
  const supabase = createSupabaseServerClient(cookies);
  const { data: { session } } = await supabase.auth.getSession();
  return {
    peaks: await getAllPeaks(supabase),
    isLoggedIn: !!session
  };
}
```

## Form Actions

```typescript
export const actions: Actions = {
  logSummit: async ({ request, cookies }) => {
    const formData = await request.formData();
    // Handle submission
  }
};
```

## Design System

| Element | Classes |
|---------|---------|
| Difficulty colors | `class-1` (green), `class-2` (blue), `class-3` (yellow), `class-4` (red) |
| Card shadows | `shadow-card`, `shadow-card-hover`, `shadow-card-elevated` |
| Glows | `shadow-glow-class-1` through `shadow-glow-class-4` |
| Animations | `animate-fade-in-up`, `animate-float`, `animate-pulse-subtle` |

## Dark Mode

`.dark` class on `<html>` element. All components support both themes.

## Key Components

| Component | Location | Purpose |
|-----------|----------|---------|
| PeakCard | `components/peak/` | Peak list item |
| PeakHero | `components/peak/` | Peak detail header |
| SummitButton | `components/summit/` | Log summit CTA |
| ReviewSection | `components/review/` | Reviews display + form |
| ImageGallery | `components/gallery/` | Photo grid + lightbox |
| ImageUploader | `components/gallery/` | Admin photo upload |
| SearchModal | `components/search/` | Global search (⌘K) |
| PeakMap | `components/map/` | Main map with peaks + trail overlay |
| TrailMap | `components/map/` | Route detail trail polyline |
| ElevationProfile | `components/map/` | Canvas-based elevation chart |
| TrailMapSection | `components/map/` | Combined map + elevation profile |
| Achievements | `components/profile/` | Badge system with SVG icons |
| AchievementIcon | `components/ui/` | SVG icons for achievements |
| TrailReportForm | `components/trail/` | Submit trail conditions |
| TrailReportCard | `components/trail/` | Display trail reports |
| ParkingCard | `components/parking/` | Trailhead parking info |
| ReloadPrompt | `components/pwa/` | PWA update notification |
| WeatherCard | `components/weather/` | 7-day summit forecast |

## Key Routes

| Route | Purpose |
|-------|---------|
| `/peaks` | Browse all 58 peaks (66 routes including alternates) |
| `/peaks/[slug]` | Peak detail + trail reports + parking info |
| `/peaks/[slug]/[route]` | Route detail + trail map + elevation profile + parking card |
| `/ranges` | Browse by range |
| `/leaderboard` | Global rankings + activity feed |
| `/map` | Full interactive map (peaks + trail overlay toggle) |
| `/profile` | User dashboard + achievements |
| `/users/[id]` | Public user profile |
| `/learn/parking` | Trailhead parking guide |
| `/auth` | Login/signup |

---

See also: [Stack](./stack.md) | [Database](./database.md)
