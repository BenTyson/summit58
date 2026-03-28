import { View, Text } from 'react-native';
import { colors } from '@/lib/theme/colors';
import { useSession } from '@/lib/auth/AuthProvider';

export default function ProfileScreen() {
  const { user, loading } = useSession();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.light.bgPrimary }}>
      <Text style={{ fontFamily: 'InstrumentSerif', fontSize: 28, color: colors.light.textPrimary }}>
        Profile
      </Text>
      <Text style={{ fontFamily: 'Inter', fontSize: 14, color: colors.light.textMuted, marginTop: 8 }}>
        {loading ? 'Loading...' : user ? `Signed in as ${user.email}` : 'Not signed in'}
      </Text>
    </View>
  );
}
