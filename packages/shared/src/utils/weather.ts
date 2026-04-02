import type {
  DayForecast,
  PeriodForecast,
  ForecastResponse,
  HikerInsight
} from '../types/helpers';

// WMO Weather Code descriptions and icons
// Shared between server and client

const WMO_CODES: Record<number, { description: string; icon: string }> = {
  0: { description: 'Clear', icon: 'sun' },
  1: { description: 'Mainly Clear', icon: 'sun' },
  2: { description: 'Partly Cloudy', icon: 'cloud-sun' },
  3: { description: 'Overcast', icon: 'cloud' },
  45: { description: 'Fog', icon: 'fog' },
  48: { description: 'Freezing Fog', icon: 'fog' },
  51: { description: 'Light Drizzle', icon: 'cloud-drizzle' },
  53: { description: 'Drizzle', icon: 'cloud-drizzle' },
  55: { description: 'Heavy Drizzle', icon: 'cloud-drizzle' },
  61: { description: 'Light Rain', icon: 'cloud-rain' },
  63: { description: 'Rain', icon: 'cloud-rain' },
  65: { description: 'Heavy Rain', icon: 'cloud-rain' },
  66: { description: 'Freezing Rain', icon: 'cloud-sleet' },
  67: { description: 'Heavy Freezing Rain', icon: 'cloud-sleet' },
  71: { description: 'Light Snow', icon: 'snowflake' },
  73: { description: 'Snow', icon: 'snowflake' },
  75: { description: 'Heavy Snow', icon: 'snowflake' },
  77: { description: 'Snow Grains', icon: 'snowflake' },
  80: { description: 'Light Showers', icon: 'cloud-rain' },
  81: { description: 'Showers', icon: 'cloud-rain' },
  82: { description: 'Heavy Showers', icon: 'cloud-rain' },
  85: { description: 'Light Snow Showers', icon: 'snowflake' },
  86: { description: 'Heavy Snow Showers', icon: 'snowflake' },
  95: { description: 'Thunderstorm', icon: 'cloud-lightning' },
  96: { description: 'Thunderstorm w/ Hail', icon: 'cloud-lightning' },
  99: { description: 'Thunderstorm w/ Heavy Hail', icon: 'cloud-lightning' }
};

export function weatherCodeToDescription(code: number | null): string {
  if (code === null) return 'Unknown';
  return WMO_CODES[code]?.description ?? 'Unknown';
}

export function weatherCodeToIcon(code: number | null): string {
  if (code === null) return 'cloud';
  return WMO_CODES[code]?.icon ?? 'cloud';
}

// Convert wind degrees to cardinal direction
export function degreesToCardinal(degrees: number | null): string {
  if (degrees === null) return '';
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}

// ─── V2: Forecast summary, insights, color helpers, SF Symbols ──────

/**
 * Temperature color for UI: returns a Tailwind-compatible color key.
 * Colder → blue, moderate → neutral, warmer → amber/red.
 */
export function getTemperatureColor(f: number): string {
  if (f < 0) return 'violet';
  if (f < 20) return 'blue';
  if (f < 32) return 'sky';
  if (f < 50) return 'neutral';
  if (f < 70) return 'amber';
  if (f < 90) return 'orange';
  return 'red';
}

/**
 * Wind severity level for UI styling.
 */
export function getWindSeverity(mph: number): 'calm' | 'moderate' | 'strong' | 'extreme' {
  if (mph < 15) return 'calm';
  if (mph < 30) return 'moderate';
  if (mph < 50) return 'strong';
  return 'extreme';
}

/**
 * UV exposure level.
 */
export function getUvLevel(index: number): 'low' | 'moderate' | 'high' | 'very_high' | 'extreme' {
  if (index < 3) return 'low';
  if (index < 6) return 'moderate';
  if (index < 8) return 'high';
  if (index < 11) return 'very_high';
  return 'extreme';
}

/**
 * Map WMO weather code to SF Symbol name for mobile (iOS).
 */
