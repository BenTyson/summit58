-- ========================================
-- SUMMIT58 DATABASE SCHEMA
-- Phase 1 MVP: Peaks and Routes
-- ========================================

-- ========================================
-- PEAKS TABLE
-- ========================================
CREATE TABLE peaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  elevation INTEGER NOT NULL,
  rank INTEGER CHECK (rank >= 1 AND rank <= 58),
  range TEXT NOT NULL,
  latitude DECIMAL(9,6) NOT NULL,
  longitude DECIMAL(9,6) NOT NULL,
  hero_image_url TEXT,
  thumbnail_url TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes on peaks
CREATE INDEX idx_peaks_slug ON peaks(slug);
CREATE INDEX idx_peaks_rank ON peaks(rank);
CREATE INDEX idx_peaks_range ON peaks(range);

-- ========================================
-- ROUTES TABLE
-- ========================================
CREATE TABLE routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  peak_id UUID NOT NULL REFERENCES peaks(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  is_standard BOOLEAN DEFAULT false,
  distance_miles DECIMAL(4,1) NOT NULL,
  elevation_gain_ft INTEGER NOT NULL,
  difficulty_class INTEGER NOT NULL CHECK (difficulty_class >= 1 AND difficulty_class <= 4),
  exposure TEXT CHECK (exposure IN ('Low', 'Moderate', 'High', 'Extreme')),
  typical_time_hours TEXT,
  trailhead_name TEXT,
  trailhead_latitude DECIMAL(9,6),
  trailhead_longitude DECIMAL(9,6),
  trailhead_elevation INTEGER,
  gpx_file_url TEXT,
  description TEXT,
  gear_notes TEXT,
  route_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(peak_id, slug)
);

-- Create indexes for routes
CREATE INDEX idx_routes_peak_id ON routes(peak_id);
CREATE INDEX idx_routes_is_standard ON routes(is_standard);
CREATE INDEX idx_routes_difficulty ON routes(difficulty_class);

-- ========================================
-- ROW LEVEL SECURITY (RLS)
-- ========================================

-- Enable RLS on all tables
ALTER TABLE peaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE routes ENABLE ROW LEVEL SECURITY;

-- Public read access for MVP (no auth required)
CREATE POLICY "Peaks are publicly readable" ON peaks
  FOR SELECT USING (true);

CREATE POLICY "Routes are publicly readable" ON routes
  FOR SELECT USING (true);

-- ========================================
-- UPDATED_AT TRIGGER
-- ========================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER peaks_updated_at
  BEFORE UPDATE ON peaks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER routes_updated_at
  BEFORE UPDATE ON routes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
