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
| AdminTabs | `components/admin/` | Route-based tab nav for admin (uses `<a>` links, not `?tab=` params) |
| StatCard | `components/admin/` | Reusable metric card (value, label, variant color, optional link) |

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
| `/admin` | Admin dashboard — overview metrics (admin-only) |
| `/admin/moderation` | Flagged photos, content flags, recent uploads, resolved history |
| `/admin/users` | User list with search, sort, pagination, plan badges |
| `/admin/content` | Browse all UGC by type (photos, reviews, reports, traces) |
| `/admin/subscriptions` | Subscription metrics + breakdown table |
| `/guidelines` | Community guidelines |
| `/auth` | Login/signup |

## Mobile API Pattern

API endpoints at `src/routes/api/v1/` are thin wrappers around server modules:

```typescript
// Public endpoint (auth optional)
const { supabase: authClient } = createSupabaseApiClient(request);
const client = authClient || createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);
const peaks = await getAllPeaks(client);

// Auth-required endpoint (GET)
const { supabase, user, error } = await requireAuth(request);
if (!supabase) return new Response(JSON.stringify({ error }), { status: 401, ... });

// Auth-required endpoint (POST) — pattern for write endpoints
export const POST: RequestHandler = async ({ request }) => {
  const { supabase, user, error } = await requireAuth(request);
  if (!supabase || !user) return json({ error }, { status: 401 });
  const body = await request.json();
  // Call server module: createSummit(supabase, { user_id: user.id, ...body })
  // Trigger achievements: checkAndAwardAchievements(supabase, user.id, 'summit')
  return json({ data, newAchievements }, { status: 201 });
};
```

Static image paths (`/images/peaks/...`) must be resolved to absolute URLs in API responses:
```typescript
peak.hero_image_url = peak.hero_image_url ? `${url.origin}${peak.hero_image_url}` : null;
```

## Mobile Auth Pattern

`AuthProvider` at `mobile/lib/auth/AuthProvider.tsx` provides `useSession()`:

```typescript
const { user, loading, authError, signInWithEmail, signOut, clearError } = useSession();

// Auth gate for write-action screens (mirrors profile.tsx pattern)
if (!user) return <SignInPrompt />;

// API calls with auth (auto-includes Bearer token)
const result = await apiFetch<CreateSummitResponse>('/api/v1/summits', {
  method: 'POST',
  body: { peak_id, date_summited, conditions },
});

// File upload with FormData
const formData = new FormData();
formData.append('file', { uri, type: 'image/jpeg', name: 'photo.jpg' });
const result = await apiFetch('/api/v1/peaks/slug/images', { method: 'POST', formData });
```

OAuth flows: Google uses `expo-web-browser` + `supabase.auth.signInWithOAuth`, Apple uses native `expo-apple-authentication` + `supabase.auth.signInWithIdToken`. Deep link callback: `saltgoat://auth/callback`.

## Mobile Screen Pattern

```typescript
const [data, setData] = useState<ResponseType | null>(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

const load = useCallback(async () => {
  try {
    setError(null);
    const result = await apiFetch<ResponseType>('/api/v1/...');
    setData(result);
  } catch (e) {
    setError(e instanceof Error ? e.message : 'Failed to load');
  } finally { setLoading(false); }
}, []);

// Loading/error states use shared LoadingState/ErrorState components
// FlatList with pull-to-refresh (onRefresh + refreshing)
```

## Mobile Component Conventions

- `colors` from `@/lib/theme/colors` for programmatic styling
- `SymbolView` from `expo-symbols` for icons (SF Symbols on iOS)
- `SafeAreaView` from `react-native-safe-area-context` (not the deprecated RN one)
- Font families: `'InstrumentSerif'` (headings), `'Inter'`/`'Inter-Medium'`/`'Inter-SemiBold'`/`'Inter-Bold'` (body)
- Shared types from `@saltgoat/shared/types/helpers`, response types from `@/lib/types/api`
- Root layout wrapped in `GestureHandlerRootView` (required by `@gorhom/bottom-sheet`)

## Mobile Components

| Component | Location | Purpose |
|-----------|----------|---------|
| PeakCard | `mobile/components/peaks/` | Peak list card (thumbnail, name, elevation, class badge, checkmark) |
| RouteCard | `mobile/components/peaks/` | Route info (class, distance, gain, time) |
| ReviewCard | `mobile/components/peaks/` | Review display (stars, author, date, body) |
| TrailReportCard | `mobile/components/peaks/` | Trail report (status, crowd, snow, notes) |
| PeakBottomSheet | `mobile/components/map/` | Bottom sheet on map marker tap (peak info + View Details) |
| WeatherSection | `mobile/components/weather/` | Pill + horizontal forecast FlatList |
| CurrentConditionsPill | `mobile/components/weather/` | Today's temp/description/wind |
| ForecastCard | `mobile/components/weather/` | Single day forecast |
| StatsBar | `mobile/components/profile/` | Summit count, unique peaks, completion % |
| My58Grid | `mobile/components/profile/` | 6-column grid of all 58 peaks |
| AchievementBadge | `mobile/components/profile/` | Achievement badge display |
| SummitHistoryItem | `mobile/components/profile/` | Summit history row |
| ClassBadge | `mobile/components/ui/` | Difficulty class colored pill |
| LoadingState | `mobile/components/ui/` | Centered spinner with message |
| ErrorState | `mobile/components/ui/` | Error message with retry button |
| StarRating | `mobile/components/ui/` | 5-star display using SymbolView |

---

See also: [Stack](./stack.md) | [Database](./database.md)
