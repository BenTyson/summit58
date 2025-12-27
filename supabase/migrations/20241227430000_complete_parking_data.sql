-- Complete parking data for all remaining 14er routes
-- Source: 14ers.com trailhead and route pages
-- Generated: 2025-12-27

-- ============================================
-- FRONT RANGE
-- ============================================

-- Longs Peak - Keyhole Route
UPDATE routes SET
  parking_type = 'free_lot',
  parking_capacity = 'moderate',
  parking_fee_type = 'free',
  recommended_arrival_time = 'Before 3:00 AM on summer weekends',
  parking_notes = 'Paved lot at Longs Peak Ranger Station. Fills very early on summer weekends. RMNP - dogs NOT allowed. No car-camping in lot.',
  overflow_options = 'Adjacent tent campground; no overflow parking available once lot is full',
  restroom_available = TRUE,
  cell_service = 'weak'
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'longs-peak');

-- Mt. Blue Sky - West Ridge
UPDATE routes SET
  parking_type = 'free_lot',
  parking_capacity = 'moderate',
  parking_fee_type = 'free',
  parking_notes = 'Free parking near Echo Lake picnic area and Echo Lake Lodge. Wilderness permit required (self-issue at kiosk).',
  restroom_available = FALSE,
  cell_service = 'weak'
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'mt-blue-sky');

-- Pikes Peak - Northwest Slopes
UPDATE routes SET
  parking_type = 'free_lot',
  parking_capacity = 'moderate',
  parking_fee_type = 'free',
  parking_notes = 'Free at Crags Trailhead. Campground nearby is $11. FS Road 383 closed December 1 - June 1.',
  overflow_options = 'Smaller winter lot 1.2 miles from trailhead (10-15 cars)',
  restroom_available = TRUE,
  cell_service = 'weak'
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'pikes-peak');

-- ============================================
-- TENMILE / MOSQUITO RANGE
-- ============================================

-- Mt. Lincoln - West Ridge (Kite Lake)
UPDATE routes SET
  parking_type = 'paid_lot',
  parking_capacity = 'moderate',
  parking_fee_type = 'paid_daily',
  parking_fee_amount = 8.00,
  parking_notes = 'Paid lot at Kite Lake. Last mile rough but 2WD possible when dry. Popular for Decalibron circuit.',
  restroom_available = TRUE,
  cell_service = 'none'
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'mt-lincoln');

-- Mt. Cameron - Decalibron (Kite Lake)
UPDATE routes SET
  parking_type = 'paid_lot',
  parking_capacity = 'moderate',
  parking_fee_type = 'paid_daily',
  parking_fee_amount = 8.00,
  parking_notes = 'Same as Mt. Lincoln - Kite Lake lot. Good-clearance 2WD can reach most of road when dry. Camping available.',
  restroom_available = TRUE,
  cell_service = 'none'
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'mt-cameron');

-- Mt. Bross - East Slopes (Kite Lake)
UPDATE routes SET
  parking_type = 'paid_lot',
  parking_capacity = 'moderate',
  parking_fee_type = 'paid_daily',
  parking_fee_amount = 8.00,
  parking_notes = 'Same as Mt. Lincoln - Kite Lake lot. WARNING: Summit officially closed due to private property issues.',
  restroom_available = TRUE,
  cell_service = 'none'
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'mt-bross');

-- Mt. Sherman - Southwest Ridge
UPDATE routes SET
  parking_type = 'free_lot',
  parking_capacity = 'large',
  parking_fee_type = 'free',
  parking_notes = 'Most accessible 14er by passenger car when dry - can reach 11,800 ft. Multiple parking options at different elevations.',
  overflow_options = 'Upper small lot with pulloffs available',
  restroom_available = FALSE,
  cell_service = 'none'
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'mt-sherman');

-- ============================================
-- SAWATCH RANGE
-- ============================================

