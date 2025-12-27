-- Add high-priority alternate routes for popular 14ers
-- Source: 14ers.com route pages
-- Generated: 2025-12-27

-- ============================================
-- LONGS PEAK ALTERNATE ROUTES
-- ============================================

-- Longs Peak - Loft Route (Class 3)
INSERT INTO routes (
  peak_id, name, slug, difficulty_class, distance_miles, elevation_gain_ft,
  trailhead_name, trailhead_latitude, trailhead_longitude, trailhead_elevation,
  description, parking_type, parking_capacity, parking_fee_type,
  parking_notes, restroom_available, cell_service
) VALUES (
  (SELECT id FROM peaks WHERE slug = 'longs-peak'),
  'Loft Route',
  'loft-route',
  3,
  13.0,
  5300,
  'Longs Peak Trailhead',
  40.27223,
  -105.55679,
  9400,
  'Challenging Class 3 scramble that diverges from Keyhole Route at Chasm Lake junction. Avoids the crowded Keyhole bottleneck. Ascends Loft Couloir with loose dirt and Class 3 scrambling, traverses the Loft boulder field, then descends to Clark''s Arrow via technical moves. High exposure and considerable rockfall risk. Good alternative for experienced scramblers wanting to avoid crowds.',
  'free_lot',
  'moderate',
  'free',
  'Same lot as Keyhole Route at Longs Peak Ranger Station. Fills very early on summer weekends. RMNP - dogs NOT allowed.',
  TRUE,
  'weak'
);

-- Longs Peak - Keplinger Couloir (Class 3)
INSERT INTO routes (
  peak_id, name, slug, difficulty_class, distance_miles, elevation_gain_ft,
  trailhead_name, trailhead_latitude, trailhead_longitude, trailhead_elevation,
  description, parking_type, parking_capacity, parking_fee_type,
  parking_notes, restroom_available, cell_service
) VALUES (
  (SELECT id FROM peaks WHERE slug = 'longs-peak'),
  'Keplinger Couloir',
  'keplinger-couloir',
  3,
  16.0,
  5900,
  'Sandbeach Lake Trailhead',
  40.219776,
  -105.534,
  8400,
  'Remote south-side approach via Sandbeach Lake Trail with 1.6 miles of bushwhacking through timber. Ascends Keplinger''s Couloir (westernmost couloir on south face) from 12,000 to 13,600 ft with slopes up to 45 degrees. Very rarely done due to length and bushwhacking. For experienced climbers seeking solitude and challenge.',
  'free_lot',
  'moderate',
  'free',
  'Sandbeach Lake Trailhead parking. Less crowded than Longs Peak TH. RMNP - dogs NOT allowed.',
  FALSE,
  'weak'
);

-- ============================================
-- MT. ELBERT ALTERNATE ROUTES
-- ============================================

-- Mt. Elbert - East Ridge (South Trailhead)
INSERT INTO routes (
  peak_id, name, slug, difficulty_class, distance_miles, elevation_gain_ft,
  trailhead_name, trailhead_latitude, trailhead_longitude, trailhead_elevation,
  description, parking_type, parking_capacity, parking_fee_type,
  parking_notes, restroom_available, cell_service
) VALUES (
  (SELECT id FROM peaks WHERE slug = 'mt-elbert'),
  'East Ridge',
  'east-ridge',
  1,
  11.25,
  4200,
  'Mt. Elbert (South)',
  39.09933,
  -106.36714,
  10500,
  'Popular alternate approach from the south trailhead. Follows CDT/Colorado Trail through forest before ascending the east ridge. Excellent winter route with minimal avalanche danger. Distributes hiker traffic away from crowded Northeast Ridge. 4WD trailhead; 2WD adds 4 miles RT from lower parking.',
  'free_lot',
  'moderate',
  'free',
  '4WD trailhead at 10,500 ft. 2WD can park lower and walk the road (adds 4 miles RT).',
  FALSE,
  'weak'
);

-- Mt. Elbert - Southeast Ridge (Black Cloud Trail)
INSERT INTO routes (
  peak_id, name, slug, difficulty_class, distance_miles, elevation_gain_ft,
  trailhead_name, trailhead_latitude, trailhead_longitude, trailhead_elevation,
  description, parking_type, parking_capacity, parking_fee_type,
  parking_notes, restroom_available, cell_service
) VALUES (
  (SELECT id FROM peaks WHERE slug = 'mt-elbert'),
  'Southeast Ridge',
  'southeast-ridge',
  2,
  10.5,
  5300,
  'Black Cloud Trailhead',
  39.06944,
  -106.43361,
  9700,
  'Renowned for solitude - best way to summit Elbert if avoiding crowds. Begins with switchbacks along Black Cloud Creek, passes old mining remnants at 11,600 ft. Ascends steep northeast-facing slope to ridge crest near 13,600 ft. Tags South Elbert (14,134 ft) before final 0.75 miles to true summit. Route-finding straightforward along ridge.',
  'free_lot',
  'limited',
  'free',
  'Black Cloud Trailhead. Much less crowded than Northeast Ridge. 2WD accessible.',
  FALSE,
  'none'
);

