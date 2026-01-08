-- ========================================
-- UPDATE ALL HERO IMAGES TO JPG FORMAT
-- After image optimization (PNG → JPEG)
-- ========================================

-- Update all peak images from .png to .jpg
UPDATE peaks
SET
  hero_image_url = REPLACE(hero_image_url, '.png', '.jpg'),
  thumbnail_url = REPLACE(thumbnail_url, '.png', '.jpg')
WHERE hero_image_url LIKE '%/images/peaks/%.png';

-- Fix Mt. Elbert (was already .jpg)
UPDATE peaks SET
  hero_image_url = '/images/peaks/Mt._Elbert.jpg',
  thumbnail_url = '/images/peaks/Mt._Elbert.jpg'
WHERE slug = 'mt-elbert';
