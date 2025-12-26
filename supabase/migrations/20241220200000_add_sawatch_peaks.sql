-- ========================================
-- ADD SAWATCH RANGE PEAKS (14 additional)
-- Mt. Elbert already exists
-- Sources: 14ers.com, peakbagger.com, USGS
-- ========================================

-- ========================================
-- PEAKS
-- ========================================

INSERT INTO peaks (name, slug, elevation, rank, range, latitude, longitude, nearest_town, national_forest, prominence_ft, description) VALUES

-- Mt. Massive - 2nd highest in CO
('Mt. Massive', 'mt-massive', 14428, 2, 'Sawatch Range', 39.1875, -106.4756,
 'Leadville', 'San Isabel National Forest', 1961,
 'Colorado''s second highest peak and a close neighbor to Mt. Elbert. The name is fitting - Massive has an enormous summit plateau spanning nearly a mile. The east slopes route is straightforward but long, making this a demanding day hike. Many debate whether Massive should be ranked #1 due to measurement variations.'),

-- Mt. Harvard - 3rd highest in CO
('Mt. Harvard', 'mt-harvard', 14420, 3, 'Sawatch Range', 38.9244, -106.3206,
 'Buena Vista', 'San Isabel National Forest', 2360,
 'The highest of the Collegiate Peaks and third highest in Colorado. Named after Harvard University, this peak dominates the skyline above the Arkansas River Valley. The south slopes route offers a challenging but non-technical climb with spectacular views of the surrounding Collegiate Peaks.'),

-- La Plata Peak - 5th highest
('La Plata Peak', 'la-plata-peak', 14336, 5, 'Sawatch Range', 39.0294, -106.4731,
 'Leadville', 'San Isabel National Forest', 1996,
 'A massive peak between Independence Pass and the Elbert/Massive group. The northwest ridge route provides one of the longer but more moderate climbs in the Sawatch. The peak offers excellent views of the Elbert-Massive massif to the north and the Collegiate Peaks to the south.'),

-- Mt. Antero - Known for gem hunting
('Mt. Antero', 'mt-antero', 14269, 10, 'Sawatch Range', 38.6742, -106.2461,
 'Buena Vista', 'San Isabel National Forest', 2029,
 'Famous for its aquamarine crystals, Antero is a favorite among rock hounds. The standard route via the west slopes is accessible by 4WD vehicle to 13,800 feet, making this one of the easiest 14er summits. Crystal collecting is popular along the upper slopes near the summit ridge.'),

-- Mt. Shavano
('Mt. Shavano', 'mt-shavano', 14229, 17, 'Sawatch Range', 38.6192, -106.2392,
 'Salida', 'San Isabel National Forest', 2149,
 'Named after a Ute chief, Shavano is often climbed together with neighboring Tabeguache Peak. The east slopes route climbs through forest before reaching the long summit ridge. The "Angel of Shavano" snow formation visible from the Arkansas Valley is an iconic spring sight.'),

-- Mt. Belford - Tallest of Missouri Basin peaks
('Mt. Belford', 'mt-belford', 14197, 19, 'Sawatch Range', 38.9608, -106.3606,
 'Buena Vista', 'San Isabel National Forest', 2037,
 'The highest peak in the Missouri Basin group, commonly climbed with Mt. Oxford. The northwest ridge offers a direct route from Missouri Gulch. The scenic approach passes old mining ruins and wildflower meadows before the final push to the summit.'),

-- Mt. Princeton - Hot springs nearby
('Mt. Princeton', 'mt-princeton', 14197, 20, 'Sawatch Range', 38.7492, -106.2422,
 'Buena Vista', 'San Isabel National Forest', 2037,
 'One of the most prominent peaks when viewed from the Arkansas Valley. The east slopes route is straightforward but the terrain is loose and requires careful footing. Mt. Princeton Hot Springs at the base makes for a perfect post-climb soak.'),

-- Mt. Yale
('Mt. Yale', 'mt-yale', 14196, 21, 'Sawatch Range', 38.8442, -106.3139,
 'Buena Vista', 'San Isabel National Forest', 1976,
 'Another of the Collegiate Peaks, Yale stands prominently between Harvard and Princeton. The southwest slopes route provides a moderate but scenic climb through Denny Creek drainage. The exposed summit offers panoramic views of the surrounding fourteeners.'),

