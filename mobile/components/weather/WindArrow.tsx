import { View } from 'react-native';
import { colors } from '@/lib/theme/colors';

interface WindArrowProps {
  degrees: number;
  size?: number;
  color?: string;
}

export function WindArrow({ degrees, size = 12, color = colors.light.textMuted }: WindArrowProps) {
  return (
    <View
      style={{
        width: size,
        height: size,
        transform: [{ rotate: `${degrees}deg` }],
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <View
        style={{
          width: 0,
          height: 0,
          borderLeftWidth: size / 3,
          borderRightWidth: size / 3,
          borderBottomWidth: size * 0.7,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderBottomColor: color,
        }}
      />
      <View
        style={{
          width: size / 5,
          height: size * 0.35,
          backgroundColor: color,
        }}
      />
    </View>
  );
}
