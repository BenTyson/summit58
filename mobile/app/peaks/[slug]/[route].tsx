import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { colors } from '@/lib/theme/colors';

export default function RouteDetailScreen() {
  const { slug, route } = useLocalSearchParams<{ slug: string; route: string }>();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.light.bgPrimary }}>
      <Text style={{ fontFamily: 'InstrumentSerif', fontSize: 28, color: colors.light.textPrimary }}>
        Route Detail
      </Text>
      <Text style={{ fontFamily: 'Inter', fontSize: 14, color: colors.light.textMuted, marginTop: 8 }}>
        {slug} / {route}
      </Text>
    </View>
  );
}