-- Mt. Massive - East Slopes
UPDATE routes SET
  parking_type = 'free_lot',
  parking_capacity = 'moderate',
  parking_fee_type = 'free',
  parking_notes = 'Standard lot at Mt. Massive Trailhead. Halfmoon Creek is dirt road but passable. Mt. Massive Wilderness regulations apply.',
  restroom_available = FALSE,
  cell_service = 'weak'
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'mt-massive');

-- Mt. Harvard - South Slopes
UPDATE routes SET
  parking_type = 'free_lot',
  parking_capacity = 'moderate',
  parking_fee_type = 'free',
  parking_notes = 'Free parking loop at N. Cottonwood Creek TH. High-clearance recommended for final 5+ miles on CR 365. Collegiate Peaks Wilderness.',
  overflow_options = 'Additional parking along road approaching trailhead',
  restroom_available = FALSE,
  cell_service = 'none'
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'mt-harvard');

-- La Plata Peak - Northwest Ridge
UPDATE routes SET
  parking_type = 'free_lot',
  parking_capacity = 'moderate',
  parking_fee_type = 'free',
  parking_notes = 'Marked trailhead on CO 82, 14.6 miles west of Leadville. Easy highway access. Collegiate Peaks Wilderness.',
  restroom_available = FALSE,
  cell_service = 'weak'
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'la-plata-peak');

-- Mt. Antero - West Slopes
UPDATE routes SET
  parking_type = 'dispersed',
  parking_capacity = 'moderate',
  parking_fee_type = 'free',
  parking_notes = '4WD REQUIRED for upper trailhead above 10,850 ft. 2WD parking available at end of CR 162. Famous for gem/mineral collecting.',
  overflow_options = 'Plenty of pull-offs at lower elevations for 2WD vehicles',
  restroom_available = FALSE,
  cell_service = 'none'
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'mt-antero');

-- Mt. Shavano - East Slopes
UPDATE routes SET
  parking_type = 'free_lot',
  parking_capacity = 'limited',
  parking_fee_type = 'free',
  recommended_arrival_time = 'Before 5:00 AM on summer weekends',
  parking_notes = 'About 25 vehicles in main lot. Severely rutted section requires high clearance despite 2WD rating.',
  overflow_options = 'Overflow parking 0.1 mile beyond main lot',
  restroom_available = TRUE,
  cell_service = 'weak'
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'mt-shavano');

-- Tabeguache Peak - East Slopes (same TH as Shavano)
UPDATE routes SET
  parking_type = 'free_lot',
  parking_capacity = 'limited',
  parking_fee_type = 'free',
  recommended_arrival_time = 'Before 5:00 AM on summer weekends',
  parking_notes = 'Same trailhead as Mt. Shavano. Most hikers combine both peaks. High clearance strongly recommended.',
  overflow_options = 'Overflow parking 0.1 mile beyond main lot',
  restroom_available = TRUE,
  cell_service = 'weak'
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'tabeguache-peak');

-- Mt. Belford - West Slopes (Missouri Gulch)
UPDATE routes SET
  parking_type = 'free_lot',
  parking_capacity = 'large',
  parking_fee_type = 'free',
  recommended_arrival_time = 'Before 5:30 AM on summer weekends',
  parking_notes = 'Large lot at Missouri Gulch TH. Very popular. 2WD accessible via Chaffee County 390. Collegiate Peaks Wilderness.',
  restroom_available = TRUE,
  cell_service = 'weak'
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'mt-belford');

-- Mt. Oxford - West Slopes (Missouri Gulch, same as Belford)
UPDATE routes SET
  parking_type = 'free_lot',
  parking_capacity = 'large',
  parking_fee_type = 'free',
  recommended_arrival_time = 'Before 5:30 AM on summer weekends',
  parking_notes = 'Same as Mt. Belford - Missouri Gulch TH. Most hikers combine both peaks.',
  restroom_available = TRUE,
  cell_service = 'weak'
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'mt-oxford');

