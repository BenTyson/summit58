-- ========================================
-- SUMMIT58 SEED DATA
-- 10 Pilot Peaks with Standard Routes
-- Data verified from NGS 2024, 14ers.com, AllTrails, CMC
-- ========================================

-- ========================================
-- PEAKS
-- ========================================

INSERT INTO peaks (name, slug, elevation, rank, range, latitude, longitude, description) VALUES

-- Class 1 Peaks
('Quandary Peak', 'quandary-peak', 14272, 13, 'Tenmile Range', 39.3972, -106.1064,
 'One of Colorado''s most popular 14ers, Quandary Peak offers a straightforward hike with stunning views of the Tenmile Range. Its accessibility from Breckenridge makes it an ideal first 14er. The well-maintained trail and relatively moderate difficulty attract thousands of hikers each summer.'),

('Mt. Elbert', 'mt-elbert', 14439, 1, 'Sawatch Range', 39.1178, -106.4453,
 'The highest peak in Colorado and the entire Rocky Mountains. Despite its impressive elevation, the Northeast Ridge route is a moderate hike accessible to most prepared hikers. Standing atop Mt. Elbert, you''ll be higher than anywhere else in the contiguous United States outside of California.'),

('Mt. Bierstadt', 'mt-bierstadt', 14065, 38, 'Front Range', 39.5825, -105.6686,
 'A popular Front Range 14er with easy access from Denver via Guanella Pass. The approach crosses the beautiful willows of Scott Gomer Creek before climbing to the summit. Mt. Bierstadt offers one of the most accessible 14er experiences, though the willows can be challenging when wet.'),

('Grays Peak', 'grays-peak', 14270, 9, 'Front Range', 39.6339, -105.8175,
 'The highest peak on the Continental Divide. Often climbed with its neighbor Torreys Peak, Grays offers a well-maintained trail and spectacular views. As one of the most accessible 14ers from Denver via I-70, it''s a popular choice for both beginners and experienced hikers.'),

('Handies Peak', 'handies-peak', 14048, 40, 'San Juan Mountains', 37.9130, -107.5044,
 'A remote San Juan peak near Lake City. The standard route from American Basin is one of the shortest 14er hikes and travels through stunning alpine meadows famous for their wildflower displays in July. The high trailhead elevation makes this an excellent choice for acclimatization.'),

-- Class 2 Peaks
('Torreys Peak', 'torreys-peak', 14267, 11, 'Front Range', 39.6428, -105.8214,
 'A classic Front Range 14er often paired with Grays Peak via a scenic saddle traverse. The summit offers panoramic views of the Continental Divide. The standard route involves Class 2 terrain near the summit, requiring some scrambling and route-finding skills.'),

('Mt. Democrat', 'mt-democrat', 14148, 28, 'Mosquito Range', 39.3392, -106.1400,
 'Part of the famous DeCaLiBron loop with Mt. Cameron, Mt. Lincoln, and Mt. Bross. Democrat is typically the first peak climbed on this circuit. The high-altitude Kite Lake trailhead and relatively short distance make this a popular choice for hikers seeking multiple summits.'),

-- Class 3 Peaks
('Longs Peak', 'longs-peak', 14259, 15, 'Front Range', 40.2550, -105.6156,
 'Colorado''s most iconic 14er and the only one in Rocky Mountain National Park. The Keyhole Route is a challenging Class 3 climb requiring early starts, good conditions, and solid scrambling skills. The route features the famous Keyhole, the exposed Ledges and Trough, the narrow Narrows, and the steep Homestretch.'),

('Mt. Sneffels', 'mt-sneffels', 14150, 27, 'San Juan Mountains', 38.0036, -107.7922,
 'One of the most photographed peaks in Colorado, Mt. Sneffels rises dramatically above the San Juan Mountains near Ouray. The standard route involves Class 3 scrambling through a scenic couloir system. The peak is known for its striking appearance and the beautiful Yankee Boy Basin approach.'),

-- Class 4 Peak
('Capitol Peak', 'capitol-peak', 14130, 29, 'Elk Mountains', 39.1503, -107.0833,
 'Widely considered Colorado''s most difficult and dangerous 14er. The infamous Knife Edge traverse is an extremely exposed Class 4 section with severe consequences for falls. Most climbers approach this as a two-day trip with a camp at Capitol Lake. This peak demands respect and careful preparation.');


-- ========================================
-- ROUTES
-- ========================================

-- Quandary Peak - East Ridge (Class 1)
INSERT INTO routes (peak_id, name, slug, is_standard, distance_miles, elevation_gain_ft, difficulty_class, exposure, typical_time_hours, trailhead_name, trailhead_latitude, trailhead_longitude, trailhead_elevation, description, gear_notes)
SELECT id, 'East Ridge', 'east-ridge', true, 6.75, 3300, 1, 'Low', '4-6',
  'Quandary Peak Trailhead', 39.3886, -106.1028, 10850,
  'The standard route follows a well-maintained trail through the forest before emerging above treeline. After the trees, the trail ascends the broad east ridge with consistent grade to the summit. The route is straightforward with excellent footing throughout. Expect crowds on summer weekends.',
  'Trekking poles recommended. Bring layers for changing conditions above treeline. Microspikes useful in early season when snow lingers.'
