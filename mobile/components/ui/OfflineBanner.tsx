import { View, Text } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { SymbolView } from 'expo-symbols';
import { useOffline } from '@/lib/offline/OfflineProvider';
import { useSync } from '@/lib/offline/SyncProvider';

export function OfflineBanner() {
  const { isOnline } = useOffline();
  const { pendingCount } = useSync();

  if (isOnline) return null;

  return (
    <Animated.View entering={FadeIn.duration(200)} exiting={FadeOut.duration(200)}>
      <View
        style={{
          backgroundColor: '#C8A55C',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: 6,
          paddingHorizontal: 12,
          gap: 6,
        }}>
        <SymbolView
          name={{ ios: 'wifi.slash', android: 'signal_wifi_off', web: 'signal_wifi_off' }}
          tintColor="#ffffff"
          size={14}
        />
        <Text style={{ fontFamily: 'Inter-Medium', fontSize: 13, color: '#ffffff' }}>
          Offline Mode
        </Text>
        {pendingCount > 0 && (
          <Text style={{ fontFamily: 'Inter', fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>
            {' '}({pendingCount} pending)
          </Text>
        )}
      </View>
    </Animated.View>
  );
}
