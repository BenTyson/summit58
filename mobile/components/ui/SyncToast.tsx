import { useEffect, useState } from 'react';
import { Text } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SymbolView } from 'expo-symbols';
import { useSync } from '@/lib/offline/SyncProvider';

export function SyncToast() {
  const { syncing, lastSyncResult } = useSync();
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(true);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (syncing) {
      setMessage('Syncing...');
      setIsSuccess(true);
      setVisible(true);
      return;
    }

    if (lastSyncResult) {
      if (lastSyncResult.failed === 0 && lastSyncResult.synced > 0) {
        setMessage(`${lastSyncResult.synced} item${lastSyncResult.synced > 1 ? 's' : ''} synced`);
        setIsSuccess(true);
      } else if (lastSyncResult.failed > 0) {
        setMessage(`${lastSyncResult.failed} item${lastSyncResult.failed > 1 ? 's' : ''} failed to sync`);
        setIsSuccess(false);
      } else {
        setVisible(false);
        return;
      }
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [syncing, lastSyncResult]);

  if (!visible) return null;

  return (
    <Animated.View
      entering={FadeIn.duration(200)}
      exiting={FadeOut.duration(200)}
      style={{
        position: 'absolute',
        top: insets.top + 8,
        left: 16,
        right: 16,
        backgroundColor: isSuccess ? '#2d6a4f' : '#9d4234',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 14,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
        zIndex: 1000,
      }}>
      <SymbolView
        name={{
          ios: isSuccess ? 'checkmark.circle.fill' : 'exclamationmark.triangle.fill',
          android: isSuccess ? 'check_circle' : 'warning',
          web: isSuccess ? 'check_circle' : 'warning',
        }}
        tintColor="#ffffff"
        size={18}
      />
      <Text style={{ fontFamily: 'Inter-Medium', fontSize: 14, color: '#ffffff', flex: 1 }}>
        {message}
      </Text>
    </Animated.View>
  );
}
