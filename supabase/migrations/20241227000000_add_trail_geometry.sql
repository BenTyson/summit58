-- ========================================
-- TRAIL GEOMETRY FOR GPX VISUALIZATION
-- Store parsed GPX data as GeoJSON for map rendering
-- ========================================

-- Add trail_geometry column to routes table
-- Stores GeoJSON LineString with elevation data
ALTER TABLE routes ADD COLUMN IF NOT EXISTS trail_geometry JSONB DEFAULT NULL;

-- Add comment documenting the expected structure
COMMENT ON COLUMN routes.trail_geometry IS
'GeoJSON LineString with elevation: {
  "type": "LineString",
  "coordinates": [[lon, lat, elevation], ...],
  "properties": {
    "elevationGain": number,
    "elevationLoss": number,
    "minElevation": number,
    "maxElevation": number
  }
}';

-- Create index for efficient queries of routes with geometry
CREATE INDEX IF NOT EXISTS idx_routes_has_geometry
ON routes ((trail_geometry IS NOT NULL));