FROM peaks WHERE slug = 'quandary-peak';

-- Mt. Elbert - Northeast Ridge (Class 1)
INSERT INTO routes (peak_id, name, slug, is_standard, distance_miles, elevation_gain_ft, difficulty_class, exposure, typical_time_hours, trailhead_name, trailhead_latitude, trailhead_longitude, trailhead_elevation, description, gear_notes)
SELECT id, 'Northeast Ridge', 'northeast-ridge', true, 9.5, 4700, 1, 'Low', '6-9',
  'Mt. Elbert Trailhead', 39.1347, -106.3994, 10040,
  'The most popular route to Colorado''s highest point. The trail climbs steadily through forest before reaching treeline. Above the trees, follow the well-worn path along the northeast ridge to the summit. The length and altitude gain make this a demanding day despite the non-technical terrain.',
  'Bring plenty of water (3+ liters) and snacks for this longer hike. Start early to avoid afternoon thunderstorms. The altitude affects everyone - pace yourself.'
FROM peaks WHERE slug = 'mt-elbert';

-- Mt. Bierstadt - West Slopes (Class 2)
INSERT INTO routes (peak_id, name, slug, is_standard, distance_miles, elevation_gain_ft, difficulty_class, exposure, typical_time_hours, trailhead_name, trailhead_latitude, trailhead_longitude, trailhead_elevation, description, gear_notes)
SELECT id, 'West Slopes', 'west-slopes', true, 7.25, 2430, 2, 'Low', '4-6',
  'Guanella Pass Trailhead', 39.5969, -105.7111, 11640,
  'A popular Front Range hike starting from Guanella Pass. The route crosses the willows of Scott Gomer Creek on a boardwalk before ascending the west slopes. The upper section involves some Class 2 scrambling with loose rock. Watch for the false summit - the true summit is farther along the ridge.',
  'Gaiters helpful when willows are wet. The parking area fills by 6 AM on summer weekends - arrive early or consider carpooling.'
FROM peaks WHERE slug = 'mt-bierstadt';

-- Grays Peak - North Slopes (Class 1)
INSERT INTO routes (peak_id, name, slug, is_standard, distance_miles, elevation_gain_ft, difficulty_class, exposure, typical_time_hours, trailhead_name, trailhead_latitude, trailhead_longitude, trailhead_elevation, description, gear_notes)
SELECT id, 'North Slopes', 'north-slopes', true, 8.4, 3000, 1, 'Low', '5-7',
  'Stevens Gulch Trailhead', 39.6606, -105.7861, 11280,
  'The standard route follows an old mining road before climbing the north slopes. The trail is well-defined and mostly moderate in grade. Many hikers continue to Torreys Peak via the connecting saddle for a classic combo climb. Views from the summit span the Continental Divide.',
  'High-clearance vehicle recommended for the Stevens Gulch road. The 2WD lot adds 3 miles each way. Bring layers - the exposed summit can be windy.'
FROM peaks WHERE slug = 'grays-peak';

-- Torreys Peak - Via Grays Saddle (Class 2)
INSERT INTO routes (peak_id, name, slug, is_standard, distance_miles, elevation_gain_ft, difficulty_class, exposure, typical_time_hours, trailhead_name, trailhead_latitude, trailhead_longitude, trailhead_elevation, description, gear_notes)
SELECT id, 'South Slopes via Grays', 'south-slopes', true, 8.4, 3660, 2, 'Low', '5-7',
  'Stevens Gulch Trailhead', 39.6606, -105.7861, 11280,
  'Most commonly climbed in combination with Grays Peak. From Grays summit, descend to the saddle and climb Torreys'' south slopes. The final push involves Class 2 scrambling on loose rock. Can also be climbed directly without summiting Grays via the Kelso Ridge (Class 3).',
  'Consider climbing Grays first if new to Class 2 terrain. Helmet optional but recommended for rockfall protection. The Kelso Ridge alternative requires more technical experience.'
FROM peaks WHERE slug = 'torreys-peak';

-- Handies Peak - Southwest Slopes (Class 1)
INSERT INTO routes (peak_id, name, slug, is_standard, distance_miles, elevation_gain_ft, difficulty_class, exposure, typical_time_hours, trailhead_name, trailhead_latitude, trailhead_longitude, trailhead_elevation, description, gear_notes)
SELECT id, 'Southwest Slopes', 'southwest-slopes', true, 5.3, 2450, 1, 'Low', '3-5',
  'American Basin Trailhead', 37.9194, -107.5272, 11600,
  'One of the shortest 14er routes in Colorado. The trail climbs through spectacular American Basin, famous for July wildflowers. Near Sloan Lake, the route turns left and traverses talus to easier slopes. The final push follows switchbacks up the gentle southwest ridge.',
  '4WD required for American Basin road - it''s rough. This is a high-altitude start at 11,600'' - acclimate if coming from low elevation. Best wildflowers typically late July.'
