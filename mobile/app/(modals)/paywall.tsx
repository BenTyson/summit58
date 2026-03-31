import { View, Text, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { colors } from '@/lib/theme/colors';
import { usePurchases } from '@/lib/purchases/PurchasesProvider';
import { useOffline } from '@/lib/offline/OfflineProvider';

const BENEFITS = [
  { icon: 'mountain.2' as const, label: 'Unlimited summit logging' },
  { icon: 'camera' as const, label: 'Photo uploads to any peak' },
  { icon: 'square.and.arrow.up' as const, label: 'Export summit history (CSV)' },
  { icon: 'star' as const, label: 'Pro badge on profile & leaderboard' },
  { icon: 'map' as const, label: 'Offline map downloads (coming soon)' },
];

export default function PaywallModal() {
  const { isPro, offerings, loading, purchase, restorePurchases } = usePurchases();
  const { isOnline } = useOffline();

  const annualPackage = offerings?.current?.annual ?? offerings?.current?.availablePackages?.[0];
  const priceString = annualPackage?.product.priceString ?? '$29.99/year';

  if (isPro) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.light.bgPrimary, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
        <SymbolView
          name={{ ios: 'checkmark.seal.fill', android: 'verified', web: 'verified' }}
          tintColor={colors.accent.default}
          size={48}
        />
        <Text style={{ fontFamily: 'InstrumentSerif', fontSize: 28, color: colors.light.textPrimary, marginTop: 16 }}>
          You're a Pro
        </Text>
        <Text style={{ fontFamily: 'Inter', fontSize: 15, color: colors.light.textMuted, textAlign: 'center', marginTop: 8 }}>
          You already have SaltGoat Pro. Enjoy unlimited summit logging and all Pro features.
        </Text>
        <Pressable
          onPress={() => router.back()}
          style={{ marginTop: 24, paddingHorizontal: 32, paddingVertical: 14, borderRadius: 12, backgroundColor: colors.accent.default }}>
          <Text style={{ fontFamily: 'Inter-SemiBold', fontSize: 16, color: '#ffffff' }}>Done</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.light.bgPrimary }}
      contentContainerStyle={{ padding: 24, paddingBottom: 48 }}>
      {/* Header */}
      <View style={{ alignItems: 'center', marginTop: 8, marginBottom: 32 }}>
        <View style={{
          width: 72,
          height: 72,
          borderRadius: 36,
          backgroundColor: colors.accent.default,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 16,
        }}>
          <SymbolView
            name={{ ios: 'mountain.2.fill', android: 'landscape', web: 'landscape' }}
            tintColor="#ffffff"
            size={32}
          />
        </View>
        <Text style={{ fontFamily: 'InstrumentSerif', fontSize: 32, color: colors.light.textPrimary }}>
          SaltGoat Pro
        </Text>
        <Text style={{ fontFamily: 'Inter', fontSize: 15, color: colors.light.textMuted, textAlign: 'center', marginTop: 6 }}>
          Unlock unlimited summit logging and the full 14er experience.
        </Text>
      </View>

      {/* Benefits */}
      <View style={{ gap: 16, marginBottom: 32 }}>
        {BENEFITS.map((b) => (
          <View key={b.label} style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
            <View style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              backgroundColor: colors.light.bgSecondary,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <SymbolView name={b.icon} tintColor={colors.accent.default} size={18} />
            </View>
            <Text style={{ fontFamily: 'Inter-Medium', fontSize: 16, color: colors.light.textPrimary, flex: 1 }}>
              {b.label}
            </Text>
          </View>
        ))}
      </View>

      {/* Price */}
      <View style={{ alignItems: 'center', marginBottom: 24 }}>
        <Text style={{ fontFamily: 'Inter-Bold', fontSize: 28, color: colors.light.textPrimary }}>
          {priceString}
        </Text>
        {annualPackage?.product.priceString && (
          <Text style={{ fontFamily: 'Inter', fontSize: 13, color: colors.light.textMuted, marginTop: 4 }}>
            Billed annually. Cancel anytime.
          </Text>
        )}
      </View>

      {/* Purchase button */}
      {loading ? (
        <ActivityIndicator color={colors.accent.default} size="large" style={{ marginVertical: 20 }} />
      ) : (
        <Pressable
          onPress={async () => {
            if (!annualPackage) return;
            const success = await purchase(annualPackage);
            if (success) router.back();
          }}
          disabled={!isOnline || !annualPackage}
          style={({ pressed }) => ({
            backgroundColor: !isOnline ? colors.light.borderStrong : colors.accent.default,
            paddingVertical: 16,
            borderRadius: 14,
            alignItems: 'center',
            opacity: pressed ? 0.85 : 1,
          })}>
          <Text style={{ fontFamily: 'Inter-Bold', fontSize: 18, color: '#ffffff' }}>
            {!isOnline ? 'Offline — Connect to Subscribe' : 'Subscribe to Pro'}
          </Text>
        </Pressable>
      )}

      {/* Restore */}
      <Pressable
        onPress={restorePurchases}
        style={{ alignItems: 'center', marginTop: 16, paddingVertical: 8 }}>
        <Text style={{ fontFamily: 'Inter-Medium', fontSize: 14, color: colors.accent.default }}>
          Restore Purchases
        </Text>
      </Pressable>

      {/* Not now */}
      <Pressable
        onPress={() => router.back()}
        style={{ alignItems: 'center', marginTop: 8, paddingVertical: 8 }}>
        <Text style={{ fontFamily: 'Inter', fontSize: 14, color: colors.light.textMuted }}>
          Not Now
        </Text>
      </Pressable>

      {/* Legal links */}
      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 16, marginTop: 24 }}>
        <Text style={{ fontFamily: 'Inter', fontSize: 12, color: colors.light.textMuted }}>
          Terms of Service
        </Text>
        <Text style={{ fontFamily: 'Inter', fontSize: 12, color: colors.light.textMuted }}>
          Privacy Policy
        </Text>
      </View>
    </ScrollView>
  );
}
