-- ========================================
-- CONTENT EXPANSION - Sprint 2
-- Add essential fields for richer peak content
-- ========================================

-- ======================
-- PEAKS TABLE ADDITIONS
-- ======================

-- Location context
ALTER TABLE peaks ADD COLUMN IF NOT EXISTS nearest_town TEXT;
ALTER TABLE peaks ADD COLUMN IF NOT EXISTS national_forest TEXT;

-- Key mountaineering stat
ALTER TABLE peaks ADD COLUMN IF NOT EXISTS prominence_ft INTEGER;

-- ======================
-- ROUTES TABLE ADDITIONS
-- ======================

-- Route type classification
ALTER TABLE routes ADD COLUMN IF NOT EXISTS route_type TEXT;
-- Values: 'Out and back', 'Loop', 'Traverse', 'Point to point'

-- Access requirements
ALTER TABLE routes ADD COLUMN IF NOT EXISTS four_wd_required BOOLEAN DEFAULT false;

-- ======================
-- ADD COMMENTS FOR DOCUMENTATION
-- ======================

COMMENT ON COLUMN peaks.nearest_town IS 'Nearest town for trip planning, e.g., "Leadville"';
COMMENT ON COLUMN peaks.national_forest IS 'National forest name, e.g., "San Isabel National Forest"';
COMMENT ON COLUMN peaks.prominence_ft IS 'Topographic prominence in feet - key mountaineering stat';

COMMENT ON COLUMN routes.route_type IS 'Route shape: Out and back, Loop, Traverse, Point to point';
COMMENT ON COLUMN routes.four_wd_required IS 'Whether 4WD/high-clearance vehicle is required to reach trailhead';
