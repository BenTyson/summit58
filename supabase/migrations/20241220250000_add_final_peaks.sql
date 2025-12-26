-- ========================================
-- ADD FINAL MISSING PEAK: North Eolus
-- Sources: 14ers.com, peakbagger.com, USGS
-- ========================================

INSERT INTO peaks (name, slug, elevation, rank, range, latitude, longitude, nearest_town, national_forest, prominence_ft, description) VALUES
('North Eolus', 'north-eolus', 14039, 43, 'San Juan Mountains', 37.6247, -107.6206,
 'Durango', 'San Juan National Forest', 159,
 'A subsidiary summit of Mt. Eolus in the Needles area of the Weminuche Wilderness. Climbed via the same Chicago Basin approach as Eolus, Windom, and Sunlight. The short traverse from Eolus makes this an easy add-on. Low prominence means some don''t count it as a separate 14er.');

-- North Eolus - Via Eolus (Class 3)
INSERT INTO routes (peak_id, name, slug, is_standard, distance_miles, elevation_gain_ft, difficulty_class, exposure, typical_time_hours, trailhead_name, trailhead_latitude, trailhead_longitude, trailhead_elevation, route_type, four_wd_required, description, gear_notes)
SELECT id, 'Via Eolus Traverse', 'via-eolus', true, 14.0, 5600, 3, 'Moderate', '10-14',
  'Needleton (train stop)', 37.6350, -107.6917, 8212, 'Out and back', false,
  'Usually climbed in combination with Mt. Eolus. From Eolus summit, traverse north along the ridge to North Eolus. Class 3 terrain with some exposure. The Chicago Basin approach via train is required.',
  'Same logistics as Eolus - train access, backpacking to Chicago Basin. The traverse adds minimal time if already on Eolus.'
FROM peaks WHERE slug = 'north-eolus';
