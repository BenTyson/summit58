-- Fix trailhead coordinates based on 14ers.com official data
-- Generated: 2024-12-27
-- Source: Individual route pages from 14ers.com
--
-- Many coordinates were significantly off (1-3 miles from actual trailhead)
-- This migration corrects all verified trailhead locations

-- ============================================
-- FRONT RANGE
-- ============================================

-- Longs Peak: Significant correction
UPDATE routes SET
  trailhead_latitude = 40.254902,
  trailhead_longitude = -105.615738,
  trailhead_elevation = 9400
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'longs-peak');

-- Mt. Bierstadt (Guanella Pass): Significant correction
UPDATE routes SET
  trailhead_latitude = 39.582638,
  trailhead_longitude = -105.668610,
  trailhead_elevation = 11669
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'mt-bierstadt');

-- Grays Peak (Stevens Gulch): Significant correction
UPDATE routes SET
  trailhead_latitude = 39.633820,
  trailhead_longitude = -105.817520,
  trailhead_elevation = 11280
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'grays-peak');

-- Torreys Peak (Stevens Gulch): Same trailhead as Grays
UPDATE routes SET
  trailhead_latitude = 39.633820,
  trailhead_longitude = -105.817520,
  trailhead_elevation = 11280
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'torreys-peak');

-- Mt. Blue Sky (Echo Lake): Correction
UPDATE routes SET
  trailhead_latitude = 39.658000,
  trailhead_longitude = -105.604000,
  trailhead_elevation = 10600
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'mt-blue-sky');

-- Pikes Peak (Barr Trail): Minor correction
UPDATE routes SET
  trailhead_latitude = 38.840278,
  trailhead_longitude = -104.936944,
  trailhead_elevation = 6680
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'pikes-peak');

-- ============================================
-- TENMILE / MOSQUITO RANGE
-- ============================================

-- Quandary Peak: Minor correction
UPDATE routes SET
  trailhead_latitude = 39.397236,
  trailhead_longitude = -106.106430,
  trailhead_elevation = 10850
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'quandary-peak');

-- Mt. Lincoln (Kite Lake): Correction
UPDATE routes SET
  trailhead_latitude = 39.351391,
  trailhead_longitude = -106.111404,
  trailhead_elevation = 12000
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'mt-lincoln');

-- Mt. Cameron (Kite Lake): Same trailhead
UPDATE routes SET
  trailhead_latitude = 39.351391,
  trailhead_longitude = -106.111404,
  trailhead_elevation = 12000
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'mt-cameron');

-- Mt. Democrat (Kite Lake): Same trailhead
UPDATE routes SET
  trailhead_latitude = 39.339542,
  trailhead_longitude = -106.139946,
  trailhead_elevation = 12000
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'mt-democrat');

-- Mt. Bross (Kite Lake): Same trailhead
UPDATE routes SET
  trailhead_latitude = 39.351391,
  trailhead_longitude = -106.111404,
  trailhead_elevation = 12000
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'mt-bross');

-- Mt. Sherman (Fourmile Creek): Correction
UPDATE routes SET
  trailhead_latitude = 39.225006,
  trailhead_longitude = -106.169945,
  trailhead_elevation = 12000
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'mt-sherman');

-- ============================================
-- SAWATCH RANGE
-- ============================================

-- Mt. Elbert: Correction
UPDATE routes SET
  trailhead_latitude = 39.118075,
  trailhead_longitude = -106.445417,
  trailhead_elevation = 10040
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'mt-elbert');

-- Mt. Massive: Significant correction
UPDATE routes SET
  trailhead_latitude = 39.187298,
  trailhead_longitude = -106.475548,
  trailhead_elevation = 10080
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'mt-massive');

-- Mt. Harvard (North Cottonwood): Significant correction
UPDATE routes SET
  trailhead_latitude = 38.924328,
  trailhead_longitude = -106.320618,
  trailhead_elevation = 9900
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'mt-harvard');

-- La Plata Peak: Minor correction
UPDATE routes SET
  trailhead_latitude = 39.029515,
  trailhead_longitude = -106.473095,
  trailhead_elevation = 10150
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'la-plata-peak');

-- Mt. Antero (Baldwin Gulch): Keep existing - 4WD trailhead
UPDATE routes SET
  trailhead_elevation = 12380
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'mt-antero');

-- Mt. Shavano (Blank Gulch): Correction
UPDATE routes SET
  trailhead_latitude = 38.619083,
  trailhead_longitude = -106.239296,
  trailhead_elevation = 9750
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'mt-shavano');

-- Tabeguache Peak: Same trailhead as Shavano
UPDATE routes SET
  trailhead_latitude = 38.619083,
  trailhead_longitude = -106.239296,
  trailhead_elevation = 9750
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'tabeguache-peak');

