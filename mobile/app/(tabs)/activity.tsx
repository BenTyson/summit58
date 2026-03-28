import { View, Text } from 'react-native';
import { colors } from '@/lib/theme/colors';

export default function ActivityScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.light.bgPrimary }}>
      <Text style={{ fontFamily: 'InstrumentSerif', fontSize: 28, color: colors.light.textPrimary }}>
        Activity
      </Text>
      <Text style={{ fontFamily: 'Inter', fontSize: 14, color: colors.light.textMuted, marginTop: 8 }}>
        Activity feed coming in Phase 2
      </Text>
    </View>
  );
}