FROM peaks WHERE slug = 'handies-peak';

-- Mt. Democrat - East Slopes (Class 2)
INSERT INTO routes (peak_id, name, slug, is_standard, distance_miles, elevation_gain_ft, difficulty_class, exposure, typical_time_hours, trailhead_name, trailhead_latitude, trailhead_longitude, trailhead_elevation, description, gear_notes)
SELECT id, 'East Slopes', 'east-slopes', true, 4.0, 2150, 2, 'Moderate', '3-5',
  'Kite Lake Trailhead', 39.3347, -106.1236, 12035,
  'The first peak in the popular DeCaLiBron circuit. From Kite Lake, climb the steep east face via switchbacks. The upper section involves Class 2 scrambling with some loose rock and moderate exposure. Summit views reveal the other DeCaLiBron peaks stretching to the north.',
  'Start early if doing the full DeCaLiBron loop (4 summits). Helmet recommended for loose rock sections. Day use fee required for Kite Lake parking.'
FROM peaks WHERE slug = 'mt-democrat';

-- Longs Peak - Keyhole Route (Class 3)
INSERT INTO routes (peak_id, name, slug, is_standard, distance_miles, elevation_gain_ft, difficulty_class, exposure, typical_time_hours, trailhead_name, trailhead_latitude, trailhead_longitude, trailhead_elevation, description, gear_notes)
SELECT id, 'Keyhole Route', 'keyhole-route', true, 15.0, 5370, 3, 'High', '10-15',
  'Longs Peak Trailhead', 40.2722, -105.5561, 9405,
  'Colorado''s most challenging standard 14er route. After 6 miles of hiking, the Keyhole (13,200'') marks the start of technical terrain. Beyond lies the Ledges (exposed traverse), the Trough (steep gully), the Narrows (exposed ledge traverse), and the Homestretch (steep slab climbing). Each section demands focus and solid scrambling skills.',
  'Helmet required - rockfall is common. Start by 3 AM for a safe summit window before afternoon storms. Bring headlamp, gloves, layers, and lots of food/water. Not recommended in wet or icy conditions. Check NPS website for current route conditions.'
FROM peaks WHERE slug = 'longs-peak';

-- Mt. Sneffels - South Slopes (Class 3)
INSERT INTO routes (peak_id, name, slug, is_standard, distance_miles, elevation_gain_ft, difficulty_class, exposure, typical_time_hours, trailhead_name, trailhead_latitude, trailhead_longitude, trailhead_elevation, description, gear_notes)
SELECT id, 'South Slopes', 'south-slopes', true, 5.5, 2960, 3, 'Moderate', '5-7',
  'Yankee Boy Basin Trailhead', 37.9869, -107.7714, 11400,
  'The standard route climbs through beautiful Yankee Boy Basin to the base of Sneffels'' south face. The route navigates through a couloir system requiring Class 3 scrambling with good holds. The "V-notch" section is the crux - the rock was modified in 2016, making it slightly more difficult than historical accounts suggest.',
  'Helmet required for the couloir. 4WD needed for Yankee Boy Basin access. Start early in summer to avoid afternoon rockfall and storms. The couloir holds snow into July - ice axe and crampons may be needed early season.'
FROM peaks WHERE slug = 'mt-sneffels';

-- Capitol Peak - Knife Edge (Class 4)
INSERT INTO routes (peak_id, name, slug, is_standard, distance_miles, elevation_gain_ft, difficulty_class, exposure, typical_time_hours, trailhead_name, trailhead_latitude, trailhead_longitude, trailhead_elevation, description, gear_notes)
SELECT id, 'Northeast Ridge via Knife Edge', 'knife-edge', true, 17.0, 5300, 4, 'Extreme', '12-16',
  'Capitol Creek Trailhead', 39.1883, -107.0647, 9472,
  'The most dangerous standard 14er route in Colorado. The 5.8-mile approach to Capitol Lake is moderate hiking. Beyond the lake, the route climbs to K2 (13,664'') before traversing the infamous Knife Edge - a 150-foot exposed ridge with 2,000-foot drops on both sides. The final summit block requires Class 4 climbing.',
  'Helmet required. Rope and harness recommended for less experienced parties. Most climbers camp at Capitol Lake (permit required). Do not attempt in bad weather - the Knife Edge is unforgiving. This peak has the highest fatality-to-accident ratio in Colorado. Only attempt with proper experience and preparation.'
FROM peaks WHERE slug = 'capitol-peak';