-- Mt. Belford (Missouri Gulch): Minor correction
UPDATE routes SET
  trailhead_latitude = 38.960575,
  trailhead_longitude = -106.360832,
  trailhead_elevation = 9650
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'mt-belford');

-- Mt. Oxford: Same trailhead as Belford
UPDATE routes SET
  trailhead_latitude = 38.960575,
  trailhead_longitude = -106.360832,
  trailhead_elevation = 9650
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'mt-oxford');

-- Missouri Mountain: Same trailhead as Belford
UPDATE routes SET
  trailhead_latitude = 38.960575,
  trailhead_longitude = -106.360832,
  trailhead_elevation = 9650
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'missouri-mountain');

-- Mt. Princeton: Correction
UPDATE routes SET
  trailhead_latitude = 38.749062,
  trailhead_longitude = -106.242432,
  trailhead_elevation = 8900
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'mt-princeton');

-- Mt. Yale (Denny Creek): Minor correction
UPDATE routes SET
  trailhead_latitude = 38.844051,
  trailhead_longitude = -106.313965,
  trailhead_elevation = 9900
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'mt-yale');

-- Mt. Columbia: Correction
UPDATE routes SET
  trailhead_latitude = 38.902800,
  trailhead_longitude = -106.345800,
  trailhead_elevation = 9400
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'mt-columbia');

-- Mt. of the Holy Cross (Half Moon): Significant correction
UPDATE routes SET
  trailhead_latitude = 39.466713,
  trailhead_longitude = -106.481766,
  trailhead_elevation = 10320
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'mt-of-the-holy-cross');

-- Huron Peak: Correction
UPDATE routes SET
  trailhead_latitude = 38.945423,
  trailhead_longitude = -106.438126,
  trailhead_elevation = 10575
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'huron-peak');

-- ============================================
-- ELK MOUNTAINS
-- ============================================

-- Capitol Peak: Significant correction
UPDATE routes SET
  trailhead_latitude = 39.150166,
  trailhead_longitude = -107.083221,
  trailhead_elevation = 9450
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'capitol-peak');

-- Maroon Peak (Maroon Lake): Significant correction
UPDATE routes SET
  trailhead_latitude = 39.070713,
  trailhead_longitude = -106.989113,
  trailhead_elevation = 9590
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'maroon-peak');

-- North Maroon Peak: Same trailhead
UPDATE routes SET
  trailhead_latitude = 39.070713,
  trailhead_longitude = -106.989113,
  trailhead_elevation = 9590
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'north-maroon-peak');

-- Pyramid Peak: Same trailhead
UPDATE routes SET
  trailhead_latitude = 39.070713,
  trailhead_longitude = -106.989113,
  trailhead_elevation = 9590
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'pyramid-peak');

-- Snowmass Mountain: Significant correction
UPDATE routes SET
  trailhead_latitude = 39.118809,
  trailhead_longitude = -107.066528,
  trailhead_elevation = 8400
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'snowmass-mountain');

-- Castle Peak: Correction
UPDATE routes SET
  trailhead_latitude = 39.032200,
  trailhead_longitude = -106.811700,
  trailhead_elevation = 9800
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'castle-peak');

-- Conundrum Peak: Same trailhead as Castle
UPDATE routes SET
  trailhead_latitude = 39.032200,
  trailhead_longitude = -106.811700,
  trailhead_elevation = 9800
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'conundrum-peak');

-- ============================================
-- SAN JUAN MOUNTAINS
-- ============================================

-- Uncompahgre Peak (Nellie Creek): Minor correction
UPDATE routes SET
  trailhead_latitude = 38.071507,
  trailhead_longitude = -107.462166,
  trailhead_elevation = 11400
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'uncompahgre-peak');

-- Wetterhorn Peak: Minor correction
UPDATE routes SET
  trailhead_latitude = 38.060593,
  trailhead_longitude = -107.510834,
  trailhead_elevation = 10800
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'wetterhorn-peak');

-- Mt. Sneffels (Yankee Boy Basin): Minor correction
UPDATE routes SET
  trailhead_latitude = 38.003605,
  trailhead_longitude = -107.792229,
  trailhead_elevation = 11350
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'mt-sneffels');

-- Handies Peak (American Basin): Minor correction
UPDATE routes SET
  trailhead_latitude = 37.913021,
  trailhead_longitude = -107.504478,
  trailhead_elevation = 11600
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'handies-peak');

-- Redcloud Peak (Silver Creek): Correction
UPDATE routes SET
  trailhead_latitude = 37.940880,
  trailhead_longitude = -107.421654,
  trailhead_elevation = 10400
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'redcloud-peak');

