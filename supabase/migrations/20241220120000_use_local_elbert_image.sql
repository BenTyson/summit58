-- ========================================
-- USE LOCAL IMAGE FOR MT. ELBERT
-- Custom image from /static/images/peaks/
-- ========================================

UPDATE peaks SET
  hero_image_url = '/images/peaks/Mt._Elbert.jpg',
  thumbnail_url = '/images/peaks/Mt._Elbert.jpg'
WHERE slug = 'mt-elbert';
