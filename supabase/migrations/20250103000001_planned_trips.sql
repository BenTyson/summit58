-- Planned Trips table for future trip planning
CREATE TABLE IF NOT EXISTS planned_trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- Trip details
  title TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,  -- NULL for single-day trips
  notes TEXT,
  status TEXT DEFAULT 'planned' CHECK (status IN ('planned', 'completed', 'cancelled')),

  -- Visibility
  is_public BOOLEAN DEFAULT false,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Junction table for trip peaks (many-to-many)
CREATE TABLE IF NOT EXISTS planned_trip_peaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES planned_trips(id) ON DELETE CASCADE,
  peak_id UUID NOT NULL REFERENCES peaks(id) ON DELETE CASCADE,
  route_id UUID REFERENCES routes(id) ON DELETE SET NULL,
  day_number INTEGER DEFAULT 1,  -- Which day of multi-day trip
  sort_order INTEGER DEFAULT 0,
  UNIQUE(trip_id, peak_id)
);

-- Indexes
CREATE INDEX planned_trips_user_id_idx ON planned_trips(user_id);
CREATE INDEX planned_trips_start_date_idx ON planned_trips(start_date);
CREATE INDEX planned_trip_peaks_trip_id_idx ON planned_trip_peaks(trip_id);

-- Enable RLS
ALTER TABLE planned_trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE planned_trip_peaks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for planned_trips
CREATE POLICY "Users can view own planned trips"
  ON planned_trips FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view public planned trips"
  ON planned_trips FOR SELECT
  USING (is_public = true);

CREATE POLICY "Users can insert own planned trips"
  ON planned_trips FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own planned trips"
  ON planned_trips FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own planned trips"
  ON planned_trips FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for planned_trip_peaks (inherit from parent trip)
CREATE POLICY "Users can view peaks for accessible trips"
  ON planned_trip_peaks FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM planned_trips pt
      WHERE pt.id = trip_id
      AND (pt.user_id = auth.uid() OR pt.is_public = true)
    )
  );

CREATE POLICY "Users can insert peaks for own trips"
  ON planned_trip_peaks FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM planned_trips pt
      WHERE pt.id = trip_id
      AND pt.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update peaks for own trips"
  ON planned_trip_peaks FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM planned_trips pt
      WHERE pt.id = trip_id
      AND pt.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete peaks from own trips"
  ON planned_trip_peaks FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM planned_trips pt
      WHERE pt.id = trip_id
      AND pt.user_id = auth.uid()
    )
  );

-- Updated_at trigger function (create if not exists)
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Updated_at trigger
CREATE TRIGGER planned_trips_updated_at
  BEFORE UPDATE ON planned_trips
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
