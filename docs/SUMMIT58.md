# Summit58 - Full Reference

> **Quick start?** See [session-start/README.md](./session-start/README.md) for fast onboarding.

Comprehensive reference for Summit58 development.

---

## Quick Reference

| Key | Value |
|-----|-------|
| **Stack** | SvelteKit 5 + Supabase (cloud) + Tailwind 3 + Railway |
| **Status** | Phase 2 complete (Auth, Peak Bagger, Reviews, Ranges) |
| **Dev** | `npm run dev` → http://localhost:4466 |
| **Prod** | https://summit58-production.up.railway.app |
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
- **routes** - Climbing routes for each peak (distance, elevation gain, difficulty class, etc.)

### User Tables
- **profiles** - User profiles (extends auth.users) - display_name, avatar_url, bio, location
- **user_summits** - Summit logs (user_id, peak_id, date_summited, route_id, conditions, notes)
- **user_reviews** - Peak reviews (user_id, peak_id, rating 1-5, title, body, date_climbed, conditions)

### RLS Policies
- Peaks/routes: public read
- Profiles: public read, users update own
- Summits: public read, users CRUD own
- Reviews: public read, users CRUD own (one review per peak)

---

## Project Structure

```
src/lib/
├── components/
│   ├── ui/        → Container, Badge
│   ├── layout/    → Header, Footer, ThemeToggle
│   ├── peak/      → PeakCard, PeakHero, StatsBar, QuickFacts
│   ├── route/     → RouteCard
│   ├── summit/    → SummitButton, SummitModal (Peak Bagger)
│   └── review/    → StarRating, ReviewCard, ReviewForm, ReviewSection
├── data/
│   └── ranges.ts  → Mountain range metadata (descriptions, best season, etc.)
├── server/
│   ├── supabase.ts → SSR client
│   ├── peaks.ts    → Peak data queries
│   ├── summits.ts  → Summit CRUD operations
│   └── reviews.ts  → Review CRUD operations
└── types/database.ts → Generated types

src/routes/
├── +page.svelte              → Homepage
├── auth/+page.svelte         → Login/signup
├── peaks/+page.svelte        → All peaks (filterable)
├── peaks/[slug]/+page.svelte → Peak detail (with reviews)
├── peaks/[slug]/[route]/     → Route detail
├── ranges/+page.svelte       → All mountain ranges
├── ranges/[slug]/+page.svelte → Range detail (peaks in range)
└── profile/+page.svelte      → "My 58" dashboard

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
| 3. Image Gallery | 🔲 Next |
| 4. Topo Maps | 🔲 Planned |
| 5. Custom Domain (summit58.co) | 🔲 Planned |

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

---

## Related Docs

- [Quick Start](./session-start/README.md) - Fast agent onboarding
- [Stack & Infrastructure](./session-start/stack.md)
- [Database Schema](./session-start/database.md)
- [Code Patterns](./session-start/patterns.md)
