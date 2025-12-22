# Database Schema

[← Back to Quick Start](./README.md)

## Tables

### Core (Public Read)

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `peaks` | All 58 14ers | slug, name, elevation, rank, range, coordinates |
| `routes` | Climbing routes | peak_id, name, distance, elevation_gain, difficulty_class |

### User Data (RLS Protected)

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `profiles` | User profiles | user_id, display_name, avatar_url, bio |
| `user_summits` | Summit logs | user_id, peak_id, date_summited, route_id, conditions |
| `user_reviews` | Peak reviews | user_id, peak_id, rating (1-5), title, body |

## RLS Policies

| Table | Read | Write |
|-------|------|-------|
| peaks, routes | Public | Admin only |
| profiles | Public | Own only |
| user_summits | Public | Own only (CRUD) |
| user_reviews | Public | Own only (one per peak) |

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
| `src/lib/server/summits.ts` | Summit CRUD |
| `src/lib/server/reviews.ts` | Review CRUD |

---

See also: [Stack](./stack.md) | [Patterns](./patterns.md)