-- Tabeguache Peak
('Tabeguache Peak', 'tabeguache-peak', 14155, 25, 'Sawatch Range', 38.6256, -106.2508,
 'Salida', 'San Isabel National Forest', 475,
 'Usually climbed in combination with Mt. Shavano via the connecting ridge. The name comes from a Ute band that once inhabited the region. The traverse between Shavano and Tabeguache involves mild Class 2 scrambling along an exposed but manageable ridge.'),

-- Mt. Oxford
('Mt. Oxford', 'mt-oxford', 14153, 26, 'Sawatch Range', 38.9647, -106.3383,
 'Buena Vista', 'San Isabel National Forest', 633,
 'Typically climbed as an add-on to Mt. Belford via the connecting ridge. The traverse requires dropping to a 13,500-foot saddle before the final push to Oxford''s summit. Standing alone, Oxford offers excellent views of the surrounding Collegiate Peaks.'),

-- Mt. Columbia
('Mt. Columbia', 'mt-columbia', 14073, 35, 'Sawatch Range', 38.9039, -106.2975,
 'Buena Vista', 'San Isabel National Forest', 893,
 'Often climbed in combination with Mt. Harvard via a demanding ridge traverse. The west slopes route provides a standalone option with less total elevation gain. Columbia is the southernmost peak in the Collegiate Peaks group visible from many Arkansas Valley viewpoints.'),

-- Missouri Mountain
('Missouri Mountain', 'missouri-mountain', 14067, 36, 'Sawatch Range', 38.9475, -106.3781,
 'Buena Vista', 'San Isabel National Forest', 927,
 'A rugged peak rising above Missouri Gulch, often climbed with Belford and Oxford for a three-peak day. The northwest ridge route involves Class 2 scrambling on loose rock. The peak offers stunning views into the glacial cirques of the Missouri Basin.'),

-- Mt. of the Holy Cross
('Mt. of the Holy Cross', 'mt-of-the-holy-cross', 14005, 52, 'Sawatch Range', 39.4667, -106.4817,
 'Minturn', 'White River National Forest', 2245,
 'Famous for the cross-shaped snow couloir visible from the east. This remote peak requires significant approach hiking with a major creek crossing. The north ridge route involves Class 2 climbing and a long day. The peak''s religious significance has made it a pilgrimage destination since the 1800s.'),

-- Huron Peak
('Huron Peak', 'huron-peak', 14003, 54, 'Sawatch Range', 38.9453, -106.4375,
 'Buena Vista', 'San Isabel National Forest', 2023,
 'A relatively gentle 14er accessed via the scenic Clear Creek drainage. The northwest slopes route follows mining roads before climbing through alpine terrain to the summit. Popular for its moderate difficulty and scenic approach through historic mining areas.');


-- ========================================
-- STANDARD ROUTES FOR SAWATCH PEAKS
-- ========================================

-- Mt. Massive - East Slopes (Class 2)
INSERT INTO routes (peak_id, name, slug, is_standard, distance_miles, elevation_gain_ft, difficulty_class, exposure, typical_time_hours, trailhead_name, trailhead_latitude, trailhead_longitude, trailhead_elevation, route_type, four_wd_required, description, gear_notes)
SELECT id, 'East Slopes', 'east-slopes', true, 14.0, 4500, 2, 'Low', '8-11',
  'Mt. Massive Trailhead', 39.1747, -106.3964, 10080, 'Out and back', false,
  'A long but moderate route that climbs through forest before traversing Massive''s enormous summit plateau. The trail is well-defined to treeline, then follows cairns across the alpine terrain. The plateau can be disorienting in fog - pay attention to your route.',
  'Bring plenty of water for this long hike. GPS recommended for navigating the summit plateau in poor visibility. Start early to avoid afternoon thunderstorms.'
FROM peaks WHERE slug = 'mt-massive';

