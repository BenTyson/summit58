import { View, Text } from 'react-native';
import { colors } from '@/lib/theme/colors';

export default function MapScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.light.bgPrimary }}>
      <Text style={{ fontFamily: 'InstrumentSerif', fontSize: 28, color: colors.light.textPrimary }}>
        Map
      </Text>
      <Text style={{ fontFamily: 'Inter', fontSize: 14, color: colors.light.textMuted, marginTop: 8 }}>
        Interactive map coming in Phase 2
      </Text>
    </View>
  );
}
