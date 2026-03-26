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
| Primary accent | `accent` (warm gold), with `-light`, `-dark`, `-warm`, `-muted` variants |
| Semantic colors | `semantic-success` (sage), `semantic-danger` (brick), `semantic-warning` (ochre) — each with `-light`/`-dark` |
| Difficulty colors | `class-1` (muted sage), `class-2` (muted blue), `class-3` (muted ochre), `class-4` (muted brick) |
| Card shadows | `shadow-card`, `shadow-card-hover`, `shadow-card-elevated` |
| Glows | `shadow-glow-accent`, `shadow-glow-class-1` through `shadow-glow-class-4` |
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
| ImageGallery | `components/gallery/` | Photo grid + lightbox + category filter chips with counts |
| ImageUploader | `components/gallery/` | Photo upload (all users, private toggle) |
| SearchModal | `components/search/` | Global search (⌘K) |
| PeakMap | `components/map/` | Main map with peaks + trail overlay |
| TrailMap | `components/map/` | Route detail trail polyline |
| ElevationProfile | `components/map/` | Canvas-based elevation chart |
| TrailMapSection | `components/map/` | Combined map + elevation profile |
| Achievements | `components/profile/` | Badge system with SVG icons |
| ProfileHeader | `components/profile/` | Cover photo (full-bleed) + info panel below (no overlap), square avatar (rounded-2xl), social links |
| ProfileTabs | `components/profile/` | Tab navigation for profile sections |
| ProfileStats | `components/profile/` | Quick stats bar (peaks, progress) |
| EditProfileModal | `components/profile/` | Edit profile with image uploads |
| ActivityFeed | `components/profile/` | Timeline of summits, reviews, reports, achievements |
| ProfilePhotoGallery | `components/profile/` | User's uploaded photos grid |
| BuddiesTab | `components/profile/` | Following/followers + suggestions |
| TripsTab | `components/profile/` | Past trips + planned trips |
| CreateTripModal | `components/profile/` | Trip planning form |
| UserCard | `components/profile/` | User display with follow button |
| AchievementIcon | `components/ui/` | SVG icons for achievements |
| TrailReportForm | `components/trail/` | Submit trail conditions |
| TrailReportCard | `components/trail/` | Display trail reports |
| ParkingCard | `components/parking/` | Trailhead parking info |
| ShareButton | `components/ui/` | Native share / clipboard fallback |
| AdvancedStats | `components/profile/` | Pro stats: pace, seasonal, records, conditions |
| ReloadPrompt | `components/pwa/` | PWA update notification |
| WeatherCard | `components/weather/` | 7-day summit forecast |
| LearnHero | `components/learn/` | Hero banner for learn + blog pages |
| TopicCard | `components/learn/` | Card linking to learn guides |
| ContentSection | `components/learn/` | Themed content block for guides |
| TableOfContents | `components/learn/` | Sidebar/inline TOC for guides |
| CalloutBox | `components/learn/` | Warning/tip/info callout |

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
| `/profile?tab=activity` | Activity feed (summits, reviews, reports) |
| `/profile?tab=photos` | User's uploaded photos |
| `/profile?tab=trips` | Past + planned trips |
| `/profile?tab=buddies` | Following, followers, suggestions |
| `/users/[id]` | Public user profile |
| `/pricing` | Free vs Pro comparison |
| `/trips/[id]` | Public trip detail page |
| `/learn/parking` | Trailhead parking guide |
| `/learn/difficulty-ratings` | YDS difficulty rating guide |
| `/learn/faq` | FAQ (17 questions, 4 categories) |
| `/blog` | Blog hub |
| `/blog/welcome` | Welcome to SaltGoat post |
| `/blog/why-we-built-saltgoat` | Origin story post |
| `/admin` | Moderation dashboard (admin-only) |
| `/guidelines` | Community guidelines |
| `/auth` | Login/signup |

---

See also: [Stack](./stack.md) | [Database](./database.md)
