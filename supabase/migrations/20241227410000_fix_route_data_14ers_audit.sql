-- Fix route data discrepancies based on 14ers.com official data audit
-- Generated: 2025-12-26
-- Source: https://www.14ers.com route pages
--
-- CRITICAL: 9 peaks have incorrect difficulty classes
-- - 6 peaks were UNDERRATED (safety risk to users)
-- - 3 peaks were overrated (minor issue)

-- ============================================
-- CRITICAL: CLASS CORRECTIONS (Safety Priority)
-- ============================================

-- Torreys Peak: Class 2 -> 1 (was overrated)
UPDATE routes SET
  difficulty_class = 1,
  distance_miles = 7.75,
  elevation_gain_ft = 3000
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'torreys-peak');

-- Mt. Antero: Class 1 -> 2 (UNDERRATED - safety concern)
UPDATE routes SET
  difficulty_class = 2,
  distance_miles = 7.0,
  elevation_gain_ft = 2400
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'mt-antero');

-- Snowmass Mountain: Class 2 -> 3 (UNDERRATED - safety concern)
UPDATE routes SET
  difficulty_class = 3,
  distance_miles = 22.0,
  elevation_gain_ft = 5800
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'snowmass-mountain');

-- Uncompahgre Peak: Class 1 -> 2 (UNDERRATED - safety concern)
UPDATE routes SET
  difficulty_class = 2
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'uncompahgre-peak');

-- Redcloud Peak: Class 1 -> 2 (UNDERRATED - safety concern)
UPDATE routes SET
  difficulty_class = 2,
  name = 'Northeast Ridge',
  slug = 'northeast-ridge'
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'redcloud-peak');

-- Crestone Needle: Class 3 -> 4 (UNDERRATED - MAJOR safety concern)
UPDATE routes SET
  difficulty_class = 4,
  distance_miles = 12.0,
  elevation_gain_ft = 4400
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'crestone-needle');

-- Pikes Peak: Class 1 -> 2, use standard route (UNDERRATED)
-- Note: Barr Trail is 26mi, Northwest Slopes is the standard 14er route at 14mi
UPDATE routes SET
  difficulty_class = 2,
  name = 'Northwest Slopes',
  slug = 'northwest-slopes',
  distance_miles = 14.0,
  elevation_gain_ft = 4300
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'pikes-peak');

-- Mt. Bross: Class 2 -> 1 (was overrated)
UPDATE routes SET
  difficulty_class = 1,
  name = 'East Slopes',
  slug = 'east-slopes',
  distance_miles = 9.0,
  elevation_gain_ft = 2900
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'mt-bross');

-- Mt. Sherman: Class 2 -> 1 (was overrated)
UPDATE routes SET
  difficulty_class = 1,
  distance_miles = 5.25
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'mt-sherman');

-- ============================================
-- DISTANCE & ELEVATION GAIN CORRECTIONS
-- ============================================

-- Quandary Peak: Gain correction (+150 ft)
UPDATE routes SET
  elevation_gain_ft = 3450
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'quandary-peak');

-- Mt. Elbert: Gain correction (-200 ft)
UPDATE routes SET
  elevation_gain_ft = 4500
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'mt-elbert');

-- Mt. Bierstadt: Gain correction (+420 ft)
UPDATE routes SET
  elevation_gain_ft = 2850
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'mt-bierstadt');

-- Grays Peak: Distance correction (-0.9 mi)
UPDATE routes SET
  distance_miles = 7.5
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'grays-peak');

-- Longs Peak: Distance and gain correction
UPDATE routes SET
  distance_miles = 14.5,
  elevation_gain_ft = 5100
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'longs-peak');

-- Mt. Shavano: Distance and gain correction
UPDATE routes SET
  distance_miles = 9.5,
  elevation_gain_ft = 4500
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'mt-shavano');

-- Mt. Belford: Gain correction
UPDATE routes SET
  elevation_gain_ft = 4500
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'mt-belford');

-- Mt. Princeton: Distance and gain correction (4WD trailhead)
UPDATE routes SET
  distance_miles = 6.5,
  elevation_gain_ft = 3200
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'mt-princeton');

-- Mt. Yale: Distance correction
UPDATE routes SET
  distance_miles = 9.5
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'mt-yale');

-- Tabeguache Peak: Distance correction
UPDATE routes SET
  distance_miles = 11.5
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'tabeguache-peak');

-- Mt. Oxford: Distance and gain correction
UPDATE routes SET
  distance_miles = 11.0,
  elevation_gain_ft = 5900
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'mt-oxford');

-- Mt. Columbia: Distance and gain correction
UPDATE routes SET
  distance_miles = 12.0,
  elevation_gain_ft = 4250
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'mt-columbia');

-- Missouri Mountain: Distance and gain correction
UPDATE routes SET
  distance_miles = 10.5,
  elevation_gain_ft = 4500
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'missouri-mountain');

-- Mt. of the Holy Cross: Distance correction
UPDATE routes SET
  distance_miles = 11.25
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'mt-of-the-holy-cross');

