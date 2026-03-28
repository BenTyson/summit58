import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';
import type { Database } from '@saltgoat/shared/types/database';

function createStorageAdapter() {
  if (Platform.OS === 'web') {
    return undefined; // Use default localStorage on web
  }
  // Lazy require to avoid loading native module during web/SSR builds
  const SecureStore = require('expo-secure-store');
  return {
    getItem: (key: string) => SecureStore.getItemAsync(key),
    setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
    removeItem: (key: string) => SecureStore.deleteItemAsync(key),
  };
}

export const supabase = createClient<Database>(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      storage: createStorageAdapter(),
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);
