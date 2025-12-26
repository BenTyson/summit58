-- User Summits table for Peak Bagger feature
-- Allows users to log their summit achievements

CREATE TABLE IF NOT EXISTS user_summits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  peak_id UUID NOT NULL REFERENCES peaks(id) ON DELETE CASCADE,
  route_id UUID REFERENCES routes(id) ON DELETE SET NULL,

  -- Summit details
  date_summited DATE NOT NULL,
  conditions TEXT,  -- "Bluebird", "Afternoon storms", "Winter ascent"
  notes TEXT,       -- Personal story/journal entry

  -- Metrics (optional)
  start_time TIME,
  summit_time TIME,
  party_size INTEGER,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()

  -- No UNIQUE constraint: users can log multiple summits of same peak
);

-- Indexes for efficient queries
CREATE INDEX user_summits_user_id_idx ON user_summits(user_id);
CREATE INDEX user_summits_peak_id_idx ON user_summits(peak_id);
CREATE INDEX user_summits_date_idx ON user_summits(date_summited DESC);

-- Enable RLS
ALTER TABLE user_summits ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Anyone can view summits (for leaderboards/community features)
CREATE POLICY "Summits are publicly viewable"
  ON user_summits FOR SELECT
  USING (true);

-- Users can insert their own summits
CREATE POLICY "Users can insert own summits"
  ON user_summits FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own summits
CREATE POLICY "Users can update own summits"
  ON user_summits FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own summits
CREATE POLICY "Users can delete own summits"
  ON user_summits FOR DELETE
  USING (auth.uid() = user_id);