-- Missouri Mountain - West Slopes (Missouri Gulch)
UPDATE routes SET
  parking_type = 'free_lot',
  parking_capacity = 'large',
  parking_fee_type = 'free',
  recommended_arrival_time = 'Before 5:30 AM on summer weekends',
  parking_notes = 'Same as Mt. Belford - Missouri Gulch TH. 7.5 miles on Chaffee County 390 from US 24. Congested on summer weekends.',
  restroom_available = TRUE,
  cell_service = 'weak'
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'missouri-mountain');

-- Mt. Princeton - East Slopes
UPDATE routes SET
  parking_type = 'free_lot',
  parking_capacity = 'large',
  parking_fee_type = 'free',
  parking_notes = 'Large 2WD lot at 8,900 ft. Optional 4WD upper pullouts at 10,800-11,000 ft (5-6 vehicles). Narrow road with limited passing.',
  restroom_available = FALSE,
  cell_service = 'weak'
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'mt-princeton');

-- Mt. Yale - East Slopes (Denny Creek)
UPDATE routes SET
  parking_type = 'free_lot',
  parking_capacity = 'moderate',
  parking_fee_type = 'free',
  parking_notes = 'Paved lot at Denny Creek TH. 12 miles from Buena Vista via CR 306. Collegiate Peaks Wilderness.',
  restroom_available = FALSE,
  cell_service = 'weak'
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'mt-yale');

-- Mt. Columbia - Standard Route
UPDATE routes SET
  parking_type = 'free_lot',
  parking_capacity = 'moderate',
  parking_fee_type = 'free',
  recommended_arrival_time = 'Before 5:00 AM on summer weekends',
  parking_notes = 'About 30 cars at North Cottonwood TH. 2WD accessible. Shared with Mt. Harvard. Popular trailhead fills early.',
  overflow_options = 'Overflow parking along road approaching trailhead',
  restroom_available = FALSE,
  cell_service = 'none'
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'mt-columbia');

-- Mt. of the Holy Cross - North Ridge
UPDATE routes SET
  parking_type = 'free_lot',
  parking_capacity = 'moderate',
  parking_fee_type = 'free',
  parking_notes = 'Unpaved lot at Half Moon Pass. Tigiwon Road is rugged but most cars can make it. ROAD CLOSED Nov 22 - June 21.',
  restroom_available = FALSE,
  cell_service = 'none'
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'mt-of-the-holy-cross');

-- Huron Peak - Northwest Slopes
UPDATE routes SET
  parking_type = 'free_lot',
  parking_capacity = 'moderate',
  parking_fee_type = 'free',
  parking_notes = 'Lower 2WD TH in south Winfield with large parking/camping area. Lake Ann 4WD TH requires good clearance. Walking from lower adds 4 miles RT.',
  restroom_available = FALSE,
  cell_service = 'none'
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'huron-peak');

-- ============================================
-- ELK MOUNTAINS
-- ============================================

-- Capitol Peak - Capitol Creek
UPDATE routes SET
  parking_type = 'free_lot',
  parking_capacity = 'moderate',
  parking_fee_type = 'free',
  parking_notes = '4WD recommended for last mile when wet/rutted. CAMPING PERMIT REQUIRED above cattle gate (~4 mi from TH). Maroon Bells-Snowmass Wilderness.',
  overflow_options = 'Trailer parking area 1.9 miles before main trailhead for low-clearance vehicles',
  restroom_available = FALSE,
  cell_service = 'weak'
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'capitol-peak');

