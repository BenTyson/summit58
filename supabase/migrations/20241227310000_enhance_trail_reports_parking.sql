-- Enhance trail reports with more detailed parking feedback
-- Adds parking status at arrival and arrival time for crowdsourced parking data

-- Parking lot status when user arrived
ALTER TABLE trail_reports ADD COLUMN IF NOT EXISTS parking_status TEXT CHECK (
  parking_status IS NULL OR parking_status IN (
    'empty',        -- Plenty of spots available
    'filling',      -- Some spots taken, room available
    'nearly_full',  -- Few spots left
    'full',         -- Main lot full
    'overflow'      -- Had to use overflow parking
  )
);

-- What time user arrived at trailhead
ALTER TABLE trail_reports ADD COLUMN IF NOT EXISTS arrival_time TIME;

-- Create index for parking status queries
CREATE INDEX IF NOT EXISTS idx_trail_reports_parking_status ON trail_reports(parking_status) WHERE parking_status IS NOT NULL;

COMMENT ON COLUMN trail_reports.parking_status IS 'Parking lot status when user arrived at trailhead';
COMMENT ON COLUMN trail_reports.arrival_time IS 'Time of day user arrived at trailhead';
