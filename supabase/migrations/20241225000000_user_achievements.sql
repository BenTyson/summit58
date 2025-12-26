-- User Achievements table for persistent badge tracking
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_id TEXT NOT NULL,  -- matches definition ID in achievements.ts
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  notified BOOLEAN DEFAULT FALSE,  -- for showing "New!" badge

  UNIQUE(user_id, achievement_id)
);

-- Indexes
CREATE INDEX user_achievements_user_id_idx ON user_achievements(user_id);
CREATE INDEX user_achievements_earned_at_idx ON user_achievements(earned_at DESC);

-- Enable RLS
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Achievements are publicly viewable"
  ON user_achievements FOR SELECT USING (true);

CREATE POLICY "Users can insert own achievements"
  ON user_achievements FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own achievements"
  ON user_achievements FOR UPDATE
  USING (auth.uid() = user_id);
