-- Fix remaining trailhead coordinates for routes without GPX data
-- Coordinates sourced from 14ers.com, AllTrails, USFS

-- Mt. Sneffels - South Slopes (Yankee Boy Basin upper trailhead)
UPDATE routes
SET
  trailhead_latitude = 37.994874,
  trailhead_longitude = -107.784831
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'mt-sneffels')
  AND name = 'South Slopes';

-- Torreys Peak - Kelso Ridge (Stevens Gulch / Grays Peak Trailhead)
UPDATE routes
SET
  trailhead_latitude = 39.6608,
  trailhead_longitude = -105.7842
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'torreys-peak')
  AND name = 'Kelso Ridge';

-- Quandary Peak - West Ridge (McCullough Gulch Trailhead)
UPDATE routes
SET
  trailhead_latitude = 39.40108,
  trailhead_longitude = -106.0793
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'quandary-peak')
  AND name = 'West Ridge';

-- Mt. Bierstadt - Sawtooth Traverse (Guanella Pass - same as West Slopes)
UPDATE routes
SET
  trailhead_latitude = 39.5989,
  trailhead_longitude = -105.7053
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'mt-bierstadt')
  AND name = 'Sawtooth Traverse';

-- Handies Peak - Southwest Slopes (American Basin Trailhead)
UPDATE routes
SET
  trailhead_latitude = 37.920157,
  trailhead_longitude = -107.516
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'handies-peak')
  AND name = 'Southwest Slopes';
