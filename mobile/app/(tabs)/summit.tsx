import { View, Text } from 'react-native';
import { colors } from '@/lib/theme/colors';

export default function SummitScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.light.bgPrimary }}>
      <View
        style={{
          width: 80,
          height: 80,
          borderRadius: 40,
          backgroundColor: colors.accent.default,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 16,
        }}>
        <Text style={{ fontSize: 36, color: '#ffffff', fontFamily: 'Inter-Bold' }}>+</Text>
      </View>
      <Text style={{ fontFamily: 'InstrumentSerif', fontSize: 28, color: colors.light.textPrimary }}>
        Log a Summit
      </Text>
      <Text style={{ fontFamily: 'Inter', fontSize: 14, color: colors.light.textMuted, marginTop: 8 }}>
        Summit logging coming in Phase 3
      </Text>
    </View>
  );
}
