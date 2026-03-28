import { View, Text } from 'react-native';
import { colors } from '@/lib/theme/colors';

export default function SummitLogModal() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.light.bgPrimary }}>
      <Text style={{ fontFamily: 'InstrumentSerif', fontSize: 24, color: colors.light.textPrimary }}>
        Log Summit
      </Text>
      <Text style={{ fontFamily: 'Inter', fontSize: 14, color: colors.light.textMuted, marginTop: 8 }}>
        Coming in Phase 3
      </Text>
    </View>
  );
}
