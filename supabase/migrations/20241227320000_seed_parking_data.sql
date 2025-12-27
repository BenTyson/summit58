-- Seed parking data for high-priority peaks
-- These are the most popular 14ers with known parking challenges

-- Quandary Peak - East Ridge (Standard Route)
UPDATE routes SET
  parking_type = 'free_lot',
  parking_capacity = 'very_limited',
  parking_fee_type = 'free',
  recommended_arrival_time = 'Before 4:30 AM on weekends',
  parking_notes = 'Very small lot fills extremely early on summer weekends. Overflow parking adds about 0.5 miles to the hike.',
  overflow_options = 'Roadside parking along CR 850 below the trailhead',
  restroom_available = FALSE,
  cell_service = 'weak'
WHERE slug = 'east-ridge' AND peak_id = (SELECT id FROM peaks WHERE slug = 'quandary-peak');

-- Mt. Bierstadt - West Slopes (Standard Route)
UPDATE routes SET
  parking_type = 'paid_lot',
  parking_capacity = 'limited',
  parking_fee_type = 'paid_daily',
  parking_fee_amount = 10.00,
  parking_fee_notes = 'America the Beautiful pass accepted',
  shuttle_available = TRUE,
  shuttle_info = 'Summer weekend shuttle from Georgetown. Book at recreation.gov.',
  recommended_arrival_time = 'Before 5:00 AM on weekends or use shuttle',
  parking_notes = 'Guanella Pass parking is limited. Shuttle highly recommended on weekends.',
  overflow_options = 'Use shuttle from Georgetown or try Clear Lake Trailhead',
  restroom_available = TRUE,
  cell_service = 'weak'
WHERE slug = 'west-slopes' AND peak_id = (SELECT id FROM peaks WHERE slug = 'mt-bierstadt');

-- Grays Peak - North Slopes (Standard Route)
UPDATE routes SET
  parking_type = 'free_lot',
  parking_capacity = 'moderate',
  parking_fee_type = 'free',
  recommended_arrival_time = 'Before 5:00 AM on weekends',
  parking_notes = 'Largest lot in the area but still fills on peak weekends. Popular combo with Torreys.',
  overflow_options = 'Additional parking along Stevens Gulch Road (adds distance)',
  restroom_available = TRUE,
  cell_service = 'none'
WHERE slug = 'north-slopes' AND peak_id = (SELECT id FROM peaks WHERE slug = 'grays-peak');

-- Torreys Peak - South Slopes (Standard Route)
UPDATE routes SET
  parking_type = 'free_lot',
  parking_capacity = 'moderate',
  parking_fee_type = 'free',
  recommended_arrival_time = 'Before 5:00 AM on weekends',
  parking_notes = 'Same parking as Grays Peak. Most hikers do both peaks.',
  overflow_options = 'Additional parking along Stevens Gulch Road (adds distance)',
  restroom_available = TRUE,
  cell_service = 'none'
WHERE slug = 'south-slopes' AND peak_id = (SELECT id FROM peaks WHERE slug = 'torreys-peak');

-- Mt. Elbert - Northeast Ridge (Standard Route)
UPDATE routes SET
  parking_type = 'free_lot',
  parking_capacity = 'large',
  parking_fee_type = 'free',
  recommended_arrival_time = 'Before 6:00 AM on weekends',
  parking_notes = 'Large lot handles crowds better than most. Still busy as the highest peak in Colorado.',
  restroom_available = TRUE,
  cell_service = 'weak'
WHERE slug = 'northeast-ridge' AND peak_id = (SELECT id FROM peaks WHERE slug = 'mt-elbert');

-- Mt. Democrat - West Slopes (from Kite Lake)
UPDATE routes SET
  parking_type = 'dispersed',
  parking_capacity = 'unlimited',
  parking_fee_type = 'free',
  parking_notes = 'Dispersed parking along road to Kite Lake. Popular for Decalibron circuit (Democrat, Cameron, Lincoln, Bross).',
  overflow_options = 'Plenty of dispersed camping and parking options',
  restroom_available = FALSE,
  cell_service = 'none'
WHERE slug = 'west-slopes' AND peak_id = (SELECT id FROM peaks WHERE slug = 'mt-democrat');

-- Maroon Peak - South Ridge
UPDATE routes SET
  parking_type = 'permit_required',
  parking_capacity = 'limited',
  parking_fee_type = 'permit_required',
  shuttle_available = TRUE,
  shuttle_info = 'Mandatory shuttle from Aspen Highlands during peak season. Timed entry reservations required.',
  recommended_arrival_time = 'Book timed entry weeks in advance',
  parking_notes = 'No personal vehicles during peak season. Must use shuttle or hold camping permit.',
  restroom_available = TRUE,
  cell_service = 'moderate'
WHERE slug = 'south-ridge' AND peak_id = (SELECT id FROM peaks WHERE slug = 'maroon-peak');
