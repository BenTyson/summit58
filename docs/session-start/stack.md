# Stack & Infrastructure

[← Back to Quick Start](./README.md)

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | SvelteKit 5 |
| Database | Supabase (cloud) |
| Styling | Tailwind 3 |
| Maps | Leaflet + OpenTopoMap (topographic) |
| GPX | @tmcw/togeojson + xmldom |
| Weather | Open-Meteo API |
| Images | sharp (optimization on upload) |
| PWA | vite-plugin-pwa + Workbox |
| Cron | cron-job.org |
| Hosting | Railway |
| Fonts | Instrument Serif + Inter |

## URLs

- **Dev:** http://localhost:4466
- **Prod:** https://saltgoat.co

## Commands

```bash
# Development
npm run dev

# Railway
railway up -d                 # Deploy
railway logs                  # View logs

# Supabase
supabase db push              # Push migrations
supabase gen types typescript --project-id seywnbufuewbiwoouwkk > src/lib/types/database.ts
```

## Project IDs

```bash
# Railway
railway link -p 00b2ac99-4a09-4959-992f-169c7f981b96

# Supabase
supabase link --project-ref seywnbufuewbiwoouwkk
```

## Key Directories

```
src/lib/components/   → UI components
src/lib/server/       → Server-side queries
src/routes/           → Pages & API
static/images/peaks/  → Peak hero images (58 optimized JPEGs)
supabase/migrations/  → DB migrations
scripts/              → Utility scripts
```

## Scripts

| Script | Purpose |
|--------|---------|
| `scripts/optimize-peak-images.js` | Optimize peak images (PNG -> JPEG, resize to 1920px, ~90% size reduction) |
| `scripts/import-gpx.mjs` | Import GPX trail data into routes.trail_geometry |

---

See also: [Database](./database.md) | [Patterns](./patterns.md)
