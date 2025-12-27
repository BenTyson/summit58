-- Add comprehensive parking fields to routes table
-- This migration adds parking information for trailhead access

-- Parking lot type
ALTER TABLE routes ADD COLUMN IF NOT EXISTS parking_type TEXT CHECK (
  parking_type IS NULL OR parking_type IN (
    'free_lot',           -- Designated free parking lot
    'paid_lot',           -- Designated paid parking lot
    'street_parking',     -- Roadside/street parking
    'dispersed',          -- Dispersed camping/parking area
    'pullout',            -- Roadside pullouts
    'private_lot',        -- Private lot (fee station)
    'permit_required'     -- Permit-only parking area
  )
);

-- Parking capacity indicator
ALTER TABLE routes ADD COLUMN IF NOT EXISTS parking_capacity TEXT CHECK (
  parking_capacity IS NULL OR parking_capacity IN (
    'very_limited',   -- <20 spots
    'limited',        -- 20-50 spots
    'moderate',       -- 50-100 spots
    'large',          -- 100+ spots
    'unlimited'       -- Dispersed/street with no fixed limit
  )
);

-- Fee information
ALTER TABLE routes ADD COLUMN IF NOT EXISTS parking_fee_type TEXT CHECK (
  parking_fee_type IS NULL OR parking_fee_type IN (
    'free',
    'paid_daily',         -- Daily fee
    'paid_annual',        -- Annual pass required
    'donation',           -- Suggested donation
    'permit_required'     -- Requires special permit
  )
);
ALTER TABLE routes ADD COLUMN IF NOT EXISTS parking_fee_amount DECIMAL(5,2);
ALTER TABLE routes ADD COLUMN IF NOT EXISTS parking_fee_notes TEXT;

-- Shuttle availability
ALTER TABLE routes ADD COLUMN IF NOT EXISTS shuttle_available BOOLEAN DEFAULT false;
ALTER TABLE routes ADD COLUMN IF NOT EXISTS shuttle_info TEXT;

-- Overflow options
ALTER TABLE routes ADD COLUMN IF NOT EXISTS overflow_options TEXT;

-- Recommended arrival time for busy periods
ALTER TABLE routes ADD COLUMN IF NOT EXISTS recommended_arrival_time TEXT;

-- Special parking notes (seasonal closures, reservation systems)
ALTER TABLE routes ADD COLUMN IF NOT EXISTS parking_notes TEXT;

-- Restroom availability at trailhead
ALTER TABLE routes ADD COLUMN IF NOT EXISTS restroom_available BOOLEAN;

-- Cell service at trailhead
ALTER TABLE routes ADD COLUMN IF NOT EXISTS cell_service TEXT CHECK (
  cell_service IS NULL OR cell_service IN ('none', 'weak', 'moderate', 'good')
);

-- Create indexes for parking queries
CREATE INDEX IF NOT EXISTS idx_routes_parking_type ON routes(parking_type) WHERE parking_type IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_routes_shuttle ON routes(shuttle_available) WHERE shuttle_available = true;

COMMENT ON COLUMN routes.parking_type IS 'Type of parking available at trailhead';
COMMENT ON COLUMN routes.parking_capacity IS 'Approximate parking capacity: very_limited (<20), limited (20-50), moderate (50-100), large (100+), unlimited (dispersed)';
COMMENT ON COLUMN routes.parking_fee_type IS 'Fee structure for parking';
COMMENT ON COLUMN routes.parking_fee_amount IS 'Daily parking fee amount in USD';
COMMENT ON COLUMN routes.parking_fee_notes IS 'Notes about fees, accepted passes, etc.';
COMMENT ON COLUMN routes.shuttle_available IS 'Whether shuttle service is available to this trailhead';
COMMENT ON COLUMN routes.shuttle_info IS 'Details about shuttle service (times, provider, etc.)';
COMMENT ON COLUMN routes.overflow_options IS 'Alternative parking options when main lot is full';
COMMENT ON COLUMN routes.recommended_arrival_time IS 'Recommended arrival time for peak season weekends';
COMMENT ON COLUMN routes.parking_notes IS 'Additional parking notes, seasonal closures, special requirements';
COMMENT ON COLUMN routes.restroom_available IS 'Whether restroom facilities are available at trailhead';
COMMENT ON COLUMN routes.cell_service IS 'Cell phone service quality at trailhead';
