-- User Reviews table for peaks
-- Allows users to rate and review peaks they've visited

CREATE TABLE IF NOT EXISTS user_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  peak_id UUID NOT NULL REFERENCES peaks(id) ON DELETE CASCADE,

  -- Review content
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(100),
  body TEXT,

  -- Context (optional - when did they climb)
  date_climbed DATE,
  conditions VARCHAR(100),

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- One review per user per peak
  UNIQUE(user_id, peak_id)
);

-- Indexes for efficient queries
CREATE INDEX user_reviews_peak_id_idx ON user_reviews(peak_id);
CREATE INDEX user_reviews_user_id_idx ON user_reviews(user_id);
CREATE INDEX user_reviews_created_at_idx ON user_reviews(created_at DESC);
CREATE INDEX user_reviews_rating_idx ON user_reviews(rating);

-- Enable RLS
ALTER TABLE user_reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Anyone can view reviews
CREATE POLICY "Reviews are publicly viewable"
  ON user_reviews FOR SELECT
  USING (true);

-- Users can insert their own reviews
CREATE POLICY "Users can insert own reviews"
  ON user_reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own reviews
CREATE POLICY "Users can update own reviews"
  ON user_reviews FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own reviews
CREATE POLICY "Users can delete own reviews"
  ON user_reviews FOR DELETE
  USING (auth.uid() = user_id);