-- Castle Peak: Route name and stats correction
UPDATE routes SET
  name = 'Northeast Ridge',
  slug = 'northeast-ridge',
  distance_miles = 13.5,
  elevation_gain_ft = 4600
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'castle-peak');

-- Maroon Peak: Distance and gain correction
UPDATE routes SET
  distance_miles = 12.0,
  elevation_gain_ft = 4800
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'maroon-peak');

-- North Maroon Peak: Distance correction
UPDATE routes SET
  distance_miles = 9.25
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'north-maroon-peak');

-- Conundrum Peak: Route name and stats correction
UPDATE routes SET
  name = 'South Ridge',
  slug = 'south-ridge',
  distance_miles = 13.5,
  elevation_gain_ft = 4400
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'conundrum-peak');

-- ============================================
-- NEEDLE CREEK PEAKS (Needleton Trailhead)
-- These require train access, longer approaches
-- ============================================

-- Mt. Eolus: Distance and gain (from Needleton)
UPDATE routes SET
  distance_miles = 18.0,
  elevation_gain_ft = 6100
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'mt-eolus');

-- Windom Peak: Distance and gain (from Needleton)
UPDATE routes SET
  distance_miles = 18.0,
  elevation_gain_ft = 6000
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'windom-peak');

-- Sunlight Peak: Distance and gain (from Needleton)
UPDATE routes SET
  distance_miles = 17.0,
  elevation_gain_ft = 6000
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'sunlight-peak');

-- North Eolus: Route name and stats (from Needleton)
UPDATE routes SET
  name = 'South Ridge',
  slug = 'south-ridge',
  distance_miles = 17.75,
  elevation_gain_ft = 6000
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'north-eolus');

-- ============================================
-- SAN JUAN & OTHER PEAKS
-- ============================================

-- Wilson Peak: Route name and gain correction
UPDATE routes SET
  name = 'Southwest Ridge',
  slug = 'southwest-ridge',
  elevation_gain_ft = 3900
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'wilson-peak');

-- El Diente Peak: Route name and stats correction
UPDATE routes SET
  name = 'South Slopes',
  slug = 'south-slopes',
  distance_miles = 12.0,
  elevation_gain_ft = 4400
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'el-diente-peak');

-- San Luis Peak: Route name and distance correction
UPDATE routes SET
  name = 'Northeast Ridge',
  slug = 'northeast-ridge',
  distance_miles = 13.5
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'san-luis-peak');

-- ============================================
-- SANGRE DE CRISTO PEAKS (4WD Trailheads)
-- Using Lake Como / 4WD access stats
-- ============================================

-- Blanca Peak: Stats correction (Lake Como 4WD TH)
UPDATE routes SET
  distance_miles = 6.0,
  elevation_gain_ft = 2700
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'blanca-peak');

-- Crestone Peak: Distance and gain correction
UPDATE routes SET
  distance_miles = 14.0,
  elevation_gain_ft = 5700
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'crestone-peak');

-- Kit Carson Peak: Route name and stats correction
UPDATE routes SET
  name = 'Via Challenger Point',
  slug = 'via-challenger',
  distance_miles = 15.0,
  elevation_gain_ft = 6250
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'kit-carson-peak');

-- Challenger Point: Distance and gain correction
UPDATE routes SET
  distance_miles = 13.5,
  elevation_gain_ft = 5400
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'challenger-point');

-- Humboldt Peak: Gain correction
UPDATE routes SET
  elevation_gain_ft = 4200
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'humboldt-peak');

-- Ellingwood Point: Stats correction (Lake Como 4WD TH)
UPDATE routes SET
  distance_miles = 6.0,
  elevation_gain_ft = 2450
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'ellingwood-point');

-- Mt. Lindsey: Route name and stats correction
UPDATE routes SET
  name = 'Northwest Gully',
  slug = 'northwest-gully',
  distance_miles = 8.25,
  elevation_gain_ft = 3500
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'mt-lindsey');

-- Culebra Peak: Stats correction (4WD TH)
UPDATE routes SET
  distance_miles = 5.0,
  elevation_gain_ft = 2700
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'culebra-peak');

-- Little Bear Peak: Stats correction (Lake Como 4WD TH)
UPDATE routes SET
  distance_miles = 3.5,
  elevation_gain_ft = 2300
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'little-bear-peak');

-- ============================================
-- FRONT RANGE & OTHER PEAKS
-- ============================================

-- Mt. Blue Sky (formerly Evans): Route name and stats correction
UPDATE routes SET
  name = 'West Ridge',
  slug = 'west-ridge',
  distance_miles = 17.0,
  elevation_gain_ft = 5600
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'mt-blue-sky');

-- Mt. Cameron: Distance and gain correction
UPDATE routes SET
  distance_miles = 4.75,
  elevation_gain_ft = 2250
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'mt-cameron');

-- Mt. Harvard: Gain correction
UPDATE routes SET
  elevation_gain_ft = 4600
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'mt-harvard');

-- Mt. Massive: Distance correction
UPDATE routes SET
  distance_miles = 13.75
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'mt-massive');

-- Handies Peak: Distance and gain correction
UPDATE routes SET
  distance_miles = 5.75,
  elevation_gain_ft = 2500
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'handies-peak');
