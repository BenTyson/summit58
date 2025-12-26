-- ========================================
-- ADD SANGRE DE CRISTO RANGE PEAKS (10 peaks)
-- Sources: 14ers.com, peakbagger.com, USGS
-- ========================================

INSERT INTO peaks (name, slug, elevation, rank, range, latitude, longitude, nearest_town, national_forest, prominence_ft, description) VALUES

-- Blanca Peak - 4th highest in CO
('Blanca Peak', 'blanca-peak', 14345, 4, 'Sangre de Cristo Range', 37.5775, -105.4856,
 'Alamosa', 'Rio Grande National Forest', 5345,
 'The highest peak in the Sangre de Cristo Range and fourth highest in Colorado. Sacred to the Navajo people as "White Shell Mountain." The northwest face route offers a challenging Class 2 climb through rugged terrain. Often climbed with nearby Ellingwood Point and Little Bear.'),

-- Crestone Peak - Technical and demanding
('Crestone Peak', 'crestone-peak', 14294, 7, 'Sangre de Cristo Range', 37.9669, -105.5856,
 'Crestone', 'Rio Grande National Forest', 4554,
 'One of Colorado''s most difficult 14ers. The standard route via South Colony Lakes involves Class 3 climbing with significant exposure. The Crestone Needle traverse is a famous but extremely difficult undertaking. Requires solid mountaineering skills.'),

-- Crestone Needle - Technical spire
('Crestone Needle', 'crestone-needle', 14197, 18, 'Sangre de Cristo Range', 37.9647, -105.5767,
 'Crestone', 'Rio Grande National Forest', 317,
 'A dramatic spire requiring Class 3 climbing on solid rock. The south face route involves intricate route-finding through ledges and couloirs. Often climbed after Crestone Peak via the challenging traverse. One of Colorado''s most photogenic peaks.'),

-- Kit Carson Peak
('Kit Carson Peak', 'kit-carson-peak', 14165, 23, 'Sangre de Cristo Range', 37.9797, -105.6028,
 'Crestone', 'Rio Grande National Forest', 825,
 'A massive peak near the Crestones. The standard route via the Outward Bound couloir involves Class 3 climbing. The Kit Carson-Challenger Point traverse is a popular extension. Named after the famous frontiersman.'),

-- Challenger Point
('Challenger Point', 'challenger-point', 14081, 33, 'Sangre de Cristo Range', 37.9803, -105.6067,
 'Crestone', 'Rio Grande National Forest', 301,
 'Named in memory of the Space Shuttle Challenger astronauts. Usually climbed in combination with Kit Carson Peak. The north slopes route offers a moderate Class 2 climb. The traverse to Kit Carson involves more difficult terrain.'),

-- Humboldt Peak
('Humboldt Peak', 'humboldt-peak', 14064, 36, 'Sangre de Cristo Range', 37.9761, -105.5553,
 'Westcliffe', 'Rio Grande National Forest', 1244,
 'A relatively moderate peak in the Sangre de Cristo Range. The west ridge route offers Class 2 climbing with beautiful views of the Crestone group. A good warm-up peak before tackling the more technical Crestones.'),

-- Ellingwood Point - Named for famous climber
('Ellingwood Point', 'ellingwood-point', 14042, 41, 'Sangre de Cristo Range', 37.5825, -105.4925,
 'Alamosa', 'Rio Grande National Forest', 342,
 'Named after Albert Ellingwood, a pioneering Colorado mountaineer. Usually climbed in combination with Blanca Peak via the connecting ridge. The south face route offers Class 2 climbing. Part of the challenging Blanca group.'),

-- Mt. Lindsey
('Mt. Lindsey', 'mt-lindsey', 14042, 42, 'Sangre de Cristo Range', 37.5839, -105.4444,
 'Fort Garland', 'Rio Grande National Forest', 1622,
 'An isolated peak east of the Blanca group. The north couloir route involves Class 3 climbing with a famous rock step. The approach through Huerfano Valley is scenic. One of the more remote 14ers in the range.'),

-- Culebra Peak - Privately owned
('Culebra Peak', 'culebra-peak', 14047, 39, 'Sangre de Cristo Range', 37.1222, -105.1858,
 'San Luis', 'Private Land', 1877,
 'The only 14er on private land, requiring a paid access permit. The Cielo Vista Ranch charges a fee for hiking access. The northwest ridge route is Class 2. A unique experience with controlled access and pristine conditions.'),

-- Little Bear Peak - Most difficult
('Little Bear Peak', 'little-bear-peak', 14037, 44, 'Sangre de Cristo Range', 37.5667, -105.4972,
 'Alamosa', 'Rio Grande National Forest', 377,
 'Considered one of Colorado''s most dangerous 14ers due to extremely loose rock. The west ridge/Hourglass couloir involves Class 4 climbing on unstable terrain. The Little Bear-Blanca traverse is notoriously difficult. Only for very experienced climbers.');


