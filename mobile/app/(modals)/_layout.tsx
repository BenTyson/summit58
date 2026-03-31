import { Stack } from 'expo-router';

export default function ModalLayout() {
  return (
    <Stack screenOptions={{ presentation: 'modal', headerShown: true }}>
      <Stack.Screen name="summit-log" options={{ title: 'Log Summit' }} />
      <Stack.Screen name="photo-upload" options={{ title: 'Upload Photo' }} />
      <Stack.Screen name="trail-report" options={{ title: 'Trail Report' }} />
      <Stack.Screen name="review" options={{ title: 'Write Review' }} />
      <Stack.Screen name="settings" options={{ title: 'Settings' }} />
      <Stack.Screen name="storage" options={{ title: 'Offline Storage' }} />
    </Stack>
  );
}
