-- Fix trailhead coordinates from GPX trail geometry
-- Many routes have trailhead_lat/lng incorrectly set to summit coords
-- The trail_geometry first point has correct trailhead location

-- Update trailhead coordinates from GPX first point
-- Only update where current trailhead is suspiciously close to summit
-- and GPX data exists with a reasonable distance from summit

UPDATE routes r
SET
  trailhead_latitude = (r.trail_geometry->'coordinates'->0->>1)::decimal,
  trailhead_longitude = (r.trail_geometry->'coordinates'->0->>0)::decimal
FROM peaks p
WHERE r.peak_id = p.id
  AND r.trail_geometry IS NOT NULL
  AND jsonb_array_length(r.trail_geometry->'coordinates') > 1
  -- Current trailhead is within 0.5 miles of summit (suspicious)
  AND sqrt(
    power(p.latitude - r.trailhead_latitude, 2) +
    power(p.longitude - r.trailhead_longitude, 2)
  ) * 69 < 0.5
  -- GPX start point is > 0.5 miles from summit (looks correct)
  AND sqrt(
    power(p.latitude - (r.trail_geometry->'coordinates'->0->>1)::decimal, 2) +
    power(p.longitude - (r.trail_geometry->'coordinates'->0->>0)::decimal, 2)
  ) * 69 > 0.5;

-- Manual fixes for routes with bad GPX data:

-- Elbert Northeast Ridge - Mt. Elbert Trailhead (from 14ers.com)
UPDATE routes
SET
  trailhead_latitude = 39.14056,
  trailhead_longitude = -106.40639
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'mt-elbert')
  AND name = 'Northeast Ridge';

-- Capitol Peak - Capitol Creek Trailhead (from 14ers.com)
UPDATE routes
SET
  trailhead_latitude = 39.15083,
  trailhead_longitude = -107.04389
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'capitol-peak')
  AND name = 'Northeast Ridge via Knife Edge';