-- ============================================
-- TORREYS PEAK ALTERNATE ROUTES
-- ============================================

-- Torreys Peak - Kelso Ridge (Class 3)
INSERT INTO routes (
  peak_id, name, slug, difficulty_class, distance_miles, elevation_gain_ft,
  trailhead_name, trailhead_latitude, trailhead_longitude, trailhead_elevation,
  description, parking_type, parking_capacity, parking_fee_type,
  parking_notes, restroom_available, cell_service
) VALUES (
  (SELECT id FROM peaks WHERE slug = 'torreys-peak'),
  'Kelso Ridge',
  'kelso-ridge',
  3,
  6.75,
  3100,
  'Grays Peak Trailhead',
  39.642742,
  -105.821259,
  11280,
  'One of Colorado''s most popular Class 3 scrambles. Begins on Grays Peak trail, diverges at 12,300 ft following cairn-marked Kelso Ridge trail. Features sustained scrambling with a distinctive white rock wall and exposed knife-edge crux near 14,000 ft. Excellent progression route for climbers wanting to advance beyond Class 2. Descend via standard South Slopes trail.',
  'free_lot',
  'moderate',
  'free',
  'Same lot as standard Grays/Torreys trailhead at Stevens Gulch.',
  TRUE,
  'none'
);

-- Torreys Peak - Grays-Torreys Combo
INSERT INTO routes (
  peak_id, name, slug, difficulty_class, distance_miles, elevation_gain_ft,
  trailhead_name, trailhead_latitude, trailhead_longitude, trailhead_elevation,
  description, parking_type, parking_capacity, parking_fee_type,
  parking_notes, restroom_available, cell_service
) VALUES (
  (SELECT id FROM peaks WHERE slug = 'torreys-peak'),
  'Grays-Torreys Combo',
  'grays-torreys-combo',
  1,
  8.25,
  3600,
  'Grays Peak Trailhead',
  39.633820,
  -105.817520,
  11280,
  'Colorado''s most popular two-peak day. Ascends Grays Peak first (3.5 miles, 3,000 ft gain), then traverses north ridge to Grays-Torreys saddle at 13,700 ft before continuing to Torreys summit. Most efficient way to bag both peaks in a single outing. Winter note: southeast side of Kelso Mountain is avalanche prone.',
  'free_lot',
  'moderate',
  'free',
  'Stevens Gulch Trailhead - fills on peak summer weekends by 5am.',
  TRUE,
  'none'
);

-- ============================================
-- QUANDARY PEAK ALTERNATE ROUTE
-- ============================================

-- Quandary Peak - West Ridge (Class 3)
INSERT INTO routes (
  peak_id, name, slug, difficulty_class, distance_miles, elevation_gain_ft,
  trailhead_name, trailhead_latitude, trailhead_longitude, trailhead_elevation,
  description, parking_type, parking_capacity, parking_fee_type,
  parking_notes, restroom_available, cell_service
) VALUES (
  (SELECT id FROM peaks WHERE slug = 'quandary-peak'),
  'West Ridge',
  'west-ridge',
  3,
  4.0,
  2650,
  'Blue Lakes Trailhead',
  39.397236,
  -106.106430,
  11700,
  'Technical Class 3 alternative for those wanting more challenge on this beginner-friendly peak. Ascends from Blue Lakes dam through a basin, gains west ridge around 13,400 ft. Features vertical crack and prominent crux wall with high exposure. Many climbers descend via standard East Ridge. Good progression route for aspiring technical climbers.',
  'free_lot',
  'limited',
  'free',
  'Blue Lakes Trailhead - different access than standard East Ridge.',
  FALSE,
  'weak'
);

-- ============================================
-- MT. BIERSTADT ALTERNATE ROUTE
-- ============================================

-- Mt. Bierstadt - Sawtooth Traverse to Blue Sky (Class 3)
INSERT INTO routes (
  peak_id, name, slug, difficulty_class, distance_miles, elevation_gain_ft,
  trailhead_name, trailhead_latitude, trailhead_longitude, trailhead_elevation,
  description, parking_type, parking_capacity, parking_fee_type,
  parking_notes, restroom_available, cell_service
) VALUES (
  (SELECT id FROM peaks WHERE slug = 'mt-bierstadt'),
  'Sawtooth Traverse',
  'sawtooth-traverse',
  3,
  10.5,
  3900,
  'Guanella Pass',
  39.582638,
  -105.668610,
  11669,
  'One of Colorado''s classic alpine ridge traverses. Ascends Bierstadt via west slopes, then traverses the infamous Sawtooth ridge to Mt. Blue Sky - a rugged Class 3 scramble with large gendarmes and exposed ledges. Descends via Scott Gomer Creek drainage. A challenging day requiring substantial scrambling experience. Combines two 14ers in one epic outing.',
  'paid_lot',
  'limited',
  'paid_daily',
  'Guanella Pass parking ($10). America the Beautiful pass accepted. Shuttle available on summer weekends.',
  TRUE,
  'weak'
);