-- Mt. Harvard - South Slopes (Class 2)
INSERT INTO routes (peak_id, name, slug, is_standard, distance_miles, elevation_gain_ft, difficulty_class, exposure, typical_time_hours, trailhead_name, trailhead_latitude, trailhead_longitude, trailhead_elevation, route_type, four_wd_required, description, gear_notes)
SELECT id, 'South Slopes', 'south-slopes', true, 14.0, 4500, 2, 'Low', '8-11',
  'North Cottonwood Trailhead', 38.8664, -106.2622, 9880, 'Out and back', false,
  'The standard route follows the North Cottonwood Creek drainage before turning up Horn Fork Basin. Above treeline, the route climbs moderate slopes to Harvard''s broad summit. The Harvard-Columbia ridge traverse is a popular extension for strong hikers.',
  'Long day - start early. The North Cottonwood Creek trail has multiple crossings that can be difficult during spring runoff. Bring trekking poles for stream crossings.'
FROM peaks WHERE slug = 'mt-harvard';

-- La Plata Peak - Northwest Ridge (Class 2)
INSERT INTO routes (peak_id, name, slug, is_standard, distance_miles, elevation_gain_ft, difficulty_class, exposure, typical_time_hours, trailhead_name, trailhead_latitude, trailhead_longitude, trailhead_elevation, route_type, four_wd_required, description, gear_notes)
SELECT id, 'Northwest Ridge', 'northwest-ridge', true, 9.0, 4500, 2, 'Low', '6-9',
  'La Plata Gulch Trailhead', 39.0269, -106.5136, 10000, 'Out and back', false,
  'The route climbs through La Plata Gulch before ascending the northwest ridge to the summit. Well-defined trail through forest gives way to alpine tundra and moderate Class 2 terrain near the top. The summit views are excellent.',
  'Steep sections near the summit require careful footing. The road to the trailhead crosses private property - stay on the road.'
FROM peaks WHERE slug = 'la-plata-peak';

-- Mt. Antero - West Slopes (Class 1)
INSERT INTO routes (peak_id, name, slug, is_standard, distance_miles, elevation_gain_ft, difficulty_class, exposure, typical_time_hours, trailhead_name, trailhead_latitude, trailhead_longitude, trailhead_elevation, route_type, four_wd_required, description, gear_notes)
SELECT id, 'West Slopes', 'west-slopes', true, 3.5, 1900, 1, 'Low', '2-4',
  'Baldwin Gulch Upper Trailhead', 38.6783, -106.2794, 12380, 'Out and back', true,
  'The high-altitude 4WD road allows access to a very short summit hike. The route follows an old mining road to the summit plateau. Crystal hunters often explore the upper slopes for aquamarine specimens. Easy hiking with minimal elevation gain from the upper trailhead.',
  'High-clearance 4WD absolutely required for the upper trailhead. 2WD parking adds 4+ miles each way. Respect mineral collecting rules - no powered tools allowed. Popular with rock hounds.'
FROM peaks WHERE slug = 'mt-antero';

-- Mt. Shavano - East Slopes (Class 2)
INSERT INTO routes (peak_id, name, slug, is_standard, distance_miles, elevation_gain_ft, difficulty_class, exposure, typical_time_hours, trailhead_name, trailhead_latitude, trailhead_longitude, trailhead_elevation, route_type, four_wd_required, description, gear_notes)
SELECT id, 'East Slopes', 'east-slopes', true, 10.0, 4600, 2, 'Low', '6-9',
  'Blank Gulch Trailhead', 38.6111, -106.1942, 9700, 'Out and back', false,
  'The route climbs through forest before reaching the east slopes. Moderate Class 2 terrain leads to the long summit ridge. Many hikers continue to Tabeguache Peak via the connecting ridge for a two-summit day.',
  'The Shavano-Tabeguache traverse adds 2 miles and 1000+ feet of additional gain. Start early for the combo climb. Trail can be faint in sections - follow cairns above treeline.'
FROM peaks WHERE slug = 'mt-shavano';

-- Mt. Belford - Northwest Ridge (Class 2)
INSERT INTO routes (peak_id, name, slug, is_standard, distance_miles, elevation_gain_ft, difficulty_class, exposure, typical_time_hours, trailhead_name, trailhead_latitude, trailhead_longitude, trailhead_elevation, route_type, four_wd_required, description, gear_notes)
SELECT id, 'Northwest Ridge', 'northwest-ridge', true, 8.0, 4400, 2, 'Low', '5-8',
  'Missouri Gulch Trailhead', 38.9856, -106.3606, 9760, 'Out and back', false,
  'A scenic route through Missouri Gulch with mining history and wildflowers. The northwest ridge rises steadily to Belford''s summit. The Belford-Oxford traverse is a popular extension, dropping to the saddle before climbing Oxford.',
  'The Missouri Basin is popular - parking fills early on weekends. The Belford-Oxford combo is a great two-peak day. Missouri Mountain can be added for ambitious hikers.'
