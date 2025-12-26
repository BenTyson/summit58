-- Add foreign key relationships to profiles for PostgREST joins
-- This allows queries like: select *, profile:profiles(display_name) from user_reviews

-- Add FK from user_reviews to profiles
ALTER TABLE user_reviews
  ADD CONSTRAINT user_reviews_profile_fk
  FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- Add FK from trail_reports to profiles
ALTER TABLE trail_reports
  ADD CONSTRAINT trail_reports_profile_fk
  FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- Add FK from user_summits to profiles (for consistency)
ALTER TABLE user_summits
  ADD CONSTRAINT user_summits_profile_fk
  FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
