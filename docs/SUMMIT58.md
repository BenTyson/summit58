# Summit58 - Session Start

> Read this first. Everything needed to continue development.

---

## Quick Context

| Field | Value |
|-------|-------|
| **Project** | Summit58 - Modern Colorado 14ers guide |
| **Stack** | SvelteKit 5 + Supabase (cloud) + Tailwind CSS 3 + Railway |
| **Status** | V2 UI Polish Complete, Deployed to Production |
| **Dev Port** | 4466 |
| **Production** | https://summit58-production.up.railway.app |
| **Domain** | summit58.co (pending DNS config) |

---

## Railway Deployment

| Item | Value |
|------|-------|
| Project ID | `00b2ac99-4a09-4959-992f-169c7f981b96` |
| Service | `summit58` |
| Environment | `production` |
| URL | https://summit58-production.up.railway.app |

**CLI Commands:**
```bash
railway link -p 00b2ac99-4a09-4959-992f-169c7f981b96
railway service summit58
railway up -d                 # Deploy
railway logs                  # View logs
railway variables --kv        # Check env vars
```

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
│   ├── actions/
│   │   └── animate-on-scroll.ts  # IntersectionObserver animations
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
├── migrations/
│   ├── 00001_initial_schema.sql
│   └── 20241220000000_add_hero_images.sql
└── seed.sql                      # 10 pilot peaks
```

---

## Database

**Tables:** `peaks`, `routes`

**Current Data:** 10 pilot peaks with standard routes + hero images
- Class 1: Quandary, Elbert, Grays, Handies
- Class 2: Bierstadt, Torreys, Democrat
- Class 3: Longs, Sneffels
- Class 4: Capitol

**RLS:** Public read access enabled.

---

## Design System (V2)

**Colors:**
- Primary: `mountain-blue`, `mountain-navy`, `mountain-mist`
- Accent: `sunrise`, `sunrise-gold`, `sunrise-coral`
- Alpine: `alpine-pine`, `alpine-meadow`, `alpine-rock`
- Class 1-4: green → blue → yellow → red (with glow effects)

**Typography:**
- Display: Instrument Serif (headings, stats)
- Body: Inter

**Shadows:** `shadow-card`, `shadow-card-hover`, `shadow-card-elevated`, `shadow-glow-*`

**Animations:** `animate-fade-in-up`, `animate-float`, `animate-pulse-subtle`

**Key Components:**
- `StatsBar` - Glassmorphism, icons, gradient difficulty
- `PeakCard` - Color-coded border, rank badge, animated chevron
- `PeakHero` - Multi-layer gradients, sunrise glow
- `Badge` - Size variants, glow effects, animated dots

**Dark mode:** Supported via `.dark` class.

---

## Implementation Phases

| Phase | Status | Focus |
|-------|--------|-------|
| 1. MVP | ✅ Complete | Core pages, 10 peaks, cloud DB |
| 1.5 UI Polish | ✅ Complete | V2 design system, animations, hero images |
| 1.6 Deploy | ✅ Complete | Railway production deployment |
| 2. Users | Next | Auth, peak tracking, conditions |
| 3. Content | Planned | All 58 peaks, PWA, printables |
| 4. Scale | Planned | Membership, weather, monetization |

---

## Agent Instructions

**Do:**
- Mobile-first, Svelte 5 runes (`$props()`, `$state()`, `$derived()`)
- Use `src/lib/server/peaks.ts` for data queries
- Dark mode support in all UI
- Use V2 design system (glassmorphism, animations, glow effects)

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

1. Connect custom domain (summit58.co)
2. Begin Phase 2: User auth + peak tracking
3. Add remaining 48 peaks to database

---

## Session Log

- **2025-12-15** - Project created, planning complete
- **2025-12-18** - Phase 1 MVP complete, cloud Supabase connected
- **2025-12-19** - V2 UI Polish complete, hero images added, deployed to Railway
