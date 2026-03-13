ALTER TABLE peak_images ADD COLUMN IF NOT EXISTS category TEXT DEFAULT NULL;
CREATE INDEX IF NOT EXISTS peak_images_category_idx ON peak_images(category);