FROM peaks WHERE slug = 'mt-belford';

-- Mt. Princeton - East Slopes (Class 2)
INSERT INTO routes (peak_id, name, slug, is_standard, distance_miles, elevation_gain_ft, difficulty_class, exposure, typical_time_hours, trailhead_name, trailhead_latitude, trailhead_longitude, trailhead_elevation, route_type, four_wd_required, description, gear_notes)
SELECT id, 'East Slopes', 'east-slopes', true, 7.5, 4200, 2, 'Low', '5-7',
  'Mt. Princeton Trailhead', 38.7447, -106.1928, 8900, 'Out and back', false,
  'The standard route climbs steep forested slopes before reaching alpine terrain. The upper mountain is loose talus requiring careful footing. Views of the Arkansas Valley are excellent throughout. Mt. Princeton Hot Springs at the base offers post-hike relaxation.',
  'The loose rock on upper slopes is tiring - bring trekking poles. The hot springs nearby make this a popular choice for post-hike recovery.'
FROM peaks WHERE slug = 'mt-princeton';

-- Mt. Yale - Southwest Slopes (Class 2)
INSERT INTO routes (peak_id, name, slug, is_standard, distance_miles, elevation_gain_ft, difficulty_class, exposure, typical_time_hours, trailhead_name, trailhead_latitude, trailhead_longitude, trailhead_elevation, route_type, four_wd_required, description, gear_notes)
SELECT id, 'Southwest Slopes', 'southwest-slopes', true, 9.0, 4300, 2, 'Low', '6-8',
  'Denny Creek Trailhead', 38.8175, -106.3133, 9900, 'Out and back', false,
  'The route follows Denny Creek before climbing the southwest slopes to Yale''s summit. The trail is well-maintained through the forest and marked with cairns above treeline. Class 2 terrain near the summit requires some scrambling.',
  'The upper slopes are exposed - turn back if thunderstorms threaten. Popular route with good trail conditions throughout.'
FROM peaks WHERE slug = 'mt-yale';

-- Tabeguache Peak - Via Shavano (Class 2)
INSERT INTO routes (peak_id, name, slug, is_standard, distance_miles, elevation_gain_ft, difficulty_class, exposure, typical_time_hours, trailhead_name, trailhead_latitude, trailhead_longitude, trailhead_elevation, route_type, four_wd_required, description, gear_notes)
SELECT id, 'Via Shavano Ridge', 'via-shavano', true, 12.0, 5600, 2, 'Moderate', '7-10',
  'Blank Gulch Trailhead', 38.6111, -106.1942, 9700, 'Out and back', false,
  'Most commonly climbed with Mt. Shavano. From Shavano''s summit, descend to the saddle and follow the exposed but manageable ridge to Tabeguache. The traverse involves Class 2 scrambling with some exposure. Can be climbed directly via McCoy Creek for a Tabeguache-only day.',
  'The ridge traverse requires comfort with exposure. Conditions can change quickly - monitor weather closely. Bring plenty of water for this long day.'
FROM peaks WHERE slug = 'tabeguache-peak';

-- Mt. Oxford - Via Belford (Class 2)
INSERT INTO routes (peak_id, name, slug, is_standard, distance_miles, elevation_gain_ft, difficulty_class, exposure, typical_time_hours, trailhead_name, trailhead_latitude, trailhead_longitude, trailhead_elevation, route_type, four_wd_required, description, gear_notes)
SELECT id, 'Via Belford Ridge', 'via-belford', true, 10.0, 5200, 2, 'Low', '6-9',
  'Missouri Gulch Trailhead', 38.9856, -106.3606, 9760, 'Out and back', false,
  'Usually climbed in combination with Mt. Belford. From Belford''s summit, drop to the 13,500'' saddle before climbing Oxford''s north ridge. The descent and re-ascent adds significant effort. Return via the same route or descend Oxford''s east ridge.',
  'The saddle between Belford and Oxford can hold snow late into season. Consider the additional effort when planning your day.'
