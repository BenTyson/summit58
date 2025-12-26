-- ========================================
-- ADD SAN JUAN MOUNTAINS PEAKS (11 additional)
-- Handies Peak and Mt. Sneffels already exist
-- Sources: 14ers.com, peakbagger.com, USGS
-- ========================================

INSERT INTO peaks (name, slug, elevation, rank, range, latitude, longitude, nearest_town, national_forest, prominence_ft, description) VALUES

-- Uncompahgre Peak - Highest in San Juans
('Uncompahgre Peak', 'uncompahgre-peak', 14309, 6, 'San Juan Mountains', 38.0717, -107.4622,
 'Lake City', 'Uncompahgre National Forest', 2929,
 'The highest peak in the San Juan Mountains and sixth highest in Colorado. The flat-topped summit offers panoramic views across the vast San Juan wilderness. The Nellie Creek approach is the standard route, offering a moderate climb through scenic alpine terrain.'),

-- Mt. Wilson - Remote San Juan peak
('Mt. Wilson', 'mt-wilson', 14246, 16, 'San Juan Mountains', 37.8392, -107.9911,
 'Telluride', 'San Juan National Forest', 1526,
 'A remote and striking peak near Telluride. The standard north slopes route involves Class 4 climbing and significant exposure. The Wilson massif (Wilson, Wilson Peak, and El Diente) is one of Colorado''s most challenging 14er areas.'),

-- Mt. Eolus - Weminuche Wilderness
('Mt. Eolus', 'mt-eolus', 14083, 33, 'San Juan Mountains', 37.6219, -107.6225,
 'Durango', 'San Juan National Forest', 1543,
 'Located deep in the Weminuche Wilderness, Eolus requires a significant approach. Most climbers take the Durango & Silverton Railroad to access the Needles area. The summit involves Class 3 scrambling on solid rock. Often climbed with Sunlight and Windom.'),

-- Windom Peak - Chicago Basin
('Windom Peak', 'windom-peak', 14082, 34, 'San Juan Mountains', 37.6211, -107.5917,
 'Durango', 'San Juan National Forest', 822,
 'Part of the famous Chicago Basin trio with Eolus and Sunlight. The west ridge route offers Class 2 climbing on the most moderate of the three peaks. The train-accessed approach and beautiful basin make this a classic Colorado backpacking destination.'),

-- Sunlight Peak - Technical summit
('Sunlight Peak', 'sunlight-peak', 14059, 38, 'San Juan Mountains', 37.6272, -107.5958,
 'Durango', 'San Juan National Forest', 539,
 'The most difficult of the Chicago Basin peaks, with a Class 4 summit block that requires exposed climbing. The final moves to the tiny summit are intimidating with significant exposure. Often climbed after Windom when approaching from Chicago Basin.'),

-- Wilson Peak - Coors logo peak
('Wilson Peak', 'wilson-peak', 14017, 48, 'San Juan Mountains', 37.8597, -107.9839,
 'Telluride', 'San Juan National Forest', 737,
 'Famous as the peak featured on Coors beer labels. The west ridge route involves Class 3 climbing through a narrow couloir system. Often climbed with Mt. Wilson or El Diente for multi-peak days in the Wilson massif.'),

-- El Diente Peak
('El Diente Peak', 'el-diente-peak', 14159, 22, 'San Juan Mountains', 37.8392, -108.0053,
 'Telluride', 'San Juan National Forest', 279,
 'The "Tooth" peak, named for its distinctive shape. Connected to Mt. Wilson by a challenging traverse. The north slopes route involves Class 3 climbing with loose rock. One of Colorado''s more remote and demanding 14ers.'),

-- Mt. San Luis Peak - Easiest 14er
('San Luis Peak', 'san-luis-peak', 14014, 49, 'San Juan Mountains', 37.9869, -106.9311,
 'Creede', 'Rio Grande National Forest', 2194,
 'Often cited as Colorado''s easiest 14er via the Stewart Creek route. The gentle terrain and moderate distance make this ideal for beginners. Located in the eastern San Juans, it offers a different character than the rugged peaks to the west.'),

