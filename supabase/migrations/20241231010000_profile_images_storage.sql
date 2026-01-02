-- ========================================
-- PROFILE IMAGES STORAGE BUCKET
-- Storage for avatars and cover photos
-- ========================================

-- Create the storage bucket for profile images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'profile-images',
  'profile-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Policy: Anyone can view profile images (public bucket)
CREATE POLICY "Profile images are publicly viewable"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'profile-images');

-- Policy: Users can upload their own profile images
-- Files must be in folder named after their user ID
CREATE POLICY "Users can upload own profile images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'profile-images'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy: Users can update their own profile images
CREATE POLICY "Users can update own profile images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'profile-images'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy: Users can delete their own profile images
CREATE POLICY "Users can delete own profile images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'profile-images'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
