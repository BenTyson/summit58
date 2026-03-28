import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { colors } from '@/lib/theme/colors';

export default function PeakDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.light.bgPrimary }}>
      <Text style={{ fontFamily: 'InstrumentSerif', fontSize: 28, color: colors.light.textPrimary }}>
        Peak Detail
      </Text>
      <Text style={{ fontFamily: 'Inter', fontSize: 14, color: colors.light.textMuted, marginTop: 8 }}>
        {slug}
      </Text>
    </View>
  );
}