-- Wetterhorn Peak
('Wetterhorn Peak', 'wetterhorn-peak', 14015, 51, 'San Juan Mountains', 38.0606, -107.5108,
 'Lake City', 'Uncompahgre National Forest', 1535,
 'A dramatic peak with a distinctive summit block. The southeast ridge route involves Class 3 climbing with exposure near the top. The summit block requires a short but exposed scramble. Beautiful alpine scenery throughout the climb.'),

-- Redcloud Peak
('Redcloud Peak', 'redcloud-peak', 14034, 46, 'San Juan Mountains', 37.9408, -107.4217,
 'Lake City', 'Uncompahgre National Forest', 1674,
 'Named for the reddish color of its rock. Commonly climbed with neighboring Sunshine Peak for a two-peak day. The standard route from Silver Creek offers a moderate Class 1 climb. The distinctive red coloring is visible from miles away.'),

-- Sunshine Peak
('Sunshine Peak', 'sunshine-peak', 14001, 55, 'San Juan Mountains', 37.9228, -107.4253,
 'Lake City', 'Uncompahgre National Forest', 601,
 'Usually climbed in combination with Redcloud Peak via the connecting ridge. The shortest 14er at 14,001 feet, Sunshine barely makes the list. The ridge traverse from Redcloud involves easy Class 2 terrain. Great views of the San Juan backcountry.');


-- ========================================
-- STANDARD ROUTES FOR SAN JUAN PEAKS
-- ========================================

-- Uncompahgre Peak - South Ridge (Class 1)
INSERT INTO routes (peak_id, name, slug, is_standard, distance_miles, elevation_gain_ft, difficulty_class, exposure, typical_time_hours, trailhead_name, trailhead_latitude, trailhead_longitude, trailhead_elevation, route_type, four_wd_required, description, gear_notes)
SELECT id, 'South Ridge', 'south-ridge', true, 7.5, 3000, 1, 'Low', '4-6',
  'Nellie Creek Trailhead', 38.0500, -107.4500, 11400, 'Out and back', true,
  'The standard and easiest route to the highest peak in the San Juans. The trail follows Nellie Creek drainage before climbing the gentle south ridge. The summit plateau offers 360-degree views. A relatively straightforward climb despite the impressive elevation.',
  '4WD required for the rough road to Nellie Creek trailhead. 2WD parking adds about 3 miles each way. The area is remote - come prepared.'
FROM peaks WHERE slug = 'uncompahgre-peak';

-- Mt. Wilson - North Slopes (Class 4)
INSERT INTO routes (peak_id, name, slug, is_standard, distance_miles, elevation_gain_ft, difficulty_class, exposure, typical_time_hours, trailhead_name, trailhead_latitude, trailhead_longitude, trailhead_elevation, route_type, four_wd_required, description, gear_notes)
SELECT id, 'North Slopes', 'north-slopes', true, 12.0, 4900, 4, 'High', '10-14',
  'Navajo Basin Trailhead', 37.8417, -107.9333, 9300, 'Out and back', true,
  'A serious undertaking with Class 4 climbing and significant exposure. The route climbs through Rock of Ages Saddle before tackling the north slopes. The summit block requires exposed climbing. This is one of Colorado''s more demanding 14ers.',
  'Helmet required. Rope recommended for less experienced parties. The Wilson group is remote - be prepared for a long day or overnight. Consider your experience honestly before attempting.'
FROM peaks WHERE slug = 'mt-wilson';

-- Mt. Eolus - Northeast Ridge (Class 3)
INSERT INTO routes (peak_id, name, slug, is_standard, distance_miles, elevation_gain_ft, difficulty_class, exposure, typical_time_hours, trailhead_name, trailhead_latitude, trailhead_longitude, trailhead_elevation, route_type, four_wd_required, description, gear_notes)
SELECT id, 'Northeast Ridge', 'northeast-ridge', true, 14.0, 5500, 3, 'Moderate', '10-14',
  'Needleton (train stop)', 37.6350, -107.6917, 8212, 'Out and back', false,
  'Most parties take the Durango & Silverton Railroad to Needleton, then backpack to Chicago Basin. From camp, climb the northeast ridge with Class 3 scrambling. The approach adds a day each way. Often combined with Sunlight and Windom.',
  'Plan for a 3-4 day trip minimum. Reservations required for the train. Bear canisters required in Weminuche Wilderness. This is a true wilderness adventure.'
