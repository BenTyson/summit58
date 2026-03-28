# Stack & Infrastructure

[← Back to Quick Start](./README.md)

## Tech Stack

### Web
| Layer | Tech |
|-------|------|
| Framework | SvelteKit 5 |
| Database | Supabase (cloud) |
| Styling | Tailwind 3 |
| Maps | Leaflet + OpenTopoMap (topographic) |
| Weather | Open-Meteo API |
| Images | sharp (optimization on upload) |
| PWA | vite-plugin-pwa + Workbox |
| Hosting | Railway |
| Fonts | Instrument Serif + Inter |

### Mobile
| Layer | Tech |
|-------|------|
| Framework | React Native + Expo SDK 55 |
| Router | Expo Router (file-based) |
| Styling | NativeWind v4 (Tailwind for RN) + programmatic tokens |
| Auth | Supabase JS + expo-secure-store |
| Icons | expo-symbols (SF Symbols) |
| Maps | react-native-maps (Apple Maps, no API key) |
| Location | expo-location (foreground permission) |
| Bottom Sheet | @gorhom/bottom-sheet v5 (uses reanimated + gesture-handler) |
| Shared | @saltgoat/shared monorepo package |

### Shared
| Package | Exports |
|---------|---------|
| `@saltgoat/shared` | `types/database`, `types/helpers`, `data/achievements`, `data/ranges`, `data/categories`, `utils/geo`, `utils/weather`, `constants` |

## URLs

- **Dev (web):** http://localhost:4466
- **Dev (mobile):** Expo dev server (iOS simulator)
- **Prod:** https://saltgoat.co

## Commands

```bash
# Web development
npm run dev

# Mobile development
cd mobile && npx expo start

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
src/lib/server/         → Server-side queries (both web page loads + API endpoints call these)
src/lib/components/     → Svelte UI components
src/routes/             → Pages & API endpoints
src/routes/api/v1/      → REST API for mobile (peaks, profile, conditions)
static/images/peaks/    → Peak hero images (58 optimized JPEGs)
packages/shared/        → @saltgoat/shared (types, data, utils — used by both web + mobile)
mobile/                 → Expo/React Native mobile app
mobile/app/             → Expo Router screens (tabs, stacks, modals)
mobile/components/      → RN components (peaks/, profile/, weather/, ui/)
mobile/lib/             → Supabase client, API client, auth provider, theme tokens
supabase/migrations/    → DB migrations
```

## Scripts

| Script | Purpose |
|--------|---------|
| `scripts/optimize-peak-images.js` | Optimize peak images (PNG -> JPEG, resize to 1920px, ~90% size reduction) |
| `scripts/import-gpx.mjs` | Import GPX trail data into routes.trail_geometry |

---

See also: [Database](./database.md) | [Patterns](./patterns.md)
