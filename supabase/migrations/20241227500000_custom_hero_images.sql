-- ========================================
-- CUSTOM HERO IMAGES FOR PEAKS
-- Local images in /static/images/peaks/
-- ========================================

-- Mt. Elbert
UPDATE peaks SET
  hero_image_url = '/images/peaks/Mt._Elbert.jpg',
  thumbnail_url = '/images/peaks/Mt._Elbert.jpg'
WHERE slug = 'mt-elbert';

-- Quandary Peak
UPDATE peaks SET
  hero_image_url = '/images/peaks/Quandary_Peak.png',
  thumbnail_url = '/images/peaks/Quandary_Peak.png'
WHERE slug = 'quandary-peak';

-- Mt. Bierstadt
UPDATE peaks SET
  hero_image_url = '/images/peaks/Mt._Bierstadt.png',
  thumbnail_url = '/images/peaks/Mt._Bierstadt.png'
WHERE slug = 'mt-bierstadt';

-- Mt. Blue Sky (formerly Mt. Evans)
UPDATE peaks SET
  hero_image_url = '/images/peaks/Mt_BlueSky.png',
  thumbnail_url = '/images/peaks/Mt_BlueSky.png'
WHERE slug = 'mt-blue-sky';

-- Grays Peak
UPDATE peaks SET
  hero_image_url = '/images/peaks/Grays_Peak.png',
  thumbnail_url = '/images/peaks/Grays_Peak.png'
WHERE slug = 'grays-peak';