-- North Maroon Peak - South Ridge (Maroon Lake)
UPDATE routes SET
  parking_type = 'permit_required',
  parking_capacity = 'limited',
  parking_fee_type = 'permit_required',
  shuttle_available = TRUE,
  shuttle_info = 'Mandatory shuttle from Aspen Highlands mid-June to mid-September. Timed entry reservations required.',
  recommended_arrival_time = 'Book timed entry permits weeks in advance',
  parking_notes = 'Reservation required. Road closed 8am-5pm in summer. Alternative: Aspen Highlands garage $7/hr ($40/24hr max).',
  restroom_available = TRUE,
  cell_service = 'moderate'
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'north-maroon-peak');

-- Pyramid Peak - Northeast Ridge (Maroon Lake)
UPDATE routes SET
  parking_type = 'permit_required',
  parking_capacity = 'limited',
  parking_fee_type = 'permit_required',
  shuttle_available = TRUE,
  shuttle_info = 'Mandatory shuttle from Aspen Highlands mid-June to mid-September. Timed entry reservations required.',
  recommended_arrival_time = 'Book timed entry permits weeks in advance',
  parking_notes = 'Same as North Maroon - Maroon Lake requires advance reservation. "Midnight-to-Midnight" permits allow arrival between midnight and 8am.',
  restroom_available = TRUE,
  cell_service = 'moderate'
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'pyramid-peak');

-- Snowmass Mountain - East Slopes
UPDATE routes SET
  parking_type = 'dispersed',
  parking_capacity = 'moderate',
  parking_fee_type = 'free',
  parking_notes = '11.3 miles from Snowmass on Snowmass Creek Road. Unpaved after 7 miles. Maroon Bells-Snowmass Wilderness regulations apply.',
  restroom_available = FALSE,
  cell_service = 'none'
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'snowmass-mountain');

-- Castle Peak - Northeast Ridge
UPDATE routes SET
  parking_type = 'dispersed',
  parking_capacity = 'limited',
  parking_fee_type = 'free',
  parking_notes = 'Dispersed camping and pulloffs along FR 102. Creek crossing at 1.3 miles challenging in spring. 4WD can reach 12,800 ft.',
  overflow_options = 'Free camping spots along first 1.25 miles of FR 102',
  restroom_available = FALSE,
  cell_service = 'none'
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'castle-peak');

-- Conundrum Peak - South Ridge (Castle Creek)
UPDATE routes SET
  parking_type = 'dispersed',
  parking_capacity = 'moderate',
  parking_fee_type = 'free',
  parking_notes = 'Same as Castle Peak - dispersed camping and pullouts along FR 102. Creek crossing at 1.3 miles. 4WD recommended beyond 1.25 miles.',
  restroom_available = FALSE,
  cell_service = 'none'
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'conundrum-peak');

-- ============================================
-- SAN JUAN MOUNTAINS
-- ============================================

-- Uncompahgre Peak - South Ridge
UPDATE routes SET
  parking_type = 'dispersed',
  parking_capacity = 'limited',
  parking_fee_type = 'free',
  parking_notes = '4WD REQUIRED for upper Nellie Creek TH at 11,400 ft. 2WD option adds 8 miles RT. Stream crossings difficult in early summer.',
  overflow_options = '2WD parking on Henson Creek Road/Alpine Loop',
  restroom_available = FALSE,
  cell_service = 'none'
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'uncompahgre-peak');

-- Wetterhorn Peak - Southeast Ridge
UPDATE routes SET
  parking_type = 'free_lot',
  parking_capacity = 'moderate',
  parking_fee_type = 'free',
  parking_notes = 'Lower lot accessible by 2WD. Upper trailhead requires 4WD. Access via Henson Creek Road from Lake City. Uncompahgre Wilderness.',
  restroom_available = FALSE,
  cell_service = 'none'
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'wetterhorn-peak');

-- Mt. Sneffels - Southwest Ridge (Yankee Boy Basin)
UPDATE routes SET
  parking_type = 'dispersed',
  parking_capacity = 'moderate',
  parking_fee_type = 'free',
  parking_notes = '4WD REQUIRED for upper TH at 12,460 ft. Lower "Outhouse Parking" at 11,350 ft is 2WD accessible. Mt. Sneffels Wilderness.',
  overflow_options = 'Governor Basin Junction at 6.7 miles for 2WD vehicles',
  restroom_available = TRUE,
  cell_service = 'none'
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'mt-sneffels');

