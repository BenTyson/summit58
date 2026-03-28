import { View, Text, ScrollView } from 'react-native';
import { colors } from '@/lib/theme/colors';

export default function ExploreScreen() {
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.light.bgPrimary }}
      contentContainerStyle={{ padding: 20 }}>
      <Text style={{ fontFamily: 'InstrumentSerif', fontSize: 32, color: colors.light.textPrimary }}>
        Explore
      </Text>
      <Text style={{ fontFamily: 'Inter', fontSize: 16, color: colors.light.textSecondary, marginTop: 8 }}>
        Browse all 58 Colorado 14ers
      </Text>

      <View style={{ marginTop: 24, gap: 12 }}>
        {[1, 2, 3, 4].map((cls) => (
          <View
            key={cls}
            style={{
              backgroundColor: colors.class[cls as keyof typeof colors.class],
              padding: 16,
              borderRadius: 12,
            }}>
            <Text style={{ fontFamily: 'Inter-Bold', fontSize: 14, color: '#ffffff' }}>
              Class {cls}
            </Text>
          </View>
        ))}
      </View>

      <View
        style={{
          marginTop: 24,
          padding: 20,
          borderRadius: 12,
          backgroundColor: colors.accent.default,
        }}>
        <Text style={{ fontFamily: 'InstrumentSerif', fontSize: 20, color: colors.mountain.navy }}>
          Design System Check
        </Text>
        <Text style={{ fontFamily: 'Inter', fontSize: 14, color: colors.mountain.blueDark, marginTop: 4 }}>
          Accent gold, Instrument Serif headings, Inter body
        </Text>
      </View>
    </ScrollView>
  );
}
