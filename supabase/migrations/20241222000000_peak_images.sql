-- Peak Images table for gallery
-- Stores multiple images per peak with admin-only uploads

CREATE TABLE IF NOT EXISTS peak_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  peak_id UUID NOT NULL REFERENCES peaks(id) ON DELETE CASCADE,
  uploaded_by UUID NOT NULL REFERENCES auth.users(id),

  -- Image data
  storage_path TEXT NOT NULL,        -- Supabase storage path
  caption TEXT,

  -- Display settings
  is_hero BOOLEAN DEFAULT false,     -- Mark as hero image
  display_order INTEGER DEFAULT 0,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for efficient queries
CREATE INDEX peak_images_peak_id_idx ON peak_images(peak_id);
CREATE INDEX peak_images_display_order_idx ON peak_images(display_order);

-- Enable RLS
ALTER TABLE peak_images ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Anyone can view images
CREATE POLICY "Images are publicly viewable"
  ON peak_images FOR SELECT
  USING (true);

-- Admin can insert images
CREATE POLICY "Admin can insert images"
  ON peak_images FOR INSERT
  WITH CHECK (auth.uid() = 'c983d602-d0e0-4da6-be9d-f91a456bfdb0'::uuid);

-- Admin can update images
CREATE POLICY "Admin can update images"
  ON peak_images FOR UPDATE
  USING (auth.uid() = 'c983d602-d0e0-4da6-be9d-f91a456bfdb0'::uuid);

-- Admin can delete images
CREATE POLICY "Admin can delete images"
  ON peak_images FOR DELETE
  USING (auth.uid() = 'c983d602-d0e0-4da6-be9d-f91a456bfdb0'::uuid);
