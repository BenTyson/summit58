-- Peak forecasts: elevation-banded, sub-daily weather data
-- Replaces peak_conditions with richer granularity (3 bands x 3 periods x 7 days)
-- Old peak_conditions table kept for backward compatibility with deployed mobile clients

CREATE TABLE peak_forecasts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  peak_id UUID NOT NULL REFERENCES peaks(id) ON DELETE CASCADE,
  elevation_band TEXT NOT NULL CHECK (elevation_band IN ('summit', 'mid', 'base')),
  elevation_ft INTEGER NOT NULL,
  forecast_date DATE NOT NULL,
  time_period TEXT NOT NULL CHECK (time_period IN ('morning', 'afternoon', 'night')),

  -- Temperature
  temperature_f INTEGER,
  feels_like_f INTEGER,
  humidity_percent INTEGER,
  dewpoint_f INTEGER,

  -- Wind
  wind_speed_mph INTEGER,
  wind_gust_mph INTEGER,
  wind_direction INTEGER,

  -- Precipitation
  precipitation_in DECIMAL(4,2) DEFAULT 0,
  snow_in DECIMAL(4,2) DEFAULT 0,
  rain_in DECIMAL(4,2) DEFAULT 0,

  -- Sky
  cloud_cover_percent INTEGER,
  weather_code INTEGER,
  visibility_miles DECIMAL(5,1),

  -- Alpine-specific
  freezing_level_ft INTEGER,
  cloud_base_ft INTEGER,
  uv_index INTEGER,

  -- Daily aggregates (denormalized across periods for query simplicity)
  high_f INTEGER,
  low_f INTEGER,
  sunrise TEXT,
  sunset TEXT,

  -- Metadata
  fetched_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(peak_id, elevation_band, forecast_date, time_period)
);

CREATE INDEX idx_peak_forecasts_lookup ON peak_forecasts(peak_id, elevation_band, forecast_date);
CREATE INDEX idx_peak_forecasts_date ON peak_forecasts(forecast_date);

ALTER TABLE peak_forecasts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Peak forecasts are publicly readable"
  ON peak_forecasts FOR SELECT USING (true);
