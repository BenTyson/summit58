import { SymbolView } from 'expo-symbols';
import type { SymbolViewProps } from 'expo-symbols';
import { weatherCodeToSFSymbol } from '@saltgoat/shared/utils/weather';

interface WeatherIconProps {
  code: number;
  isNight?: boolean;
  size?: number;
  tintColor?: string;
}

export function WeatherIcon({ code, isNight = false, size = 24, tintColor }: WeatherIconProps) {
  const symbolName = weatherCodeToSFSymbol(code, isNight) as SymbolViewProps['name'];

  return (
    <SymbolView
      name={symbolName}
      size={size}
      type="hierarchical"
      tintColor={tintColor}
      style={{ width: size, height: size }}
    />
  );
}
