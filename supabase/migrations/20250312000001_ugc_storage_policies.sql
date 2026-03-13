-- Open peak-images storage bucket to all authenticated users

-- Drop admin-only upload policy
DROP POLICY IF EXISTS "Admin upload peak images" ON storage.objects;

-- Any authenticated user can upload to peak-images bucket
CREATE POLICY "Authenticated users upload peak images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'peak-images'
    AND auth.uid() IS NOT NULL
  );

-- Users can delete their own uploads, admin can delete any
DROP POLICY IF EXISTS "Admin delete peak images" ON storage.objects;
CREATE POLICY "Users can delete own peak images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'peak-images'
    AND (
      (storage.foldername(name))[1] IS NOT NULL
      AND auth.uid() IS NOT NULL
    )
  );
