-- ========================================
-- SUMMIT REACTIONS & COMMENTS
-- Social engagement on summit log entries
-- ========================================

-- summit_reactions: congrats on summit entries (one per user per summit)
CREATE TABLE summit_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  summit_id UUID NOT NULL REFERENCES user_summits(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(summit_id, user_id)
);

CREATE INDEX summit_reactions_summit_idx ON summit_reactions(summit_id);
CREATE INDEX summit_reactions_user_idx ON summit_reactions(user_id);

ALTER TABLE summit_reactions ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "summit_reactions_select" ON summit_reactions
  FOR SELECT USING (true);

-- Authenticated insert own
CREATE POLICY "summit_reactions_insert" ON summit_reactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Delete own
CREATE POLICY "summit_reactions_delete" ON summit_reactions
  FOR DELETE USING (auth.uid() = user_id);

-- summit_comments: text comments on summit entries
CREATE TABLE summit_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  summit_id UUID NOT NULL REFERENCES user_summits(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  body TEXT NOT NULL CHECK (char_length(body) > 0 AND char_length(body) <= 500),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX summit_comments_summit_idx ON summit_comments(summit_id, created_at);
CREATE INDEX summit_comments_user_idx ON summit_comments(user_id);

ALTER TABLE summit_comments ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "summit_comments_select" ON summit_comments
  FOR SELECT USING (true);

-- Authenticated insert own
CREATE POLICY "summit_comments_insert" ON summit_comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Delete own
CREATE POLICY "summit_comments_delete" ON summit_comments
  FOR DELETE USING (auth.uid() = user_id);