-- Handies Peak - West Slopes (American Basin)
UPDATE routes SET
  parking_type = 'dispersed',
  parking_capacity = 'moderate',
  parking_fee_type = 'free',
  parking_notes = '4WD/AWD REQUIRED after mile 13.5. DO NOT use Google/Apple Maps (may route over Cinnamon Pass). Lower parking available for 2WD.',
  restroom_available = FALSE,
  cell_service = 'none'
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'handies-peak');

-- Redcloud Peak - Northeast Ridge (Silver Creek)
UPDATE routes SET
  parking_type = 'free_lot',
  parking_capacity = 'moderate',
  parking_fee_type = 'free',
  parking_notes = 'About 25 vehicles plus roadside. Easy 4WD/AWD road. Low-clearance possible with care. Outhouses available.',
  overflow_options = 'Roadside parking along approach',
  restroom_available = TRUE,
  cell_service = 'none'
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'redcloud-peak');

-- Sunshine Peak - Southwest Ridge (Silver Creek, same as Redcloud)
UPDATE routes SET
  parking_type = 'free_lot',
  parking_capacity = 'moderate',
  parking_fee_type = 'free',
  parking_notes = 'Same as Redcloud Peak - Silver Creek/Grizzly Gulch TH. Typically climbed together. Recent road improvements.',
  overflow_options = 'Roadside parking along approach',
  restroom_available = TRUE,
  cell_service = 'none'
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'sunshine-peak');

-- San Luis Peak - Northeast Ridge (Stewart Creek)
UPDATE routes SET
  parking_type = 'free_lot',
  parking_capacity = 'very_limited',
  parking_fee_type = 'free',
  parking_notes = 'Very limited parking at trailhead. High-clearance required for creek crossings. Final 4.3 miles on dirt FR 794.',
  overflow_options = 'Additional parking 1/4 mile down at Eddiesville trailhead',
  restroom_available = FALSE,
  cell_service = 'none'
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'san-luis-peak');

-- Mt. Wilson - Cross Couloir (Rock of Ages)
UPDATE routes SET
  parking_type = 'free_lot',
  parking_capacity = 'moderate',
  parking_fee_type = 'free',
  parking_notes = '4WD/good clearance required. About 30 vehicles. Big Bear Creek crossing typically passable by mid-July. Lizard Head Wilderness.',
  overflow_options = '2WD parking about 1.2 miles before trailhead',
  restroom_available = TRUE,
  cell_service = 'none'
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'mt-wilson');

-- Wilson Peak - Southwest Ridge (Rock of Ages)
UPDATE routes SET
  parking_type = 'free_lot',
  parking_capacity = 'moderate',
  parking_fee_type = 'free',
  parking_notes = 'Same as Mt. Wilson - Rock of Ages TH. 4WD/good clearance required. No camping at trailhead (meadow protection).',
  overflow_options = 'Designated camping sites along Forest Road 645',
  restroom_available = TRUE,
  cell_service = 'none'
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'wilson-peak');

-- El Diente Peak - South Slopes (Kilpacker Basin)
UPDATE routes SET
  parking_type = 'free_lot',
  parking_capacity = 'moderate',
  parking_fee_type = 'free',
  parking_notes = '2WD dirt road (FR 535) - 5+ miles from CO 145. Remote San Juan location. Lizard Head Wilderness.',
  overflow_options = 'Dispersed camping available near trailhead',
  restroom_available = FALSE,
  cell_service = 'none'
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'el-diente-peak');

-- ============================================
-- NEEDLE MOUNTAINS (Train Access)
-- ============================================

