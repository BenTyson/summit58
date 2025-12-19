-- ========================================
-- ADD HERO IMAGES TO PEAKS
-- High-quality Unsplash images (free for commercial use)
-- ========================================

-- Quandary Peak - Tenmile Range winter scene
UPDATE peaks SET
  hero_image_url = 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80',
  thumbnail_url = 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80'
WHERE slug = 'quandary-peak';

-- Mt. Elbert - Dramatic mountain peak
UPDATE peaks SET
  hero_image_url = 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=1920&q=80',
  thumbnail_url = 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=400&q=80'
WHERE slug = 'mt-elbert';

-- Mt. Bierstadt - Rocky mountain landscape
UPDATE peaks SET
  hero_image_url = 'https://images.unsplash.com/photo-1508193638397-1c4234db14d9?w=1920&q=80',
  thumbnail_url = 'https://images.unsplash.com/photo-1508193638397-1c4234db14d9?w=400&q=80'
WHERE slug = 'mt-bierstadt';

-- Grays Peak - Alpine mountain with snow
UPDATE peaks SET
  hero_image_url = 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1920&q=80',
  thumbnail_url = 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&q=80'
WHERE slug = 'grays-peak';

-- Handies Peak - San Juan wildflower meadows
UPDATE peaks SET
  hero_image_url = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
  thumbnail_url = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80'
WHERE slug = 'handies-peak';

-- Torreys Peak - Rocky alpine peak
UPDATE peaks SET
  hero_image_url = 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=1920&q=80',
  thumbnail_url = 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=400&q=80'
WHERE slug = 'torreys-peak';

-- Mt. Democrat - Rugged mountain terrain
UPDATE peaks SET
  hero_image_url = 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=1920&q=80',
  thumbnail_url = 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=400&q=80'
WHERE slug = 'mt-democrat';

-- Longs Peak - Iconic Rocky Mountain National Park
UPDATE peaks SET
  hero_image_url = 'https://images.unsplash.com/photo-1500534623283-312aade485b7?w=1920&q=80',
  thumbnail_url = 'https://images.unsplash.com/photo-1500534623283-312aade485b7?w=400&q=80'
WHERE slug = 'longs-peak';

-- Mt. Sneffels - Dramatic San Juan peak
UPDATE peaks SET
  hero_image_url = 'https://images.unsplash.com/photo-1434394354979-a235cd36269d?w=1920&q=80',
  thumbnail_url = 'https://images.unsplash.com/photo-1434394354979-a235cd36269d?w=400&q=80'
WHERE slug = 'mt-sneffels';

-- Capitol Peak - Maroon Bells area dramatic peak
UPDATE peaks SET
  hero_image_url = 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=1920&q=80',
  thumbnail_url = 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=400&q=80'
WHERE slug = 'capitol-peak';
