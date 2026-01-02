-- Fix Mt. Elbert Northeast Ridge trailhead coordinates
-- Correct location: North Mt. Elbert Trailhead near Halfmoon Creek
-- Source: 14ers.com, AllTrails, USFS

UPDATE routes
SET
  trailhead_latitude = 39.151644,
  trailhead_longitude = -106.412308
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'mt-elbert')
  AND name = 'Northeast Ridge';
