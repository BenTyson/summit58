-- Peak weather conditions table (fetched daily from Open-Meteo)
CREATE TABLE IF NOT EXISTS peak_conditions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  peak_id UUID NOT NULL REFERENCES peaks(id) ON DELETE CASCADE,

  -- Current/daily conditions
  temperature_f INTEGER,
  feels_like_f INTEGER,
  humidity_percent INTEGER,
  wind_speed_mph INTEGER,
  wind_gust_mph INTEGER,
  wind_direction INTEGER,  -- degrees (0-360)
  precipitation_in DECIMAL(4,2),
  snow_in DECIMAL(4,2),
  cloud_cover_percent INTEGER,
  uv_index INTEGER,

  -- Forecast high/low for the day
  high_f INTEGER,
  low_f INTEGER,

  -- Weather description (WMO weather code)
  weather_code INTEGER,

  -- Metadata
  forecast_date DATE NOT NULL,
  fetched_at TIMESTAMPTZ DEFAULT NOW(),

  -- One row per peak per date
  UNIQUE(peak_id, forecast_date)
);

-- Indexes for common queries
CREATE INDEX peak_conditions_peak_id_idx ON peak_conditions(peak_id);
CREATE INDEX peak_conditions_forecast_date_idx ON peak_conditions(forecast_date);

-- Enable RLS
ALTER TABLE peak_conditions ENABLE ROW LEVEL SECURITY;

-- Public read access (no auth required to view weather)
CREATE POLICY "Peak conditions are publicly readable"
  ON peak_conditions FOR SELECT USING (true);

-- Service role can insert/update (webhook uses service key)
-- Note: Service role bypasses RLS, so no explicit policy needed for writes
