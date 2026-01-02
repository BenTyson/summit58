-- ========================================
-- SOCIAL PROFILE FIELDS
-- Add fields to support social profile features
-- ========================================

-- Add new columns to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS cover_image_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS tagline VARCHAR(100);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS website_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS instagram_handle VARCHAR(30);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS strava_athlete_id VARCHAR(20);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS favorite_peak_id UUID REFERENCES peaks(id) ON DELETE SET NULL;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS years_hiking INTEGER CHECK (years_hiking >= 0 AND years_hiking <= 100);

-- Index for favorite peak lookups
CREATE INDEX IF NOT EXISTS profiles_favorite_peak_idx ON profiles(favorite_peak_id) WHERE favorite_peak_id IS NOT NULL;

-- Comment for documentation
COMMENT ON COLUMN profiles.cover_image_url IS 'Cover photo URL from Supabase Storage';
COMMENT ON COLUMN profiles.tagline IS 'Short tagline displayed under name (max 100 chars)';
COMMENT ON COLUMN profiles.website_url IS 'Personal website URL';
COMMENT ON COLUMN profiles.instagram_handle IS 'Instagram username (without @)';
COMMENT ON COLUMN profiles.strava_athlete_id IS 'Strava athlete ID for integration';
COMMENT ON COLUMN profiles.favorite_peak_id IS 'Featured favorite 14er';
COMMENT ON COLUMN profiles.years_hiking IS 'Years of hiking experience';
