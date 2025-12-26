-- ========================================
-- ADD ELK MOUNTAINS PEAKS (5 additional)
-- Capitol Peak already exists
-- Sources: 14ers.com, peakbagger.com, USGS
-- ========================================

INSERT INTO peaks (name, slug, elevation, rank, range, latitude, longitude, nearest_town, national_forest, prominence_ft, description) VALUES

-- Castle Peak - Highest in Elk Mountains
('Castle Peak', 'castle-peak', 14265, 12, 'Elk Mountains', 39.0097, -106.8614,
 'Aspen', 'White River National Forest', 2385,
 'The highest peak in the Elk Mountains, Castle rises dramatically above the ghost town of Ashcroft. The northwest ridge route is the standard approach, offering Class 2 climbing with excellent views of the Maroon Bells-Snowmass Wilderness. Often climbed with neighboring Conundrum Peak.'),

-- Maroon Peak - The iconic "Deadly Bells"
('Maroon Peak', 'maroon-peak', 14156, 24, 'Elk Mountains', 39.0708, -106.9889,
 'Aspen', 'White River National Forest', 1196,
 'One of the famous Maroon Bells, this peak is both incredibly beautiful and dangerously loose. The sedimentary rock (Maroon Formation) is notoriously unstable. The south ridge route is Class 3 with objective hazards from rockfall. More people have died on the Bells than any other Colorado 14ers.'),

-- Pyramid Peak - Steep and technical
('Pyramid Peak', 'pyramid-peak', 14018, 47, 'Elk Mountains', 39.0714, -106.9500,
 'Aspen', 'White River National Forest', 1298,
 'A striking pyramid-shaped peak near the Maroon Bells. The northeast ridge is a demanding Class 4 climb with significant exposure. The approach through Crater Lake basin is scenic but the climbing is serious. One of Colorado''s more difficult 14ers.'),

-- North Maroon Peak
('North Maroon Peak', 'north-maroon-peak', 14014, 50, 'Elk Mountains', 39.0761, -106.9872,
 'Aspen', 'White River National Forest', 234,
 'The northern of the two Maroon Bells. Often climbed in combination with Maroon Peak via the exposed traverse. The loose rock and Class 4 terrain make this a serious undertaking. The bells are best admired from a distance - climbing them requires advanced skills and experience.'),

-- Snowmass Mountain
('Snowmass Mountain', 'snowmass-mountain', 14092, 32, 'Elk Mountains', 39.1189, -107.0664,
 'Aspen', 'White River National Forest', 2272,
 'A massive, remote peak with one of the largest summit areas of any Colorado 14er. The standard route via the east slopes involves a long approach through Snowmass Creek drainage. The peak holds large snowfields late into summer, giving it its name.'),

-- Conundrum Peak
('Conundrum Peak', 'conundrum-peak', 14060, 37, 'Elk Mountains', 39.0147, -106.8631,
 'Aspen', 'White River National Forest', 320,
 'A satellite peak of Castle often climbed together via the connecting ridge. The peak sits above the famous Conundrum Hot Springs. The Castle-Conundrum traverse is a moderate Class 2 scramble. Some debate whether Conundrum qualifies as a true 14er due to low prominence.');


-- ========================================
-- STANDARD ROUTES FOR ELK MOUNTAINS
-- ========================================

-- Castle Peak - Northwest Ridge (Class 2)
INSERT INTO routes (peak_id, name, slug, is_standard, distance_miles, elevation_gain_ft, difficulty_class, exposure, typical_time_hours, trailhead_name, trailhead_latitude, trailhead_longitude, trailhead_elevation, route_type, four_wd_required, description, gear_notes)
SELECT id, 'Northwest Ridge', 'northwest-ridge', true, 12.0, 4400, 2, 'Moderate', '7-10',
  'Castle Creek Trailhead', 39.0322, -106.8117, 9800, 'Out and back', false,
  'The standard route passes the historic ghost town of Montezuma before climbing through Conundrum Creek drainage. The northwest ridge offers Class 2 scrambling to the summit. The Castle-Conundrum traverse is a popular extension.',
  'The road to the trailhead is rough but usually 2WD accessible. Start early for the long day. The ghost town of Ashcroft is worth a visit.'
FROM peaks WHERE slug = 'castle-peak';

