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
