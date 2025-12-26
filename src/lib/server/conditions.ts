import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database, Tables, TablesInsert } from '$lib/types/database';

export type PeakConditions = Tables<'peak_conditions'>;
export type PeakConditionsInsert = TablesInsert<'peak_conditions'>;

// Re-export weather utilities for convenience
export { weatherCodeToDescription, weatherCodeToIcon, degreesToCardinal } from '$lib/utils/weather';

interface OpenMeteoResponse {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    precipitation: number;
    weather_code: number;
    cloud_cover: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    wind_gusts_10m: number;
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    uv_index_max: number[];
    precipitation_sum: number[];
    snowfall_sum: number[];
    weather_code: number[];
  };
}

export interface ForecastDay {
  date: string;
  high_f: number;
  low_f: number;
  precipitation_in: number;
  snow_in: number;
  uv_index: number;
  weather_code: number;
  // Current conditions only for today
  temperature_f?: number;
  feels_like_f?: number;
  humidity_percent?: number;
  wind_speed_mph?: number;
  wind_gust_mph?: number;
  wind_direction?: number;
  cloud_cover_percent?: number;
}

export async function fetchWeatherForPeak(
  latitude: number,
  longitude: number
): Promise<ForecastDay[]> {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current: 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,cloud_cover,wind_speed_10m,wind_direction_10m,wind_gusts_10m',
    daily: 'temperature_2m_max,temperature_2m_min,uv_index_max,precipitation_sum,snowfall_sum,weather_code',
    temperature_unit: 'fahrenheit',
    wind_speed_unit: 'mph',
    precipitation_unit: 'inch',
    timezone: 'America/Denver',
    forecast_days: '7'
  });

  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);

  if (!response.ok) {
    throw new Error(`Open-Meteo API error: ${response.status}`);
  }

  const data: OpenMeteoResponse = await response.json();
  const forecast: ForecastDay[] = [];

  for (let i = 0; i < data.daily.time.length; i++) {
    const day: ForecastDay = {
      date: data.daily.time[i],
      high_f: Math.round(data.daily.temperature_2m_max[i]),
      low_f: Math.round(data.daily.temperature_2m_min[i]),
      precipitation_in: data.daily.precipitation_sum[i],
      snow_in: data.daily.snowfall_sum[i],
      uv_index: Math.round(data.daily.uv_index_max[i]),
      weather_code: data.daily.weather_code[i]
    };

    // Add current conditions to today's forecast
    if (i === 0) {
      day.temperature_f = Math.round(data.current.temperature_2m);
      day.feels_like_f = Math.round(data.current.apparent_temperature);
      day.humidity_percent = Math.round(data.current.relative_humidity_2m);
      day.wind_speed_mph = Math.round(data.current.wind_speed_10m);
      day.wind_gust_mph = Math.round(data.current.wind_gusts_10m);
      day.wind_direction = Math.round(data.current.wind_direction_10m);
      day.cloud_cover_percent = Math.round(data.current.cloud_cover);
    }

    forecast.push(day);
  }

  return forecast;
}

export async function upsertConditions(
  supabase: SupabaseClient<Database>,
  peakId: string,
  forecast: ForecastDay[]
): Promise<void> {
  const records: PeakConditionsInsert[] = forecast.map((day) => ({
    peak_id: peakId,
    forecast_date: day.date,
    high_f: day.high_f,
    low_f: day.low_f,
    temperature_f: day.temperature_f ?? null,
    feels_like_f: day.feels_like_f ?? null,
    humidity_percent: day.humidity_percent ?? null,
    wind_speed_mph: day.wind_speed_mph ?? null,
    wind_gust_mph: day.wind_gust_mph ?? null,
    wind_direction: day.wind_direction ?? null,
    precipitation_in: day.precipitation_in,
    snow_in: day.snow_in,
    cloud_cover_percent: day.cloud_cover_percent ?? null,
    uv_index: day.uv_index,
    weather_code: day.weather_code,
    fetched_at: new Date().toISOString()
  }));

  const { error } = await supabase
    .from('peak_conditions')
    .upsert(records, { onConflict: 'peak_id,forecast_date' });

  if (error) {
    console.error('Error upserting conditions:', error);
    throw error;
  }
}

export async function getConditionsForPeak(
  supabase: SupabaseClient<Database>,
  peakId: string
): Promise<PeakConditions[]> {
  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('peak_conditions')
    .select('*')
    .eq('peak_id', peakId)
    .gte('forecast_date', today)
    .order('forecast_date', { ascending: true })
    .limit(7);

  if (error) {
    console.error('Error fetching conditions:', error);
    return [];
  }

  return data ?? [];
}
