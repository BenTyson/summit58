import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useColorScheme } from '@/components/useColorScheme';
import { AuthProvider } from '@/lib/auth/AuthProvider';
import { PurchasesProvider } from '@/lib/purchases/PurchasesProvider';
import { PeaksProvider } from '@/lib/peaks/PeaksProvider';
import { OfflineProvider } from '@/lib/offline/OfflineProvider';
import { SyncProvider } from '@/lib/offline/SyncProvider';
import { SyncToast } from '@/components/ui/SyncToast';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import { InstrumentSerif_400Regular } from '@expo-google-fonts/instrument-serif';
import '../global.css';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Inter: Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
    InstrumentSerif: InstrumentSerif_400Regular,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  const theme = colorScheme === 'dark'
    ? {
        ...DarkTheme,
        colors: {
          ...DarkTheme.colors,
          primary: '#C8A55C',
          background: '#1a202c',
          card: '#2d3748',
          text: '#f7fafc',
          border: '#4a5568',
        },
      }
    : {
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          primary: '#C8A55C',
          background: '#ffffff',
          card: '#ffffff',
          text: '#1a202c',
          border: '#e2e8f0',
        },
      };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <OfflineProvider>
        <AuthProvider>
          <PurchasesProvider>
            <PeaksProvider>
              <SyncProvider>
                <ThemeProvider value={theme}>
                  <Stack>
                    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                    <Stack.Screen
                      name="(modals)"
                      options={{ headerShown: false, presentation: 'modal' }}
                    />
                    <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                    <Stack.Screen
                      name="users/[id]"
                      options={{ title: 'Profile' }}
                    />
                    <Stack.Screen
                      name="community/index"
                      options={{ title: 'Community' }}
                    />
                    <Stack.Screen
                      name="community/[category]"
                      options={{ title: 'Topics' }}
                    />
                    <Stack.Screen
                      name="community/topic/[id]"
                      options={{ title: 'Discussion' }}
                    />
                    <Stack.Screen
                      name="community/new-topic"
                      options={{ title: 'New Topic', presentation: 'modal' }}
                    />
                    <Stack.Screen name="+not-found" />
                  </Stack>
                  <SyncToast />
                </ThemeProvider>
              </SyncProvider>
            </PeaksProvider>
          </PurchasesProvider>
        </AuthProvider>
      </OfflineProvider>
    </GestureHandlerRootView>
  );
}
