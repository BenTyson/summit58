import { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, Pressable, Alert, ActivityIndicator } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { colors } from '@/lib/theme/colors';
import { getCacheSizeByTier, clearCacheTier, type CacheSizeByTier } from '@/lib/offline/database';
import { getQueuedPhotosSize } from '@/lib/offline/photoQueue';
import { useSync } from '@/lib/offline/SyncProvider';

const TIER_LABELS: Record<number, { name: string; desc: string }> = {
  1: { name: 'Peak Data', desc: 'Always cached' },
  2: { name: 'Your Data', desc: 'Synced with account' },
  3: { name: 'Weather & Reports', desc: 'Clearable' },
};

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function StorageModal() {
  const { pendingCount } = useSync();
  const [tiers, setTiers] = useState<CacheSizeByTier[]>([]);
  const [photoQueue, setPhotoQueue] = useState({ count: 0, bytes: 0 });
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);

  const loadSizes = useCallback(async () => {
    try {
      const [tierData, photoData] = await Promise.all([
        getCacheSizeByTier(),
        getQueuedPhotosSize(),
      ]);
      setTiers(tierData);
      setPhotoQueue(photoData);
    } catch {
      // Non-critical
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSizes();
  }, [loadSizes]);

  const handleClearTier3 = useCallback(() => {
    Alert.alert(
      'Clear Cached Data',
      'This will remove cached weather, reviews, and trail reports. They will be re-fetched when online.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            setClearing(true);
            await clearCacheTier(3);
            await loadSizes();
            setClearing(false);
          },
        },
      ]
    );
  }, [loadSizes]);

  const totalBytes = tiers.reduce((sum, t) => sum + t.bytes, 0) + photoQueue.bytes;

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.light.bgPrimary, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={colors.accent.default} />
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.light.bgPrimary }}
      contentContainerStyle={{ padding: 20, gap: 16 }}>
      {/* Total */}
      <View style={{ alignItems: 'center', paddingVertical: 16 }}>
        <SymbolView
          name={{ ios: 'internaldrive', android: 'storage', web: 'storage' }}
          tintColor={colors.accent.default}
          size={36}
        />
        <Text style={{ fontFamily: 'InstrumentSerif', fontSize: 28, color: colors.light.textPrimary, marginTop: 8 }}>
          {formatBytes(totalBytes)}
        </Text>
        <Text style={{ fontFamily: 'Inter', fontSize: 14, color: colors.light.textMuted, marginTop: 2 }}>
          Total offline storage used
        </Text>
      </View>

      {/* Tiers */}
      {[1, 2, 3].map((tier) => {
        const data = tiers.find((t) => t.tier === tier);
        const label = TIER_LABELS[tier];
        const bytes = data?.bytes ?? 0;
        const count = data?.count ?? 0;

        return (
          <View
            key={tier}
            style={{
              backgroundColor: colors.light.bgSecondary,
              borderRadius: 12,
              padding: 16,
              borderWidth: 1,
              borderColor: colors.light.border,
            }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: 'Inter-SemiBold', fontSize: 15, color: colors.light.textPrimary }}>
                  {label.name}
                </Text>
                <Text style={{ fontFamily: 'Inter', fontSize: 13, color: colors.light.textMuted, marginTop: 2 }}>
                  {count} items -- {label.desc}
                </Text>
              </View>
              <Text style={{ fontFamily: 'Inter-Medium', fontSize: 15, color: colors.light.textPrimary }}>
                {formatBytes(bytes)}
              </Text>
            </View>

            {tier === 3 && bytes > 0 && (
              <Pressable
                onPress={handleClearTier3}
                disabled={clearing}
                style={{
                  marginTop: 12,
                  paddingVertical: 8,
                  borderRadius: 8,
                  backgroundColor: clearing ? colors.light.bgTertiary : '#e53e3e',
                  alignItems: 'center',
                }}>
                <Text style={{ fontFamily: 'Inter-Medium', fontSize: 14, color: '#ffffff' }}>
                  {clearing ? 'Clearing...' : 'Clear'}
                </Text>
              </Pressable>
            )}
          </View>
        );
      })}

      {/* Photo Queue */}
      {(photoQueue.count > 0 || pendingCount > 0) && (
        <View
          style={{
            backgroundColor: colors.light.bgSecondary,
            borderRadius: 12,
            padding: 16,
            borderWidth: 1,
            borderColor: colors.light.border,
          }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: 'Inter-SemiBold', fontSize: 15, color: colors.light.textPrimary }}>
                Pending Uploads
              </Text>
              <Text style={{ fontFamily: 'Inter', fontSize: 13, color: colors.light.textMuted, marginTop: 2 }}>
                {pendingCount} item{pendingCount !== 1 ? 's' : ''} waiting to sync
              </Text>
            </View>
            {photoQueue.bytes > 0 && (
              <Text style={{ fontFamily: 'Inter-Medium', fontSize: 15, color: colors.light.textPrimary }}>
                {formatBytes(photoQueue.bytes)}
              </Text>
            )}
          </View>
        </View>
      )}
    </ScrollView>
  );
}
