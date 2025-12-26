-- ========================================
-- ADD REMAINING PEAKS
-- Front Range (4 remaining) + Mosquito Range (2 remaining)
-- Sources: 14ers.com, peakbagger.com, USGS
-- ========================================

-- ========================================
-- FRONT RANGE PEAKS
-- Already have: Bierstadt, Grays, Torreys, Longs
-- ========================================

INSERT INTO peaks (name, slug, elevation, rank, range, latitude, longitude, nearest_town, national_forest, prominence_ft, description) VALUES

-- Mt. Evans - Highest paved road
('Mt. Evans', 'mt-evans', 14264, 14, 'Front Range', 39.5883, -105.6431,
 'Idaho Springs', 'Arapaho National Forest', 2764,
 'Famous for having the highest paved road in North America (seasonally). While many visitors drive to the summit, the hiking routes offer a true mountain experience. The Chicago Lakes trail provides a wilderness approach away from the road crowds.'),

-- Pikes Peak - America''s Mountain
('Pikes Peak', 'pikes-peak', 14115, 30, 'Front Range', 38.8408, -105.0442,
 'Colorado Springs', 'Pike National Forest', 5530,
 'Perhaps Colorado''s most famous peak, inspiring "America the Beautiful." Accessible by car, cog railway, or multiple hiking routes. The Barr Trail is the classic hiking approach, a demanding 13-mile climb from Manitou Springs.');


-- ========================================
-- MOSQUITO RANGE PEAKS
-- Already have: Democrat
-- ========================================

INSERT INTO peaks (name, slug, elevation, rank, range, latitude, longitude, nearest_town, national_forest, prominence_ft, description) VALUES

-- Mt. Lincoln - 8th highest
('Mt. Lincoln', 'mt-lincoln', 14286, 8, 'Mosquito Range', 39.3514, -106.1114,
 'Alma', 'Pike National Forest', 926,
 'Named after President Abraham Lincoln, this is the highest peak in the Mosquito Range. Part of the famous DeCaLiBron loop with Democrat, Cameron, and Bross. The summit offers commanding views of the entire Mosquito Range.'),

-- Mt. Cameron - Between Lincoln and Bross
('Mt. Cameron', 'mt-cameron', 14238, 17, 'Mosquito Range', 39.3469, -106.1186,
 'Alma', 'Pike National Forest', 138,
 'A humble peak between Lincoln and Bross, Cameron barely qualifies as a separate summit due to low prominence. Part of the DeCaLiBron loop. Most climbers tag it on the traverse between the higher neighbors. Some debate whether it should count as a 14er.'),

-- Mt. Bross - North end of DeCaLiBron
('Mt. Bross', 'mt-bross', 14172, 22, 'Mosquito Range', 39.3350, -106.1075,
 'Alma', 'Pike National Forest', 292,
 'The northernmost peak in the DeCaLiBron circuit. The summit is on private land with a complex access history - always check current status before climbing. Views extend across South Park to the Sawatch Range.'),

-- Mt. Sherman - Easiest Mosquito Range peak
('Mt. Sherman', 'mt-sherman', 14036, 45, 'Mosquito Range', 39.2250, -106.1697,
 'Fairplay', 'Pike National Forest', 1276,
 'Often considered the easiest 14er in the Mosquito Range. The historic Dauntless Mine approach passes interesting mining ruins. The gentle terrain and straightforward route make this popular with beginners.');


-- ========================================
-- STANDARD ROUTES
-- ========================================

-- Mt. Evans - Chicago Lakes (Class 2)
INSERT INTO routes (peak_id, name, slug, is_standard, distance_miles, elevation_gain_ft, difficulty_class, exposure, typical_time_hours, trailhead_name, trailhead_latitude, trailhead_longitude, trailhead_elevation, route_type, four_wd_required, description, gear_notes)
SELECT id, 'Chicago Lakes', 'chicago-lakes', true, 16.0, 4500, 2, 'Low', '9-12',
  'Echo Lake Trailhead', 39.6589, -105.6056, 10600, 'Out and back', false,
  'The wilderness route avoiding the summit road crowds. The trail passes beautiful Chicago Lakes before climbing to the summit plateau. Class 2 terrain throughout. A much more rewarding experience than driving up.',
  'Long day hike - start early. The Chicago Lakes area is spectacular. Mountain goats are common near the summit. You can arrange a car shuttle to the summit if desired for a one-way hike.'
FROM peaks WHERE slug = 'mt-evans';

