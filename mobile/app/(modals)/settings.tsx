import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { colors } from '@/lib/theme/colors';

export default function SettingsModal() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.light.bgPrimary, padding: 20 }}>
      <SettingsRow
        icon={{ ios: 'internaldrive', android: 'storage', web: 'storage' }}
        title="Offline Storage"
        subtitle="Manage cached data and pending uploads"
        onPress={() => router.push('/(modals)/storage' as any)}
      />
    </View>
  );
}

function SettingsRow({
  icon,
  title,
  subtitle,
  onPress,
}: {
  icon: React.ComponentProps<typeof SymbolView>['name'];
  title: string;
  subtitle: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        paddingVertical: 14,
        paddingHorizontal: 4,
        opacity: pressed ? 0.7 : 1,
        borderBottomWidth: 1,
        borderBottomColor: colors.light.border,
      })}>
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 8,
          backgroundColor: colors.light.bgSecondary,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <SymbolView name={icon} tintColor={colors.accent.default} size={18} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontFamily: 'Inter-Medium', fontSize: 16, color: colors.light.textPrimary }}>
          {title}
        </Text>
        <Text style={{ fontFamily: 'Inter', fontSize: 13, color: colors.light.textMuted, marginTop: 1 }}>
          {subtitle}
        </Text>
      </View>
      <SymbolView
        name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
        tintColor={colors.light.textMuted}
        size={16}
      />
    </Pressable>
  );
}