-- Mt. Eolus - South Ridge (Needleton)
UPDATE routes SET
  parking_type = 'paid_lot',
  parking_capacity = 'large',
  parking_fee_type = 'paid_daily',
  parking_fee_amount = 142.00,
  parking_fee_notes = 'Train ticket includes 4-day parking at Durango station. Split between group members.',
  parking_notes = 'TRAIN REQUIRED - Durango & Silverton Narrow Gauge Railroad. 2.5 hour ride. No pets on train. No winter access.',
  restroom_available = TRUE,
  cell_service = 'none'
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'mt-eolus');

-- Windom Peak - West Ridge (Needleton)
UPDATE routes SET
  parking_type = 'paid_lot',
  parking_capacity = 'large',
  parking_fee_type = 'paid_daily',
  parking_fee_amount = 142.00,
  parking_fee_notes = 'Train ticket includes 4-day parking at Durango station. Split between group members.',
  parking_notes = 'Same as Mt. Eolus - TRAIN REQUIRED. Durango & Silverton Railroad. Call for reservations (dont book online). Weminuche Wilderness.',
  restroom_available = TRUE,
  cell_service = 'none'
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'windom-peak');

-- Sunlight Peak - South Face (Needleton)
UPDATE routes SET
  parking_type = 'paid_lot',
  parking_capacity = 'large',
  parking_fee_type = 'paid_daily',
  parking_fee_amount = 142.00,
  parking_fee_notes = 'Train ticket includes 4-day parking at Durango station. Split between group members.',
  parking_notes = 'Same as Mt. Eolus - TRAIN REQUIRED. Durango & Silverton Railroad. 6-mile hike from Needleton to Chicago Basin.',
  restroom_available = TRUE,
  cell_service = 'none'
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'sunlight-peak');

-- North Eolus - South Ridge (Needleton)
UPDATE routes SET
  parking_type = 'paid_lot',
  parking_capacity = 'large',
  parking_fee_type = 'paid_daily',
  parking_fee_amount = 142.00,
  parking_fee_notes = 'Train ticket includes 4-day parking at Durango station. Split between group members.',
  parking_notes = 'Same as Mt. Eolus - TRAIN REQUIRED. Durango & Silverton Railroad. 6-mile hike to Chicago Basin. Weminuche Wilderness.',
  restroom_available = TRUE,
  cell_service = 'none'
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'north-eolus');

-- ============================================
-- SANGRE DE CRISTO RANGE
-- ============================================

-- Blanca Peak - Northwest Ridge (Lake Como)
UPDATE routes SET
  parking_type = 'dispersed',
  parking_capacity = 'limited',
  parking_fee_type = 'free',
  parking_notes = 'EXTREME 4WD ROAD - one of Colorados hardest. 2WD parks at ~1.5 miles. Stock 4WD to 8,800 ft. Modified 4WD only to lake.',
  overflow_options = 'Lower pullouts for 2WD vehicles',
  restroom_available = FALSE,
  cell_service = 'none'
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'blanca-peak');

-- Ellingwood Point - South Face (Lake Como)
UPDATE routes SET
  parking_type = 'dispersed',
  parking_capacity = 'limited',
  parking_fee_type = 'free',
  parking_notes = 'Same as Blanca - EXTREME 4WD ROAD. 2WD at 1.5 mi. Stock 4WD to 3.25 mi (8,800 ft). Modified 4WD only to Lake Como.',
  overflow_options = 'Lower pullouts for 2WD vehicles. Limited camping at Lake Como (narrow canyon)',
  restroom_available = FALSE,
  cell_service = 'none'
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'ellingwood-point');

-- Little Bear Peak - West Ridge (Lake Como)
UPDATE routes SET
  parking_type = 'dispersed',
  parking_capacity = 'very_limited',
  parking_fee_type = 'free',
  parking_notes = 'Same as Blanca - EXTREME 4WD road. Only 2-3 vehicles at upper spots. Car break-ins reported at lower elevations.',
  restroom_available = FALSE,
  cell_service = 'none'
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'little-bear-peak');

