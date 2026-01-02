-- Fix Bierstadt parking data
-- Primary parking at Guanella Pass is FREE (just requires free self-issuing wilderness permit)
-- The $10 paid lot mentioned was actually overflow/auxiliary parking

-- Update West Slopes route
UPDATE routes
SET
  parking_type = 'free_lot',
  parking_fee_type = 'free',
  parking_fee_amount = NULL,
  parking_notes = 'Free parking at Bierstadt Trailhead. Free self-issuing wilderness permit required. Lot fills early on weekends (arrive before 5am in summer). No roadside parking allowed - strictly enforced with $87.50 tickets and towing.',
  overflow_options = 'Overflow parking across the road at Square Top trailhead. Shuttle available from Georgetown on summer weekends.'
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'mt-bierstadt')
  AND name = 'West Slopes';

-- Update Sawtooth Traverse route
UPDATE routes
SET
  parking_type = 'free_lot',
  parking_fee_type = 'free',
  parking_fee_amount = NULL,
  parking_notes = 'Free parking at Guanella Pass summit. Free self-issuing wilderness permit required. America the Beautiful pass NOT needed (parking is free). Lot fills early on weekends.',
  overflow_options = 'Overflow parking at nearby pullouts. Shuttle available from Georgetown on summer weekends. No roadside parking - strictly enforced.'
WHERE peak_id = (SELECT id FROM peaks WHERE slug = 'mt-bierstadt')
  AND name = 'Sawtooth Traverse';
