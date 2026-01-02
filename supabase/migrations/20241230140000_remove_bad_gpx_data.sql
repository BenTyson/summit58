-- Remove inaccurate GPX trail geometry data
-- All 66 routes have bad/incomplete GPX data (7-25 points instead of hundreds)
-- Hiding until accurate data can be imported from CalTopo traces
-- See docs/gpx-import-guide.md for import process

UPDATE routes
SET trail_geometry = NULL;

-- Add comment for future reference
COMMENT ON COLUMN routes.trail_geometry IS 'GeoJSON LineString with elevation. Import accurate GPX data using: node scripts/import-gpx.mjs data/gpx/';
