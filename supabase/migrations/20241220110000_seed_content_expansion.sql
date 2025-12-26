-- ========================================
-- SEED CONTENT EXPANSION DATA
-- Add nearest_town, national_forest, prominence_ft for 10 pilot peaks
-- Sources: 14ers.com, peakbagger.com, USFS
-- ========================================

-- Quandary Peak
-- Source: 14ers.com, peakbagger.com (prominence)
UPDATE peaks SET
  nearest_town = 'Breckenridge',
  national_forest = 'White River National Forest',
  prominence_ft = 1978
WHERE slug = 'quandary-peak';

-- Mt. Elbert - Colorado's highest
-- Source: 14ers.com, peakbagger.com (prominence = 9093 ft, highest in CO)
UPDATE peaks SET
  nearest_town = 'Leadville',
  national_forest = 'San Isabel National Forest',
  prominence_ft = 9093
WHERE slug = 'mt-elbert';

-- Mt. Bierstadt
-- Source: 14ers.com, peakbagger.com
UPDATE peaks SET
  nearest_town = 'Georgetown',
  national_forest = 'Arapaho National Forest',
  prominence_ft = 1693
WHERE slug = 'mt-bierstadt';

-- Grays Peak - Highest on Continental Divide
-- Source: 14ers.com, peakbagger.com
UPDATE peaks SET
  nearest_town = 'Georgetown',
  national_forest = 'Arapaho National Forest',
  prominence_ft = 3054
WHERE slug = 'grays-peak';

-- Handies Peak
-- Source: 14ers.com, peakbagger.com
UPDATE peaks SET
  nearest_town = 'Lake City',
  national_forest = 'Uncompahgre National Forest',
  prominence_ft = 2437
WHERE slug = 'handies-peak';

-- Torreys Peak
-- Source: 14ers.com, peakbagger.com
UPDATE peaks SET
  nearest_town = 'Georgetown',
  national_forest = 'Arapaho National Forest',
  prominence_ft = 447
WHERE slug = 'torreys-peak';

-- Mt. Democrat
-- Source: 14ers.com, peakbagger.com
UPDATE peaks SET
  nearest_town = 'Alma',
  national_forest = 'Pike National Forest',
  prominence_ft = 1227
WHERE slug = 'mt-democrat';

-- Longs Peak - Rocky Mountain National Park icon
-- Source: 14ers.com, peakbagger.com
UPDATE peaks SET
  nearest_town = 'Estes Park',
  national_forest = 'Rocky Mountain National Park',
  prominence_ft = 2961
WHERE slug = 'longs-peak';

-- Mt. Sneffels
-- Source: 14ers.com, peakbagger.com
UPDATE peaks SET
  nearest_town = 'Ouray',
  national_forest = 'Uncompahgre National Forest',
  prominence_ft = 2313
WHERE slug = 'mt-sneffels';

-- Capitol Peak - Most technical standard route
-- Source: 14ers.com, peakbagger.com
UPDATE peaks SET
  nearest_town = 'Aspen',
  national_forest = 'White River National Forest',
  prominence_ft = 1978
WHERE slug = 'capitol-peak';

-- ========================================
-- UPDATE ROUTES WITH NEW FIELDS
-- ========================================

-- All standard routes are out-and-back
UPDATE routes SET
  route_type = 'Out and back',
  four_wd_required = false
WHERE is_standard = true;

-- Note: Some trailheads may require 4WD in reality, but for these
-- standard routes they all have accessible 2WD parking (verified 14ers.com)