FROM peaks WHERE slug = 'mt-oxford';

-- Mt. Columbia - West Slopes (Class 2)
INSERT INTO routes (peak_id, name, slug, is_standard, distance_miles, elevation_gain_ft, difficulty_class, exposure, typical_time_hours, trailhead_name, trailhead_latitude, trailhead_longitude, trailhead_elevation, route_type, four_wd_required, description, gear_notes)
SELECT id, 'West Slopes', 'west-slopes', true, 11.0, 4500, 2, 'Low', '7-10',
  'Frenchman Creek Trailhead', 38.9028, -106.3458, 9400, 'Out and back', false,
  'The standalone route to Columbia via the west slopes. Alternatively, climbed from Harvard via a strenuous ridge traverse. The west slopes route passes through scenic Frenchman Creek drainage before climbing to the summit.',
  'The Harvard-Columbia traverse adds significant difficulty and exposure. The west slopes route is more moderate but longer. Either option makes for a demanding day.'
FROM peaks WHERE slug = 'mt-columbia';

-- Missouri Mountain - Northwest Ridge (Class 2)
INSERT INTO routes (peak_id, name, slug, is_standard, distance_miles, elevation_gain_ft, difficulty_class, exposure, typical_time_hours, trailhead_name, trailhead_latitude, trailhead_longitude, trailhead_elevation, route_type, four_wd_required, description, gear_notes)
SELECT id, 'Northwest Ridge', 'northwest-ridge', true, 10.0, 4600, 2, 'Moderate', '6-9',
  'Missouri Gulch Trailhead', 38.9856, -106.3606, 9760, 'Out and back', false,
  'Climbs from Missouri Gulch via the northwest ridge. The upper section involves loose Class 2 scrambling with moderate exposure. Often combined with Belford and Oxford for an ambitious three-peak day.',
  'Loose rock on the northwest ridge requires careful movement. Helmet recommended. The three-peak day (Belford, Oxford, Missouri) is demanding but achievable for strong hikers.'
FROM peaks WHERE slug = 'missouri-mountain';

-- Mt. of the Holy Cross - North Ridge (Class 2)
INSERT INTO routes (peak_id, name, slug, is_standard, distance_miles, elevation_gain_ft, difficulty_class, exposure, typical_time_hours, trailhead_name, trailhead_latitude, trailhead_longitude, trailhead_elevation, route_type, four_wd_required, description, gear_notes)
SELECT id, 'North Ridge', 'north-ridge', true, 12.0, 5600, 2, 'Moderate', '9-12',
  'Half Moon Trailhead', 39.4447, -106.4289, 10300, 'Out and back', false,
  'A demanding route requiring significant approach hiking. The trail climbs to Half Moon Pass before descending to East Cross Creek (the crux crossing). From there, climb the north ridge to the summit. The famous cross couloir is visible from the Bowl of Tears on the descent.',
  'East Cross Creek crossing can be dangerous during high water - bring trekking poles and consider going early when flow is lower. The long approach makes this a full-day commitment. Some parties backpack to Bowl of Tears.'
FROM peaks WHERE slug = 'mt-of-the-holy-cross';

-- Huron Peak - Northwest Slopes (Class 2)
INSERT INTO routes (peak_id, name, slug, is_standard, distance_miles, elevation_gain_ft, difficulty_class, exposure, typical_time_hours, trailhead_name, trailhead_latitude, trailhead_longitude, trailhead_elevation, route_type, four_wd_required, description, gear_notes)
SELECT id, 'Northwest Slopes', 'northwest-slopes', true, 7.0, 3500, 2, 'Low', '5-7',
  'South Winfield Trailhead', 38.9539, -106.4025, 10520, 'Out and back', false,
  'A moderate route through historic mining areas in the Clear Creek drainage. The trail follows old mining roads before climbing the northwest slopes to the summit. Scenic approach with views of the Collegiate Peaks to the east.',
  'The road to South Winfield requires high-clearance vehicle. 4WD recommended but not always required. Historic mining ruins along the approach are interesting but stay out of old structures.'
FROM peaks WHERE slug = 'huron-peak';
