-- ========================================
-- PUBLIC USER PROFILES
-- Allow users to make their profile public/private
-- ========================================

-- Add is_public column to profiles (default true for community engagement)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT TRUE;

-- Update the SELECT policy to respect privacy setting
-- Drop existing policy first
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;

-- Create new policy: public profiles visible to all, private only to owner
CREATE POLICY "Profiles are viewable based on privacy"
  ON profiles FOR SELECT
  USING (
    is_public = true
    OR auth.uid() = id
  );

-- Index for efficient public profile queries
CREATE INDEX IF NOT EXISTS profiles_is_public_idx ON profiles(is_public) WHERE is_public = true;