-- ========================================
-- STANDARD ROUTES FOR SANGRE DE CRISTO PEAKS
-- ========================================

-- Blanca Peak - Northwest Face (Class 2)
INSERT INTO routes (peak_id, name, slug, is_standard, distance_miles, elevation_gain_ft, difficulty_class, exposure, typical_time_hours, trailhead_name, trailhead_latitude, trailhead_longitude, trailhead_elevation, route_type, four_wd_required, description, gear_notes)
SELECT id, 'Northwest Face', 'northwest-face', true, 14.0, 5500, 2, 'Moderate', '10-14',
  'Lake Como Road', 37.5614, -105.5369, 8050, 'Out and back', true,
  'A demanding route via the infamous Lake Como Road (one of Colorado''s roughest 4WD roads). Most parties camp at Lake Como and climb the northwest face. The terrain is rugged with loose rock. Often combined with Ellingwood Point.',
  'The Lake Como Road destroys vehicles - only attempt in a capable 4WD with high clearance and good tires. Many parties hike the road instead. Camp at Lake Como for an easier summit day.'
FROM peaks WHERE slug = 'blanca-peak';

-- Crestone Peak - South Face (Class 3)
INSERT INTO routes (peak_id, name, slug, is_standard, distance_miles, elevation_gain_ft, difficulty_class, exposure, typical_time_hours, trailhead_name, trailhead_latitude, trailhead_longitude, trailhead_elevation, route_type, four_wd_required, description, gear_notes)
SELECT id, 'South Face', 'south-face', true, 13.0, 5600, 3, 'High', '10-14',
  'South Colony Lakes Trailhead', 37.9403, -105.5381, 9050, 'Out and back', true,
  'A serious route requiring Class 3 climbing with exposure. From South Colony Lakes, climb the Red Couloir to the upper south face. The route involves intricate route-finding through ledge systems. Most parties camp at the lakes.',
  'Helmet mandatory. The Red Couloir holds snow late - bring ice axe and crampons early season. This is a serious peak requiring solid scrambling skills. The Crestone Needle traverse is Class 4+.'
FROM peaks WHERE slug = 'crestone-peak';

-- Crestone Needle - South Face (Class 3)
INSERT INTO routes (peak_id, name, slug, is_standard, distance_miles, elevation_gain_ft, difficulty_class, exposure, typical_time_hours, trailhead_name, trailhead_latitude, trailhead_longitude, trailhead_elevation, route_type, four_wd_required, description, gear_notes)
SELECT id, 'South Face', 'south-face', true, 13.0, 5500, 3, 'High', '10-14',
  'South Colony Lakes Trailhead', 37.9403, -105.5381, 9050, 'Out and back', true,
  'The standard route climbs the south face via a complex system of ledges and gullies. Solid Class 3 climbing with good holds on mostly solid rock. The summit spire is dramatic. Most parties camp at South Colony Lakes.',
  'Helmet mandatory. Routefinding is key - the face has many variations. The rock is solid granite unlike the neighboring Crestone Peak. A memorable climb on one of Colorado''s finest peaks.'
FROM peaks WHERE slug = 'crestone-needle';

-- Kit Carson Peak - Outward Bound Couloir (Class 3)
INSERT INTO routes (peak_id, name, slug, is_standard, distance_miles, elevation_gain_ft, difficulty_class, exposure, typical_time_hours, trailhead_name, trailhead_latitude, trailhead_longitude, trailhead_elevation, route_type, four_wd_required, description, gear_notes)
SELECT id, 'Outward Bound Couloir', 'outward-bound', true, 12.0, 5200, 3, 'Moderate', '9-12',
  'Willow Lake Trailhead', 37.9858, -105.5506, 8900, 'Out and back', false,
  'The standard route via the Outward Bound couloir. From Willow Lake, climb the couloir to the upper mountain. Class 3 climbing with moderate exposure. The Kit Carson-Challenger traverse is a popular extension.',
  'The couloir holds snow into summer. Helmet recommended. The Challenger traverse adds Class 2 terrain and about 2 hours.'
FROM peaks WHERE slug = 'kit-carson-peak';

-- Challenger Point - North Slopes (Class 2)
INSERT INTO routes (peak_id, name, slug, is_standard, distance_miles, elevation_gain_ft, difficulty_class, exposure, typical_time_hours, trailhead_name, trailhead_latitude, trailhead_longitude, trailhead_elevation, route_type, four_wd_required, description, gear_notes)
SELECT id, 'North Slopes', 'north-slopes', true, 11.0, 4800, 2, 'Low', '8-11',
  'Willow Lake Trailhead', 37.9858, -105.5506, 8900, 'Out and back', false,
  'The moderate route to Challenger. From Willow Lake, climb the north slopes on Class 2 terrain. Usually climbed in combination with Kit Carson Peak. The memorial plaque at the summit honors the Challenger astronauts.',
  'A great introduction to the Sangre de Cristo Range. The Kit Carson combo makes for a full but manageable day.'
FROM peaks WHERE slug = 'challenger-point';