-- Maroon Peak - South Ridge (Class 3)
INSERT INTO routes (peak_id, name, slug, is_standard, distance_miles, elevation_gain_ft, difficulty_class, exposure, typical_time_hours, trailhead_name, trailhead_latitude, trailhead_longitude, trailhead_elevation, route_type, four_wd_required, description, gear_notes)
SELECT id, 'South Ridge', 'south-ridge', true, 10.0, 4400, 3, 'High', '8-12',
  'Maroon Lake Trailhead', 39.0989, -106.9389, 9580, 'Out and back', false,
  'WARNING: The Maroon Bells are extremely dangerous due to loose, rotten rock. The route climbs through Minnehaha Gulch before ascending the south ridge. Class 3 climbing on dangerously loose rock requires extreme caution. Rockfall is a constant hazard.',
  'HELMET MANDATORY. The rock on the Bells kills climbers regularly. Only attempt in perfect weather with dry conditions. Many experienced climbers choose to avoid this peak. Consider your skills honestly before attempting.'
FROM peaks WHERE slug = 'maroon-peak';

-- Pyramid Peak - Northeast Ridge (Class 4)
INSERT INTO routes (peak_id, name, slug, is_standard, distance_miles, elevation_gain_ft, difficulty_class, exposure, typical_time_hours, trailhead_name, trailhead_latitude, trailhead_longitude, trailhead_elevation, route_type, four_wd_required, description, gear_notes)
SELECT id, 'Northeast Ridge', 'northeast-ridge', true, 8.5, 4500, 4, 'High', '8-11',
  'Maroon Lake Trailhead', 39.0989, -106.9389, 9580, 'Out and back', false,
  'A challenging route with sustained Class 4 climbing and serious exposure. The route climbs through the Amphitheater before tackling the northeast ridge. The famous "Green Wall" section requires careful routefinding. Only for experienced climbers.',
  'Helmet required. Rope and harness recommended for less experienced parties. The exposure is significant - falls would be fatal. Check conditions before attempting - snow or ice makes this route extremely dangerous.'
FROM peaks WHERE slug = 'pyramid-peak';

-- North Maroon Peak - Northeast Ridge (Class 4)
INSERT INTO routes (peak_id, name, slug, is_standard, distance_miles, elevation_gain_ft, difficulty_class, exposure, typical_time_hours, trailhead_name, trailhead_latitude, trailhead_longitude, trailhead_elevation, route_type, four_wd_required, description, gear_notes)
SELECT id, 'Northeast Ridge', 'northeast-ridge', true, 10.0, 4600, 4, 'High', '9-12',
  'Maroon Lake Trailhead', 39.0989, -106.9389, 9580, 'Out and back', false,
  'Similar to Maroon Peak in its danger from loose rock. The northeast ridge involves Class 4 climbing on the infamous Maroon Formation. The traverse between the two Bells is extremely exposed and dangerous. Most climbers choose one Bell or the other.',
  'HELMET MANDATORY. Same warnings as Maroon Peak - the rock is terrible and unforgiving. The Bells have the highest fatality rate among Colorado 14ers. Do not underestimate these peaks.'
FROM peaks WHERE slug = 'north-maroon-peak';

-- Snowmass Mountain - East Slopes (Class 2)
INSERT INTO routes (peak_id, name, slug, is_standard, distance_miles, elevation_gain_ft, difficulty_class, exposure, typical_time_hours, trailhead_name, trailhead_latitude, trailhead_longitude, trailhead_elevation, route_type, four_wd_required, description, gear_notes)
SELECT id, 'East Slopes', 'east-slopes', true, 16.0, 5400, 2, 'Low', '10-14',
  'Snowmass Creek Trailhead', 39.1431, -107.0003, 8380, 'Out and back', false,
  'A long but moderate route through the scenic Snowmass Creek drainage. The approach to Snowmass Lake is popular with backpackers. From the lake, climb east slopes to the massive summit plateau. The distance makes this a long day or overnight trip.',
  'Most parties backpack to Snowmass Lake. The summit plateau can be confusing in fog. Large snowfields linger late - bring traction if climbing early season. One of the more remote 14ers.'
FROM peaks WHERE slug = 'snowmass-mountain';

-- Conundrum Peak - Via Castle (Class 2)
INSERT INTO routes (peak_id, name, slug, is_standard, distance_miles, elevation_gain_ft, difficulty_class, exposure, typical_time_hours, trailhead_name, trailhead_latitude, trailhead_longitude, trailhead_elevation, route_type, four_wd_required, description, gear_notes)
SELECT id, 'Via Castle Ridge', 'via-castle', true, 13.0, 4700, 2, 'Moderate', '8-11',
  'Castle Creek Trailhead', 39.0322, -106.8117, 9800, 'Out and back', false,
  'Most commonly climbed as an extension from Castle Peak. From Castle''s summit, descend the south ridge and follow the connecting ridge to Conundrum. The traverse is Class 2 with moderate exposure. The Conundrum Hot Springs make a tempting side trip.',
  'The Castle-Conundrum traverse adds about an hour to the Castle climb. Permits required for overnight camping at Conundrum Hot Springs. The hot springs are popular - expect crowds.'
FROM peaks WHERE slug = 'conundrum-peak';
