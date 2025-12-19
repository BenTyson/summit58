# Summit58 - Session Start

> Read this first. Everything needed to continue development.

---

## Quick Context

| Field | Value |
|-------|-------|
| **Project** | Summit58 - Modern Colorado 14ers guide |
| **Stack** | SvelteKit 5 + Supabase (cloud) + Tailwind CSS 3 + Railway |
| **Status** | Phase 1 MVP Complete, Cloud DB Connected |
| **Dev Port** | 4466 |
| **Domain** | summit58.co |

---

## Supabase Cloud

| Item | Value |
|------|-------|
| Project Ref | `seywnbufuewbiwoouwkk` |
| Region | West US (Oregon) |
| Dashboard | https://supabase.com/dashboard/project/seywnbufuewbiwoouwkk |
| URL | `https://seywnbufuewbiwoouwkk.supabase.co` |

**CLI Commands (cloud-connected, no Docker needed):**
```bash
supabase login                    # Authenticate
supabase link --project-ref seywnbufuewbiwoouwkk
supabase db push                  # Push migrations
supabase gen types typescript --linked > src/lib/types/database.ts
```

---

## Running Locally

```bash
npm install
npm run dev    # http://localhost:4466
```

`.env` is configured for cloud Supabase.

---

## Project Structure

```
src/
├── lib/
│   ├── components/
│   │   ├── ui/           # Container, Badge
│   │   ├── layout/       # Header, Footer, ThemeToggle
│   │   ├── peak/         # PeakCard, PeakHero, StatsBar
│   │   └── route/        # RouteCard
│   ├── server/
│   │   ├── supabase.ts   # SSR client
│   │   └── peaks.ts      # Data queries
│   └── types/
│       └── database.ts   # Generated from Supabase
├── routes/
│   ├── +page.svelte              # Homepage
│   ├── peaks/+page.svelte        # All peaks list
│   ├── peaks/[slug]/+page.svelte # Peak detail
│   └── peaks/[slug]/[route]/     # Route detail
supabase/
├── migrations/00001_initial_schema.sql
└── seed.sql                      # 10 pilot peaks
```

---

## Database

**Tables:** `peaks`, `routes`

**Current Data:** 10 pilot peaks with standard routes
- Class 1: Quandary, Elbert, Grays, Handies
- Class 2: Bierstadt, Torreys, Democrat
- Class 3: Longs, Sneffels
- Class 4: Capitol

**RLS:** Public read access enabled.

---

## Design System

**Colors (CSS vars in app.css):**
- Primary: `--color-mountain-blue` (#1a365d)
- Accent: `--color-sunrise` (#ed8936)
- Class 1-4: green → blue → yellow → red

**Key Components:**
- `StatsBar` - 4-col grid: miles | gain | class | hours
- `PeakCard` - Card with gradient placeholder, stats, class badge
- `Badge` - Color-coded difficulty

**Dark mode:** Supported via `.dark` class.

---

## Implementation Phases

| Phase | Status | Focus |
|-------|--------|-------|
| 1. MVP | ✅ Complete | Core pages, 10 peaks, cloud DB |
| 2. Users | Next | Auth, peak tracking, conditions |
| 3. Content | Planned | All 58 peaks, PWA, printables |
| 4. Scale | Planned | Membership, weather, monetization |

---

## Agent Instructions

**Do:**
- Mobile-first, Svelte 5 runes (`$props()`, `$state()`)
- Use `src/lib/server/peaks.ts` for data queries
- Dark mode support in all UI

**Don't:**
- Over-engineer
- Add features outside current phase
- Use Docker for Supabase (cloud-connected mode)

**Patterns:**
```typescript
// +page.server.ts
export async function load({ cookies }) {
  const supabase = createSupabaseServerClient(cookies);
  return { peaks: await getAllPeaks(supabase) };
}
```

---

## Next Actions

1. Deploy to Railway
2. Add real peak images
3. Begin Phase 2: User auth + peak tracking

---

## Session Log

- **2025-12-15** - Project created, planning complete
- **2025-12-18** - Phase 1 MVP complete, cloud Supabase connected
