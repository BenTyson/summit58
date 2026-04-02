import { View, Text, Pressable } from 'react-native';
import { colors } from '@/lib/theme/colors';

export type ElevationBand = 'summit' | 'mid' | 'base';

interface BandOption {
  key: ElevationBand;
  label: string;
  elevation: number;
}

interface ElevationBandSelectorProps {
  bands: BandOption[];
  selected: ElevationBand;
  onSelect: (band: ElevationBand) => void;
}

export function ElevationBandSelector({ bands, selected, onSelect }: ElevationBandSelectorProps) {
  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: colors.light.bgTertiary,
        borderRadius: 10,
        padding: 3,
      }}
    >
      {bands.map((band) => {
        const isActive = band.key === selected;
        return (
          <Pressable
            key={band.key}
            onPress={() => onSelect(band.key)}
            style={{
              flex: 1,
              paddingVertical: 8,
              paddingHorizontal: 4,
              borderRadius: 8,
              alignItems: 'center',
              backgroundColor: isActive ? colors.light.bgPrimary : 'transparent',
              ...(isActive && {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
                elevation: 2,
              }),
            }}
          >
            <Text
              style={{
                fontFamily: isActive ? 'Inter-SemiBold' : 'Inter',
                fontSize: 13,
                color: isActive ? colors.light.textPrimary : colors.light.textMuted,
              }}
              numberOfLines={1}
            >
              {band.label}
            </Text>
            <Text
              style={{
                fontFamily: 'Inter',
                fontSize: 11,
                color: isActive ? colors.light.textSecondary : colors.light.textMuted,
                marginTop: 1,
              }}
            >
              {band.elevation.toLocaleString()}'
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