-- Humboldt Peak - West Ridge (Class 2)
INSERT INTO routes (peak_id, name, slug, is_standard, distance_miles, elevation_gain_ft, difficulty_class, exposure, typical_time_hours, trailhead_name, trailhead_latitude, trailhead_longitude, trailhead_elevation, route_type, four_wd_required, description, gear_notes)
SELECT id, 'West Ridge', 'west-ridge', true, 11.0, 4400, 2, 'Low', '7-10',
  'South Colony Lakes Trailhead', 37.9403, -105.5381, 9050, 'Out and back', true,
  'A moderate route via the west ridge. From near South Colony Lakes, climb the west ridge on Class 2 terrain. Views of the Crestones are spectacular. A good warm-up peak before tackling the more technical neighbors.',
  'A relatively straightforward climb by Sangre de Cristo standards. The road to the trailhead requires high-clearance 4WD.'
FROM peaks WHERE slug = 'humboldt-peak';

-- Ellingwood Point - South Face (Class 2)
INSERT INTO routes (peak_id, name, slug, is_standard, distance_miles, elevation_gain_ft, difficulty_class, exposure, typical_time_hours, trailhead_name, trailhead_latitude, trailhead_longitude, trailhead_elevation, route_type, four_wd_required, description, gear_notes)
SELECT id, 'South Face', 'south-face', true, 14.0, 5200, 2, 'Moderate', '10-14',
  'Lake Como Road', 37.5614, -105.5369, 8050, 'Out and back', true,
  'Usually climbed in combination with Blanca Peak. From the Blanca-Ellingwood saddle, climb the south face on Class 2 terrain. Most parties camp at Lake Como and climb both peaks.',
  'Same logistics as Blanca Peak - the Lake Como Road is brutal. Consider hiking the road instead of driving. The Blanca-Ellingwood combo is efficient.'
FROM peaks WHERE slug = 'ellingwood-point';

-- Mt. Lindsey - North Couloir (Class 3)
INSERT INTO routes (peak_id, name, slug, is_standard, distance_miles, elevation_gain_ft, difficulty_class, exposure, typical_time_hours, trailhead_name, trailhead_latitude, trailhead_longitude, trailhead_elevation, route_type, four_wd_required, description, gear_notes)
SELECT id, 'North Couloir', 'north-couloir', true, 9.0, 4500, 3, 'Moderate', '7-10',
  'Lily Lake Trailhead', 37.5833, -105.3978, 9700, 'Out and back', true,
  'The route climbs through scenic Huerfano Valley to the north couloir. A famous rock step provides the crux Class 3 climbing. The approach is beautiful with views of the Blanca group. An isolated but rewarding climb.',
  'High-clearance 4WD recommended. The rock step can be bypassed on loose talus to the left. Helmet recommended for the couloir.'
FROM peaks WHERE slug = 'mt-lindsey';

-- Culebra Peak - Northwest Ridge (Class 2)
INSERT INTO routes (peak_id, name, slug, is_standard, distance_miles, elevation_gain_ft, difficulty_class, exposure, typical_time_hours, trailhead_name, trailhead_latitude, trailhead_longitude, trailhead_elevation, route_type, four_wd_required, description, gear_notes)
SELECT id, 'Northwest Ridge', 'northwest-ridge', true, 8.0, 3400, 2, 'Low', '5-8',
  'Culebra Ranch Access', 37.1367, -105.1889, 10700, 'Out and back', false,
  'The only route on this privately-owned peak. Access requires a paid permit from Cielo Vista Ranch. The northwest ridge offers straightforward Class 2 climbing through pristine terrain. Limited access means less crowding.',
  'PERMIT REQUIRED - contact Cielo Vista Ranch for current fees and availability. The ranch limits daily hikers to protect the land. A unique Colorado 14er experience.'
FROM peaks WHERE slug = 'culebra-peak';

-- Little Bear Peak - West Ridge/Hourglass (Class 4)
INSERT INTO routes (peak_id, name, slug, is_standard, distance_miles, elevation_gain_ft, difficulty_class, exposure, typical_time_hours, trailhead_name, trailhead_latitude, trailhead_longitude, trailhead_elevation, route_type, four_wd_required, description, gear_notes)
SELECT id, 'West Ridge/Hourglass', 'hourglass', true, 11.0, 4500, 4, 'Extreme', '10-14',
  'Lake Como Road', 37.5614, -105.5369, 8050, 'Out and back', true,
  'WARNING: One of Colorado''s most dangerous routes due to extremely loose rock. The Hourglass couloir is a shooting gallery for rockfall. Class 4 climbing on unstable terrain. The Little Bear-Blanca traverse is notoriously difficult.',
  'HELMET MANDATORY. This peak kills climbers. The rock is dangerously loose throughout. Consider roping up through the Hourglass. Only attempt in dry conditions with an early start. Many experienced climbers avoid this peak.'
FROM peaks WHERE slug = 'little-bear-peak';
