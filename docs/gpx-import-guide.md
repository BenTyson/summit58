# GPX Import Guide

## Overview
This guide explains how to create accurate GPX trail data for Cairn58 using CalTopo.

## Legal Note
- **CalTopo traces using USGS base maps** = Public domain, safe to use
- **14ers.com GPX files** = Personal use only, requires written permission
- **AllTrails data** = ToS prohibits scraping, GPX is paid feature

## CalTopo Quick GPX Creation (Snap-to-Trail Method)

### Step 1: Open CalTopo
Go to **caltopo.com** and sign in (free account works)

### Step 2: Navigate to the trailhead
- Use the search box (top left) to search, e.g.: `Quandary Peak Trailhead, CO`
- Or paste coordinates directly

### Step 3: Select the right base layer
- Click **MapBuilder Topo** in the layer menu (right side)
- This shows trails clearly as dashed lines

### Step 4: Draw the route with snap-to-trail
1. Click **Add** → **Line**
2. **Important:** In the line dialog, check **"Snap to trails"** (or hold `T` while drawing)
3. Click on the **trailhead** (start point)
4. Click a few points **along the trail** - it will automatically follow the trail path
5. Click on the **summit** (end point)
6. Click **Save**

The snap-to-trail feature follows USFS/USGS trail data (public domain), so you're creating original work based on public data.

### Step 5: Export as GPX
1. Click **Export** (top menu)
2. Select **GPX**
3. Check the line you just created
4. Click **Download**
5. Save with naming convention: `{peak-slug}-{route-slug}.gpx`

## File Naming Convention

```
{peak-slug}-{route-slug}.gpx
```

Examples:
- `quandary-peak-east-ridge.gpx`
- `grays-peak-north-slopes.gpx`
- `mt-bierstadt-west-slopes.gpx`
- `mt-elbert-northeast-ridge.gpx`

## Import Process

### Single file:
```bash
node scripts/import-gpx.mjs data/gpx/quandary-peak-east-ridge.gpx
```

### All files in directory:
```bash
node scripts/import-gpx.mjs data/gpx/
```

## Validation Checks
The import script validates:
- Point count > 50 (warning if < 100)
- GPX distance within 25% of listed route distance
- Start point within 0.2mi of trailhead coordinates
- End point within 0.2mi of summit coordinates

## Priority Routes

| Route | Distance | Notes |
|-------|----------|-------|
| Quandary Peak - East Ridge | 6.8 mi | Popular beginner 14er |
| Grays Peak - North Slopes | 7.5 mi | Classic, often paired with Torreys |
| Mt. Bierstadt - West Slopes | 7.0 mi | Close to Denver, very popular |
| Mt. Elbert - Northeast Ridge | 9.5 mi | Highest peak in CO |
| Longs Peak - Keyhole Route | 14.5 mi | Iconic, technical |

## Troubleshooting

### "No matching route found"
- Check filename matches peak slug exactly
- Run `node scripts/import-gpx.mjs` with no args to see usage

### "Starts X mi from trailhead"
- GPX trace should start at the parking lot/trailhead
- Re-trace starting from the correct location

### "Only X points"
- Add more clicks along the trail when tracing
- Snap-to-trail should generate many points automatically