export function weatherCodeToSFSymbol(code: number, isNight: boolean = false): string {
  const night = isNight;
  if (code === 0 || code === 1) return night ? 'moon.stars.fill' : 'sun.max.fill';
  if (code === 2) return night ? 'cloud.moon.fill' : 'cloud.sun.fill';
  if (code === 3) return 'cloud.fill';
  if (code === 45 || code === 48) return 'cloud.fog.fill';
  if (code >= 51 && code <= 55) return 'cloud.drizzle.fill';
  if (code >= 61 && code <= 65) return 'cloud.rain.fill';
  if (code === 66 || code === 67) return 'cloud.sleet.fill';
  if (code >= 71 && code <= 77) return 'cloud.snow.fill';
  if (code >= 80 && code <= 82) return 'cloud.heavyrain.fill';
  if (code === 85 || code === 86) return 'cloud.snow.fill';
  if (code >= 95) return 'cloud.bolt.fill';
  return 'cloud.fill';
}

// Precipitation weather codes (drizzle, rain, freezing rain, showers)
function isPrecipCode(code: number): boolean {
  return (code >= 51 && code <= 67) || (code >= 80 && code <= 82);
}

// Storm codes
function isStormCode(code: number): boolean {
  return code >= 95;
}

/**
 * Generate a 1-2 sentence natural-language summary for an elevation band.
 * Rule-based, deterministic — no LLM needed.
 */
export function generateForecastSummary(days: DayForecast[]): string {
  if (days.length === 0) return '';

  const allPeriods: PeriodForecast[] = days.flatMap((d) => [d.morning, d.afternoon, d.night]);
  const temps = allPeriods.map((p) => p.temperature_f);
  const minTemp = Math.min(...temps);
  const maxTemp = Math.max(...temps);
  const maxWind = Math.max(...allPeriods.map((p) => p.wind_speed_mph));
  const totalSnow = allPeriods.reduce((sum, p) => sum + p.snow_in, 0);
  const totalPrecip = allPeriods.reduce((sum, p) => sum + p.precipitation_in, 0);
  const stormDays = days.filter((d) =>
    isStormCode(d.morning.weather_code) ||
    isStormCode(d.afternoon.weather_code) ||
    isStormCode(d.night.weather_code)
  ).length;
  const clearDays = days.filter((d) =>
    d.morning.weather_code <= 2 && d.afternoon.weather_code <= 2 && d.night.weather_code <= 2
  ).length;

  const parts: string[] = [];

  // Temperature characterization
  if (maxTemp < 20) {
    parts.push(`Extreme cold ahead with highs below 20${String.fromCharCode(176)}F.`);
  } else if (minTemp < 10) {
    parts.push(`Bitter cold expected, lows dropping to ${minTemp}${String.fromCharCode(176)}F.`);
  } else if (maxTemp > 60) {
    parts.push(`Mild conditions with temperatures reaching ${maxTemp}${String.fromCharCode(176)}F.`);
  } else {
    parts.push(`Temperatures ranging ${minTemp}${String.fromCharCode(176)} to ${maxTemp}${String.fromCharCode(176)}F.`);
  }

  // Precipitation / snow
  if (totalSnow > 6) {
    parts.push(`Heavy snow totaling ${Math.round(totalSnow)}" over the period.`);
  } else if (totalSnow > 2) {
    parts.push(`Snow accumulations around ${Math.round(totalSnow)}".`);
  } else if (totalPrecip > 1) {
    parts.push(`Notable precipitation expected.`);
  } else if (stormDays > 0) {
    parts.push(`Thunderstorms possible on ${stormDays} day${stormDays > 1 ? 's' : ''}.`);
  } else if (clearDays >= 5) {
    parts.push(`Mostly clear skies through the week.`);
  }

  // Wind
  if (maxWind >= 50) {
    parts.push(`Dangerously high winds up to ${maxWind} mph.`);
  } else if (maxWind >= 30) {
    parts.push(`Strong winds reaching ${maxWind} mph.`);
  }

  return parts.join(' ');
}

/**
 * Generate actionable hiker insights from the full forecast response.
 * Scans all bands and days for conditions that warrant callouts.
 */
