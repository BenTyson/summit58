-- Open photo uploads to all authenticated users + add moderation columns

-- Add moderation columns to peak_images
ALTER TABLE peak_images ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'approved' CHECK (status IN ('approved', 'flagged', 'removed'));
ALTER TABLE peak_images ADD COLUMN IF NOT EXISTS is_private BOOLEAN DEFAULT false;
ALTER TABLE peak_images ADD COLUMN IF NOT EXISTS flag_count INTEGER DEFAULT 0;

-- Index for filtering by status
CREATE INDEX IF NOT EXISTS peak_images_status_idx ON peak_images(status);

-- Drop old admin-only policies
DROP POLICY IF EXISTS "Admin can insert images" ON peak_images;
DROP POLICY IF EXISTS "Admin can update images" ON peak_images;
DROP POLICY IF EXISTS "Admin can delete images" ON peak_images;
DROP POLICY IF EXISTS "Images are publicly viewable" ON peak_images;

-- New SELECT policy: approved + public, OR own photos, OR admin sees all
CREATE POLICY "View approved public images or own"
  ON peak_images FOR SELECT
  USING (
    (status = 'approved' AND is_private = false)
    OR uploaded_by = auth.uid()
    OR auth.uid() = 'c983d602-d0e0-4da6-be9d-f91a456bfdb0'::uuid
  );

-- Any authenticated user can insert
CREATE POLICY "Authenticated users can insert images"
  ON peak_images FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Users can update own photos, admin can update any
CREATE POLICY "Users can update own images"
  ON peak_images FOR UPDATE
  USING (
    uploaded_by = auth.uid()
    OR auth.uid() = 'c983d602-d0e0-4da6-be9d-f91a456bfdb0'::uuid
  );

-- Users can delete own photos, admin can delete any
CREATE POLICY "Users can delete own images"
  ON peak_images FOR DELETE
  USING (
    uploaded_by = auth.uid()
    OR auth.uid() = 'c983d602-d0e0-4da6-be9d-f91a456bfdb0'::uuid
  );
