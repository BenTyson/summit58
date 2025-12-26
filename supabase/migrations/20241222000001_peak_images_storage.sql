-- Storage bucket for peak images
-- Public read access, admin-only uploads

-- Create the storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('peak-images', 'peak-images', true)
ON CONFLICT (id) DO NOTHING;

-- Public read access for all images
CREATE POLICY "Public read peak images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'peak-images');

-- Admin can upload images
CREATE POLICY "Admin upload peak images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'peak-images'
    AND auth.uid() = 'c983d602-d0e0-4da6-be9d-f91a456bfdb0'::uuid
  );

-- Admin can update images
CREATE POLICY "Admin update peak images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'peak-images'
    AND auth.uid() = 'c983d602-d0e0-4da6-be9d-f91a456bfdb0'::uuid
  );

-- Admin can delete images
CREATE POLICY "Admin delete peak images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'peak-images'
    AND auth.uid() = 'c983d602-d0e0-4da6-be9d-f91a456bfdb0'::uuid
  );
