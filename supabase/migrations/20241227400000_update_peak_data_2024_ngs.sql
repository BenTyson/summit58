-- Update peak data to match 2024 National Geodetic Survey measurements
-- Source: https://5280.com/the-revised-list-of-colorados-14000-foot-peaks-by-elevation/
-- NGS data released April 2024

-- =====================================================
-- 1. NAME CHANGE: Mt. Evans -> Mt. Blue Sky
-- Official name change in 2022 to honor the Arapaho people
-- =====================================================

UPDATE peaks SET
  name = 'Mt. Blue Sky',
  slug = 'mt-blue-sky'
WHERE slug = 'mt-evans';

-- =====================================================
-- 2. ELEVATION CORRECTIONS (14 peaks with >5ft difference)
-- Rounding to nearest foot for display consistency
-- =====================================================

UPDATE peaks SET elevation = 14343 WHERE slug = 'la-plata-peak';
UPDATE peaks SET elevation = 14316 WHERE slug = 'uncompahgre-peak';
UPDATE peaks SET elevation = 14272 WHERE slug = 'castle-peak';
UPDATE peaks SET elevation = 14254 WHERE slug = 'mt-wilson';
UPDATE peaks SET elevation = 14246 WHERE slug = 'mt-cameron';
UPDATE peaks SET elevation = 14107 WHERE slug = 'pikes-peak';
UPDATE peaks SET elevation = 14102 WHERE slug = 'snowmass-mountain';
UPDATE peaks SET elevation = 14056 WHERE slug = 'handies-peak';
UPDATE peaks SET elevation = 14055 WHERE slug = 'ellingwood-point';
UPDATE peaks SET elevation = 14053 WHERE slug = 'culebra-peak';
UPDATE peaks SET elevation = 14053 WHERE slug = 'mt-lindsey';
UPDATE peaks SET elevation = 14027 WHERE slug = 'pyramid-peak';
UPDATE peaks SET elevation = 14020 WHERE slug = 'san-luis-peak';
UPDATE peaks SET elevation = 14020 WHERE slug = 'north-maroon-peak';

-- =====================================================
-- 3. COMPLETE RANK CORRECTION (all 58 peaks)
-- Based on 2024 NGS elevation ordering
-- =====================================================

UPDATE peaks SET rank = 1 WHERE slug = 'mt-elbert';
UPDATE peaks SET rank = 2 WHERE slug = 'mt-massive';
UPDATE peaks SET rank = 3 WHERE slug = 'mt-harvard';
UPDATE peaks SET rank = 4 WHERE slug = 'blanca-peak';
UPDATE peaks SET rank = 5 WHERE slug = 'la-plata-peak';
UPDATE peaks SET rank = 6 WHERE slug = 'uncompahgre-peak';
UPDATE peaks SET rank = 7 WHERE slug = 'crestone-peak';
UPDATE peaks SET rank = 8 WHERE slug = 'mt-lincoln';
UPDATE peaks SET rank = 9 WHERE slug = 'grays-peak';
UPDATE peaks SET rank = 10 WHERE slug = 'castle-peak';
UPDATE peaks SET rank = 11 WHERE slug = 'torreys-peak';
UPDATE peaks SET rank = 12 WHERE slug = 'quandary-peak';
UPDATE peaks SET rank = 13 WHERE slug = 'mt-antero';
UPDATE peaks SET rank = 14 WHERE slug = 'mt-blue-sky';
UPDATE peaks SET rank = 15 WHERE slug = 'longs-peak';
UPDATE peaks SET rank = 16 WHERE slug = 'mt-wilson';
UPDATE peaks SET rank = 17 WHERE slug = 'mt-cameron';
UPDATE peaks SET rank = 18 WHERE slug = 'mt-shavano';
UPDATE peaks SET rank = 19 WHERE slug = 'mt-princeton';
UPDATE peaks SET rank = 20 WHERE slug = 'mt-belford';
UPDATE peaks SET rank = 21 WHERE slug = 'mt-yale';
UPDATE peaks SET rank = 22 WHERE slug = 'crestone-needle';
UPDATE peaks SET rank = 23 WHERE slug = 'mt-bross';
UPDATE peaks SET rank = 24 WHERE slug = 'el-diente-peak';
UPDATE peaks SET rank = 25 WHERE slug = 'kit-carson-peak';
UPDATE peaks SET rank = 26 WHERE slug = 'maroon-peak';
UPDATE peaks SET rank = 27 WHERE slug = 'tabeguache-peak';
UPDATE peaks SET rank = 28 WHERE slug = 'mt-oxford';
UPDATE peaks SET rank = 29 WHERE slug = 'mt-sneffels';
UPDATE peaks SET rank = 30 WHERE slug = 'mt-democrat';
UPDATE peaks SET rank = 31 WHERE slug = 'capitol-peak';
UPDATE peaks SET rank = 32 WHERE slug = 'pikes-peak';
UPDATE peaks SET rank = 33 WHERE slug = 'snowmass-mountain';
UPDATE peaks SET rank = 34 WHERE slug = 'windom-peak';
UPDATE peaks SET rank = 35 WHERE slug = 'mt-eolus';
UPDATE peaks SET rank = 36 WHERE slug = 'challenger-point';
UPDATE peaks SET rank = 37 WHERE slug = 'mt-columbia';
UPDATE peaks SET rank = 38 WHERE slug = 'missouri-mountain';
UPDATE peaks SET rank = 39 WHERE slug = 'humboldt-peak';
UPDATE peaks SET rank = 40 WHERE slug = 'mt-bierstadt';
UPDATE peaks SET rank = 41 WHERE slug = 'sunlight-peak';
UPDATE peaks SET rank = 42 WHERE slug = 'handies-peak';
UPDATE peaks SET rank = 43 WHERE slug = 'ellingwood-point';
UPDATE peaks SET rank = 44 WHERE slug = 'culebra-peak';
UPDATE peaks SET rank = 45 WHERE slug = 'mt-lindsey';
UPDATE peaks SET rank = 46 WHERE slug = 'mt-sherman';
UPDATE peaks SET rank = 47 WHERE slug = 'north-eolus';
UPDATE peaks SET rank = 48 WHERE slug = 'little-bear-peak';
UPDATE peaks SET rank = 49 WHERE slug = 'redcloud-peak';
UPDATE peaks SET rank = 50 WHERE slug = 'conundrum-peak';
UPDATE peaks SET rank = 51 WHERE slug = 'pyramid-peak';
UPDATE peaks SET rank = 52 WHERE slug = 'wilson-peak';
UPDATE peaks SET rank = 53 WHERE slug = 'san-luis-peak';
UPDATE peaks SET rank = 54 WHERE slug = 'north-maroon-peak';
UPDATE peaks SET rank = 55 WHERE slug = 'wetterhorn-peak';
UPDATE peaks SET rank = 56 WHERE slug = 'mt-of-the-holy-cross';
UPDATE peaks SET rank = 57 WHERE slug = 'sunshine-peak';
UPDATE peaks SET rank = 58 WHERE slug = 'huron-peak';
