# Database Schema

[← Back to Quick Start](./README.md)

## Tables

### Core (Public Read)

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `peaks` | All 58 14ers | slug, name, elevation, rank, range, coordinates |
| | | *Updated to 2024 NGS survey data; Mt. Evans → Mt. Blue Sky* |
| `routes` | 66 climbing routes | peak_id, name, distance, elevation_gain, difficulty_class, trail_geometry |
| | | *58 standard + 8 alternate routes (Longs, Elbert, Torreys, Quandary, Bierstadt)* |

### Parking Fields (routes table)

| Field | Type | Values |
|-------|------|--------|
| `parking_type` | text | free_lot, paid_lot, dispersed, pullout, permit_required, private_lot |
| `parking_capacity` | text | very_limited, limited, moderate, large, unlimited |
| `parking_fee_type` | text | free, paid_daily, paid_annual, permit_required |
| `parking_fee_amount` | decimal | Fee in USD (e.g., 8.00, 142.00, 150.00) |
| `shuttle_available` | boolean | TRUE if shuttle service exists |
| `shuttle_info` | text | Shuttle details and booking info |
| `recommended_arrival_time` | text | e.g., "Before 4:30 AM on weekends" |
| `parking_notes` | text | General parking information |
| `overflow_options` | text | Alternative parking when lot is full |
| `restroom_available` | boolean | TRUE if restrooms at trailhead |
| `cell_service` | text | none, weak, moderate, good |

### Trail Geometry (GeoJSON)

The `routes.trail_geometry` JSONB column stores trail paths:

```json
{
  "type": "LineString",
  "coordinates": [[lon, lat, elevation], ...],
  "properties": {
    "elevationGain": 4500,
    "elevationLoss": 152,
    "minElevation": 10080,
    "maxElevation": 14428,
    "totalDistanceMiles": 7.0
  }
}
```

### User Data (RLS Protected)

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `profiles` | User profiles | user_id, display_name, avatar_url, bio |
| `user_summits` | Summit logs | user_id, peak_id, date_summited, route_id, conditions |
| `user_reviews` | Peak reviews | user_id, peak_id, rating (1-5), title, body |
| `user_achievements` | Earned achievements | user_id, achievement_id, earned_at, notified |
| `trail_reports` | Trail conditions | user_id, peak_id, hike_date, trail_status, snow_depth, hazards |
| `peak_images` | Photo gallery | peak_id, storage_path, caption, display_order |

### Automated Data

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `peak_conditions` | 7-day weather | peak_id, forecast_date, temp, wind, precip, weather_code |

### Storage

| Bucket | Purpose | Access |
|--------|---------|--------|
| `peak-images` | Gallery photos | Public read, admin write |

## RLS Policies

| Table | Read | Write |
|-------|------|-------|
| peaks, routes | Public | Admin only |
| profiles | Public | Own only |
| user_summits | Public | Own only (CRUD) |
| user_reviews | Public | Own only (one per peak) |
| user_achievements | Public | Own only |
| trail_reports | Public | Own only |
| peak_images | Public | Admin only |

## Common Queries

```typescript
// Server-side client
import { createSupabaseServerClient } from '$lib/server/supabase';
const supabase = createSupabaseServerClient(cookies);

// Get all peaks with standard route
const { data } = await supabase
  .from('peaks')
  .select('*, routes!inner(*)')
  .order('rank');

// Get user's summits
const { data } = await supabase
  .from('user_summits')
  .select('*, peaks(*), routes(*)')
  .eq('user_id', userId);
```

## Server Modules

| File | Purpose |
|------|---------|
| `src/lib/server/peaks.ts` | Peak queries |
| `src/lib/server/summits.ts` | Summit CRUD + stats |
| `src/lib/server/reviews.ts` | Review CRUD |
| `src/lib/server/images.ts` | Image gallery CRUD |
| `src/lib/server/conditions.ts` | Weather fetch + queries |
| `src/lib/server/trailReports.ts` | Trail report CRUD |
| `src/lib/server/achievements.ts` | Achievement checking + awarding |
| `src/lib/server/leaderboard.ts` | Leaderboard aggregation |
| `src/lib/server/gpx.ts` | GPX to GeoJSON parsing |
| `src/lib/utils/geo.ts` | Geographic utilities (distance, elevation) |

## Webhooks

| Endpoint | Trigger | Purpose |
|----------|---------|---------|
| `/api/webhooks/weather` | cron-job.org (daily 6am MT) | Fetch 7-day forecast for all peaks |

---

See also: [Stack](./stack.md) | [Patterns](./patterns.md)