FROM peaks WHERE slug = 'mt-eolus';

-- Windom Peak - West Ridge (Class 2)
INSERT INTO routes (peak_id, name, slug, is_standard, distance_miles, elevation_gain_ft, difficulty_class, exposure, typical_time_hours, trailhead_name, trailhead_latitude, trailhead_longitude, trailhead_elevation, route_type, four_wd_required, description, gear_notes)
SELECT id, 'West Ridge', 'west-ridge', true, 14.0, 5100, 2, 'Low', '10-13',
  'Needleton (train stop)', 37.6350, -107.6917, 8212, 'Out and back', false,
  'The most moderate of the Chicago Basin peaks. From camp, the west ridge offers Class 2 climbing to a spacious summit. The easiest of the basin''s three 14ers and often the first summit of the day when climbing multiple peaks.',
  'Same logistics as Eolus - train access, backpacking, bear canisters. Windom is a great first peak before tackling Sunlight or Eolus.'
FROM peaks WHERE slug = 'windom-peak';

-- Sunlight Peak - South Slopes (Class 4)
INSERT INTO routes (peak_id, name, slug, is_standard, distance_miles, elevation_gain_ft, difficulty_class, exposure, typical_time_hours, trailhead_name, trailhead_latitude, trailhead_longitude, trailhead_elevation, route_type, four_wd_required, description, gear_notes)
SELECT id, 'South Slopes', 'south-slopes', true, 14.0, 5300, 4, 'High', '10-14',
  'Needleton (train stop)', 37.6350, -107.6917, 8212, 'Out and back', false,
  'The crux is the summit block - an exposed Class 4 scramble to a tiny summit. From camp, climb the south slopes before the final summit scramble. Many climbers find the last moves intimidating due to significant exposure. Not for those uncomfortable with heights.',
  'Same logistics as other Chicago Basin peaks. The summit block has claimed lives - assess your comfort with exposure before attempting. Some parties rope up for the final moves.'
FROM peaks WHERE slug = 'sunlight-peak';

-- Wilson Peak - West Ridge (Class 3)
INSERT INTO routes (peak_id, name, slug, is_standard, distance_miles, elevation_gain_ft, difficulty_class, exposure, typical_time_hours, trailhead_name, trailhead_latitude, trailhead_longitude, trailhead_elevation, route_type, four_wd_required, description, gear_notes)
SELECT id, 'West Ridge', 'west-ridge', true, 10.0, 4400, 3, 'Moderate', '7-10',
  'Silver Pick Trailhead', 37.8683, -107.9872, 10250, 'Out and back', true,
  'The route climbs through Rock of Ages Saddle via a narrow couloir system before ascending the west ridge. Class 3 climbing with moderate exposure. The famous Coors peak offers excellent views of the Wilson massif.',
  '4WD required for Silver Pick road. The couloir holds snow into summer - check conditions. Often combined with El Diente or Mt. Wilson for ambitious climbers.'
FROM peaks WHERE slug = 'wilson-peak';

-- El Diente Peak - North Slopes (Class 3)
INSERT INTO routes (peak_id, name, slug, is_standard, distance_miles, elevation_gain_ft, difficulty_class, exposure, typical_time_hours, trailhead_name, trailhead_latitude, trailhead_longitude, trailhead_elevation, route_type, four_wd_required, description, gear_notes)
SELECT id, 'North Slopes', 'north-slopes', true, 11.0, 4500, 3, 'High', '8-11',
  'Kilpacker Trailhead', 37.8525, -108.0269, 10060, 'Out and back', true,
  'The standard route via the north slopes. Class 3 climbing on loose rock with some exposure. The El Diente-Wilson traverse is a classic but demanding extension. The peak''s tooth-like profile is impressive from all angles.',
  '4WD required. Loose rock requires careful movement. Helmet recommended. The traverse to Mt. Wilson is Class 4 and significantly more difficult.'