-- Crestone Peak - South Face (South Colony Lakes)
UPDATE routes SET
  parking_type = 'free_lot',
  parking_capacity = 'limited',
  parking_fee_type = 'free',
  parking_notes = 'Lower 2WD at 8,800 ft (~20 vehicles). Upper 4WD at 9,950 ft (~25 vehicles). Road gated at upper lot since 2009.',
  parking_fee_notes = 'NEW 2025: No overnight parking at 2WD lot (private land). Use 4WD lot for backpacking.',
  restroom_available = FALSE,
  cell_service = 'none'
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'crestone-peak');

-- Crestone Needle - South Face (South Colony Lakes)
UPDATE routes SET
  parking_type = 'free_lot',
  parking_capacity = 'limited',
  parking_fee_type = 'free',
  parking_notes = 'Same as Crestone Peak - South Colony Lakes. 4WD for upper TH. Sangre de Cristo Wilderness regulations.',
  parking_fee_notes = 'NEW 2025: No overnight parking at 2WD lot (private land). Use 4WD lot for backpacking.',
  restroom_available = FALSE,
  cell_service = 'none'
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'crestone-needle');

-- Humboldt Peak - West Ridge (South Colony Lakes)
UPDATE routes SET
  parking_type = 'free_lot',
  parking_capacity = 'limited',
  parking_fee_type = 'free',
  parking_notes = 'Same as Crestone Peak - South Colony Lakes. Lower 2WD at 8,800 ft. Upper 4WD at 9,950 ft.',
  parking_fee_notes = 'NEW 2025: No overnight parking at 2WD lot (private land). Use 4WD lot for backpacking.',
  restroom_available = FALSE,
  cell_service = 'none'
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'humboldt-peak');

-- Kit Carson Peak - Via Challenger
UPDATE routes SET
  parking_type = 'free_lot',
  parking_capacity = 'limited',
  parking_fee_type = 'free',
  parking_notes = 'Same as Crestone Peak - South Colony Lakes. 4WD strongly recommended for upper trailhead.',
  parking_fee_notes = 'NEW 2025: No overnight parking at 2WD lot (private land). Use 4WD lot for backpacking.',
  restroom_available = FALSE,
  cell_service = 'none'
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'kit-carson-peak');

-- Challenger Point - Northeast Ridge (Willow Creek)
UPDATE routes SET
  parking_type = 'dispersed',
  parking_capacity = 'limited',
  parking_fee_type = 'free',
  parking_notes = 'Dispersed parking at Willow Creek TH. 2 mi dirt road access. Sangre de Cristo Wilderness regulations.',
  restroom_available = FALSE,
  cell_service = 'none'
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'challenger-point');

-- Mt. Lindsey - Northwest Gully (Lily Lake)
UPDATE routes SET
  parking_type = 'dispersed',
  parking_capacity = 'moderate',
  parking_fee_type = 'free',
  parking_notes = 'WAIVER REQUIRED at mountlindseywaiver.com before hiking. 4WD required for final section. Rough narrow road for last 2 miles.',
  restroom_available = FALSE,
  cell_service = 'none'
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'mt-lindsey');

-- Culebra Peak - Southwest Ridge
UPDATE routes SET
  parking_type = 'private_lot',
  parking_capacity = 'large',
  parking_fee_type = 'paid_daily',
  parking_fee_amount = 150.00,
  parking_fee_notes = 'Private ranch fee includes escorted access. Must book in advance.',
  parking_notes = 'PRIVATE PROPERTY - $150 fee, advance booking required at Cielo Vista Ranch. Escorted access from ranch gate at 6am. January-July hiking season only.',
  restroom_available = FALSE,
  cell_service = 'none'
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'culebra-peak');