-- Pikes Peak - Barr Trail (Class 1)
INSERT INTO routes (peak_id, name, slug, is_standard, distance_miles, elevation_gain_ft, difficulty_class, exposure, typical_time_hours, trailhead_name, trailhead_latitude, trailhead_longitude, trailhead_elevation, route_type, four_wd_required, description, gear_notes)
SELECT id, 'Barr Trail', 'barr-trail', true, 26.0, 7400, 1, 'Low', '10-14',
  'Barr Trail Trailhead', 38.8564, -104.9419, 6700, 'Out and back', false,
  'The classic hiking route to America''s Mountain. From Manitou Springs, the well-maintained trail climbs 7,400 feet over 13 miles. Barr Camp at 10,200 feet offers overnight accommodations. The summit house has food and restrooms.',
  'This is a marathon, not a sprint. Consider an overnight at Barr Camp. The elevation gain is massive - acclimate before attempting. The cog railway or highway provide bail-out options if needed.'
FROM peaks WHERE slug = 'pikes-peak';

-- Mt. Lincoln - West Ridge (Class 2)
INSERT INTO routes (peak_id, name, slug, is_standard, distance_miles, elevation_gain_ft, difficulty_class, exposure, typical_time_hours, trailhead_name, trailhead_latitude, trailhead_longitude, trailhead_elevation, route_type, four_wd_required, description, gear_notes)
SELECT id, 'West Ridge', 'west-ridge', true, 6.0, 2600, 2, 'Low', '4-6',
  'Kite Lake Trailhead', 39.3347, -106.1236, 12035, 'Out and back', false,
  'Part of the famous DeCaLiBron circuit. From Kite Lake, climb Democrat first, then traverse to Cameron and Lincoln. The west ridge to Lincoln involves Class 2 scrambling. Views of the highest peak in the range.',
  'Most efficient as part of the DeCaLiBron loop. The traverse from Cameron is exposed but manageable. Start early for the full circuit.'
FROM peaks WHERE slug = 'mt-lincoln';

-- Mt. Cameron - Via Lincoln Ridge (Class 2)
INSERT INTO routes (peak_id, name, slug, is_standard, distance_miles, elevation_gain_ft, difficulty_class, exposure, typical_time_hours, trailhead_name, trailhead_latitude, trailhead_longitude, trailhead_elevation, route_type, four_wd_required, description, gear_notes)
SELECT id, 'Via Lincoln Ridge', 'via-lincoln', true, 6.0, 2400, 2, 'Low', '4-6',
  'Kite Lake Trailhead', 39.3347, -106.1236, 12035, 'Out and back', false,
  'Almost always climbed as part of the DeCaLiBron circuit. The short ridge from Lincoln to Cameron is easy walking. The peak''s low prominence means it''s barely a separate summit. Quick stop between Lincoln and Bross.',
  'Just a bump on the ridge between Lincoln and Bross. Part of the efficient DeCaLiBron loop.'
FROM peaks WHERE slug = 'mt-cameron';

-- Mt. Bross - Northeast Slopes (Class 2)
INSERT INTO routes (peak_id, name, slug, is_standard, distance_miles, elevation_gain_ft, difficulty_class, exposure, typical_time_hours, trailhead_name, trailhead_latitude, trailhead_longitude, trailhead_elevation, route_type, four_wd_required, description, gear_notes)
SELECT id, 'Northeast Slopes', 'northeast-slopes', true, 6.5, 2800, 2, 'Low', '4-6',
  'Kite Lake Trailhead', 39.3347, -106.1236, 12035, 'Out and back', false,
  'The final peak in the DeCaLiBron circuit. From Cameron, descend slightly then climb Bross via the northeast slopes. NOTE: The summit is on private land - check current access status before climbing.',
  'ACCESS STATUS: The summit area is private property. Historically access has been allowed but policies change. Check 14ers.com for current status. Stay on the standard route to minimize impact.'
FROM peaks WHERE slug = 'mt-bross';

-- Mt. Sherman - Southwest Ridge (Class 2)
INSERT INTO routes (peak_id, name, slug, is_standard, distance_miles, elevation_gain_ft, difficulty_class, exposure, typical_time_hours, trailhead_name, trailhead_latitude, trailhead_longitude, trailhead_elevation, route_type, four_wd_required, description, gear_notes)
SELECT id, 'Southwest Ridge', 'southwest-ridge', true, 5.0, 2100, 2, 'Low', '3-5',
  'Fourmile Creek Trailhead', 39.2239, -106.1364, 11900, 'Out and back', false,
  'One of the easiest 14ers in Colorado. The route passes historic mining ruins from the Dauntless and Hilltop mines. The gentle southwest ridge offers Class 2 terrain with minimal difficulty. Great beginner peak.',
  'The mining ruins are interesting but stay out of structures - they''re dangerous. High-clearance vehicle recommended for the rough road to the trailhead. Popular with first-time 14er hikers.'
FROM peaks WHERE slug = 'mt-sherman';