FROM peaks WHERE slug = 'el-diente-peak';

-- San Luis Peak - Stewart Creek (Class 1)
INSERT INTO routes (peak_id, name, slug, is_standard, distance_miles, elevation_gain_ft, difficulty_class, exposure, typical_time_hours, trailhead_name, trailhead_latitude, trailhead_longitude, trailhead_elevation, route_type, four_wd_required, description, gear_notes)
SELECT id, 'Stewart Creek', 'stewart-creek', true, 11.0, 3600, 1, 'Low', '6-8',
  'Stewart Creek Trailhead', 37.9308, -106.9083, 10480, 'Out and back', false,
  'Often called Colorado''s easiest 14er. The well-graded trail follows Stewart Creek through gentle alpine terrain to the summit. No scrambling required. Excellent choice for first-time 14er hikers or those wanting a more relaxed day.',
  'Despite being "easy," this is still a long hike at high altitude. Come prepared with proper gear, water, and layers. A great beginner peak.'
FROM peaks WHERE slug = 'san-luis-peak';

-- Wetterhorn Peak - Southeast Ridge (Class 3)
INSERT INTO routes (peak_id, name, slug, is_standard, distance_miles, elevation_gain_ft, difficulty_class, exposure, typical_time_hours, trailhead_name, trailhead_latitude, trailhead_longitude, trailhead_elevation, route_type, four_wd_required, description, gear_notes)
SELECT id, 'Southeast Ridge', 'southeast-ridge', true, 7.0, 3300, 3, 'Moderate', '5-8',
  'Matterhorn Creek Trailhead', 38.0658, -107.4906, 10800, 'Out and back', true,
  'The route climbs to the base of the summit block before a short but exposed Class 3 scramble to the top. The summit block requires committing moves with good exposure. Views of the surrounding peaks are spectacular.',
  '4WD recommended for the trailhead access. The summit block is the crux - assess your comfort level before committing. Helmet recommended for the scramble.'
FROM peaks WHERE slug = 'wetterhorn-peak';

-- Redcloud Peak - Northeast Ridge (Class 1)
INSERT INTO routes (peak_id, name, slug, is_standard, distance_miles, elevation_gain_ft, difficulty_class, exposure, typical_time_hours, trailhead_name, trailhead_latitude, trailhead_longitude, trailhead_elevation, route_type, four_wd_required, description, gear_notes)
SELECT id, 'Silver Creek', 'silver-creek', true, 9.0, 3700, 1, 'Low', '5-7',
  'Silver Creek Trailhead', 37.9333, -107.3833, 10400, 'Out and back', true,
  'A moderate climb via Silver Creek to Redcloud''s distinctive red summit. The trail is well-defined with gentle grades. The Redcloud-Sunshine traverse is a popular extension for a two-peak day.',
  '4WD required for the Silver Creek road. The distinctive red coloring comes from oxidized iron in the rock. Combining with Sunshine adds about 2 hours.'
FROM peaks WHERE slug = 'redcloud-peak';

-- Sunshine Peak - Via Redcloud (Class 2)
INSERT INTO routes (peak_id, name, slug, is_standard, distance_miles, elevation_gain_ft, difficulty_class, exposure, typical_time_hours, trailhead_name, trailhead_latitude, trailhead_longitude, trailhead_elevation, route_type, four_wd_required, description, gear_notes)
SELECT id, 'Via Redcloud Ridge', 'via-redcloud', true, 11.0, 4500, 2, 'Low', '6-9',
  'Silver Creek Trailhead', 37.9333, -107.3833, 10400, 'Out and back', false,
  'Most commonly climbed in combination with Redcloud. From Redcloud''s summit, descend the connecting ridge and climb to Sunshine. Easy Class 2 terrain throughout the traverse. At 14,001 feet, Sunshine barely qualifies as a 14er.',
  'Same trailhead as Redcloud - the combo is efficient. The ridge traverse adds about 1.5 miles and 700 feet of additional elevation.'
FROM peaks WHERE slug = 'sunshine-peak';