export function generateHikerInsights(
  bands: ForecastResponse['bands']
): HikerInsight[] {
  const insights: HikerInsight[] = [];
  const summit = bands.summit;
  const base = bands.base;

  for (let i = 0; i < summit.days.length; i++) {
    const day = summit.days[i];
    const dateLabel = formatInsightDate(day.date, i);

    // Summit Window: morning has wind <25, no precip, cloud <70%
    const am = day.morning;
    if (
      am.wind_speed_mph < 25 &&
      am.precipitation_in === 0 &&
      am.snow_in === 0 &&
      am.cloud_cover_percent < 70 &&
      am.weather_code < 50
    ) {
      insights.push({
        type: 'summit_window',
        severity: 'info',
        title: `Summit window ${dateLabel}`,
        description: `Clear morning with ${am.temperature_f}${String.fromCharCode(176)}F, winds ${am.wind_speed_mph} mph ${degreesToCardinal(am.wind_direction)}. Best time to be above treeline.`
      });
    }

    // Storm Warning: afternoon weather_code >= 95
    if (isStormCode(day.afternoon.weather_code)) {
      insights.push({
        type: 'storm_warning',
        severity: 'danger',
        title: `Thunderstorms ${dateLabel}`,
        description: `${weatherCodeToDescription(day.afternoon.weather_code)} expected in the afternoon. Descend below treeline by noon.`
      });
    }

    // Wind Advisory: any period wind > 40 mph at summit
    const periods: [string, PeriodForecast][] = [['morning', day.morning], ['afternoon', day.afternoon], ['night', day.night]];
    for (const [name, period] of periods) {
      if (period.wind_speed_mph > 40) {
        insights.push({
          type: 'wind_advisory',
          severity: 'warning',
          title: `High winds ${dateLabel}`,
          description: `Winds up to ${period.wind_speed_mph} mph (gusts ${period.wind_gust_mph} mph) during the ${name}. Exposed ridges will be dangerous.`
        });
        break; // One per day is enough
      }
    }

    // Freeze Warning: freezing level below base/trail elevation
    const minFreeze = Math.min(am.freezing_level_ft, day.afternoon.freezing_level_ft, day.night.freezing_level_ft);
    if (minFreeze < base.elevation_ft) {
      insights.push({
        type: 'freeze_warning',
        severity: 'caution',
        title: `Freezing level low ${dateLabel}`,
        description: `Freezing level drops to ${minFreeze.toLocaleString()}' — below trailhead elevation. Expect icy conditions on the entire route.`
      });
    }

    // Snow Alert: cumulative snow > 4" in a day at summit
    const daySnow = am.snow_in + day.afternoon.snow_in + day.night.snow_in;
    if (daySnow > 4) {
      insights.push({
        type: 'snow_alert',
        severity: 'caution',
        title: `Heavy snow ${dateLabel}`,
        description: `${Math.round(daySnow)}" of snow expected at summit elevation. Trail will likely be obscured.`
      });
    }

    // UV Warning: uv_index >= 8
    const maxUv = Math.max(am.uv_index, day.afternoon.uv_index);
    if (maxUv >= 8) {
      insights.push({
        type: 'uv_warning',
        severity: 'caution',
        title: `Extreme UV ${dateLabel}`,
        description: `UV index reaches ${maxUv} — very high for elevation. Sun protection essential.`
      });
    }

    // Afternoon Storms: June-September + PM storm/precip codes
    const month = new Date(day.date).getMonth(); // 0-indexed
    if (month >= 5 && month <= 8 && (isStormCode(day.afternoon.weather_code) || isPrecipCode(day.afternoon.weather_code))) {
      // Don't duplicate if we already have a storm_warning for this day
      if (!isStormCode(day.afternoon.weather_code)) {
        insights.push({
          type: 'afternoon_storms',
          severity: 'warning',
          title: `Afternoon weather ${dateLabel}`,
          description: `Monsoon season pattern — ${weatherCodeToDescription(day.afternoon.weather_code).toLowerCase()} likely in the afternoon. Plan for an early start.`
        });
      }
    }

    // Clear Day: all periods clear
    if (
      am.weather_code <= 2 &&
      day.afternoon.weather_code <= 2 &&
      day.night.weather_code <= 2 &&
      am.wind_speed_mph < 20 &&
      day.afternoon.wind_speed_mph < 20
    ) {
      insights.push({
        type: 'clear_day',
        severity: 'info',
        title: `Great conditions ${dateLabel}`,
        description: `Clear skies, light winds. Excellent day for the summit.`
      });
    }
  }

  // Limit to most actionable: prioritize danger > warning > caution > info, keep first 8
  const severityOrder: Record<string, number> = { danger: 0, warning: 1, caution: 2, info: 3 };
  insights.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
  return insights.slice(0, 8);
}

function formatInsightDate(dateStr: string, dayIndex: number): string {
  if (dayIndex === 0) return 'today';
  if (dayIndex === 1) return 'tomorrow';
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}
