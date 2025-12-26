-- Trail condition reports submitted by users
CREATE TABLE IF NOT EXISTS trail_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  peak_id UUID NOT NULL REFERENCES peaks(id) ON DELETE CASCADE,

  -- When they hiked
  hike_date DATE NOT NULL,

  -- Trail conditions
  trail_status TEXT CHECK (trail_status IN ('clear', 'muddy', 'snowy', 'icy', 'mixed')),
  snow_depth_inches INTEGER,  -- null if no snow

  -- Crowd level
  crowd_level TEXT CHECK (crowd_level IN ('empty', 'light', 'moderate', 'crowded', 'packed')),

  -- Access & hazards
  road_status TEXT CHECK (road_status IN ('open', 'rough', '4wd_required', 'closed')),
  parking_notes TEXT,
  hazards TEXT[],  -- array: ['fallen_trees', 'stream_crossing', 'rockfall', 'wildlife', 'lightning_risk']

  -- General notes
  notes TEXT,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX trail_reports_peak_id_idx ON trail_reports(peak_id);
CREATE INDEX trail_reports_user_id_idx ON trail_reports(user_id);
CREATE INDEX trail_reports_hike_date_idx ON trail_reports(hike_date DESC);
CREATE INDEX trail_reports_created_at_idx ON trail_reports(created_at DESC);

-- Enable RLS
ALTER TABLE trail_reports ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Trail reports are publicly readable"
  ON trail_reports FOR SELECT USING (true);

-- Users can insert their own reports
CREATE POLICY "Users can insert own trail reports"
  ON trail_reports FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own reports
CREATE POLICY "Users can update own trail reports"
  ON trail_reports FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own reports
CREATE POLICY "Users can delete own trail reports"
  ON trail_reports FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER trail_reports_updated_at
  BEFORE UPDATE ON trail_reports
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
