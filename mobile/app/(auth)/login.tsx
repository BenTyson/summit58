import { View, Text } from 'react-native';
import { colors } from '@/lib/theme/colors';

export default function LoginScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.mountain.navy }}>
      <Text style={{ fontFamily: 'InstrumentSerif', fontSize: 36, color: colors.accent.default }}>
        SaltGoat
      </Text>
      <Text style={{ fontFamily: 'Inter', fontSize: 16, color: colors.dark.textMuted, marginTop: 12 }}>
        Sign in to track your 14ers
      </Text>
      <Text style={{ fontFamily: 'Inter', fontSize: 12, color: colors.dark.textMuted, marginTop: 24 }}>
        Auth UI coming in Phase 3
      </Text>
    </View>
  );
}