-- Sunshine Peak: Same trailhead as Redcloud
UPDATE routes SET
  trailhead_latitude = 37.940880,
  trailhead_longitude = -107.421654,
  trailhead_elevation = 10400
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'sunshine-peak');

-- San Luis Peak (Stewart Creek): Significant correction
UPDATE routes SET
  trailhead_latitude = 37.986897,
  trailhead_longitude = -106.931389,
  trailhead_elevation = 10500
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'san-luis-peak');

-- Mt. Wilson (Navajo Basin): Keep existing
UPDATE routes SET
  trailhead_elevation = 9300
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'mt-wilson');

-- Wilson Peak (Rock of Ages/Silver Pick): Correction
UPDATE routes SET
  trailhead_latitude = 37.859913,
  trailhead_longitude = -107.984795,
  trailhead_elevation = 10350
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'wilson-peak');

-- El Diente Peak (Kilpacker): Keep existing
UPDATE routes SET
  trailhead_elevation = 10060
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'el-diente-peak');

-- ============================================
-- NEEDLE MOUNTAINS (San Juan - Train Access)
-- ============================================

-- Mt. Eolus (Needleton): Significant correction
UPDATE routes SET
  trailhead_latitude = 37.621948,
  trailhead_longitude = -107.622498,
  trailhead_name = 'Needleton (Durango & Silverton train)',
  trailhead_elevation = 8212
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'mt-eolus');

-- Windom Peak: Same trailhead
UPDATE routes SET
  trailhead_latitude = 37.621948,
  trailhead_longitude = -107.622498,
  trailhead_name = 'Needleton (Durango & Silverton train)',
  trailhead_elevation = 8212
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'windom-peak');

-- Sunlight Peak: Same trailhead
UPDATE routes SET
  trailhead_latitude = 37.621948,
  trailhead_longitude = -107.622498,
  trailhead_name = 'Needleton (Durango & Silverton train)',
  trailhead_elevation = 8212
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'sunlight-peak');

-- North Eolus: Same trailhead
UPDATE routes SET
  trailhead_latitude = 37.621948,
  trailhead_longitude = -107.622498,
  trailhead_name = 'Needleton (Durango & Silverton train)',
  trailhead_elevation = 8212
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'north-eolus');

-- ============================================
-- SANGRE DE CRISTO RANGE
-- ============================================

-- Blanca Peak (Lake Como): Significant correction
UPDATE routes SET
  trailhead_latitude = 37.577473,
  trailhead_longitude = -105.485443,
  trailhead_name = 'Lake Como Road (4WD)',
  trailhead_elevation = 8000
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'blanca-peak');

-- Ellingwood Point: Same trailhead as Blanca
UPDATE routes SET
  trailhead_latitude = 37.577473,
  trailhead_longitude = -105.485443,
  trailhead_name = 'Lake Como Road (4WD)',
  trailhead_elevation = 8000
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'ellingwood-point');

-- Little Bear Peak: Same trailhead as Blanca
UPDATE routes SET
  trailhead_latitude = 37.577473,
  trailhead_longitude = -105.485443,
  trailhead_name = 'Lake Como Road (4WD)',
  trailhead_elevation = 8000
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'little-bear-peak');

-- Crestone Peak (South Colony): Significant correction
UPDATE routes SET
  trailhead_latitude = 37.966972,
  trailhead_longitude = -105.585304,
  trailhead_name = 'South Colony Lakes Trailhead',
  trailhead_elevation = 8800
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'crestone-peak');

-- Crestone Needle: Same trailhead
UPDATE routes SET
  trailhead_latitude = 37.966972,
  trailhead_longitude = -105.585304,
  trailhead_name = 'South Colony Lakes Trailhead',
  trailhead_elevation = 8800
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'crestone-needle');

-- Humboldt Peak: Same trailhead as Crestones
UPDATE routes SET
  trailhead_latitude = 37.966972,
  trailhead_longitude = -105.585304,
  trailhead_name = 'South Colony Lakes Trailhead',
  trailhead_elevation = 8800
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'humboldt-peak');

-- Kit Carson Peak (Willow Lake): Keep existing
UPDATE routes SET
  trailhead_elevation = 8900
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'kit-carson-peak');

-- Challenger Point: Same trailhead as Kit Carson
UPDATE routes SET
  trailhead_elevation = 8900
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'challenger-point');

-- Mt. Lindsey (Lily Lake): Keep existing
UPDATE routes SET
  trailhead_elevation = 9700
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'mt-lindsey');

-- Culebra Peak: Keep existing (private access)
UPDATE routes SET
  trailhead_elevation = 10700
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'culebra-peak');
