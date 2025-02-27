import { Stack } from 'expo-router';
import Providers from '@/components/providers';

export default function RootLayout() {
  return (
    <Providers>
      <Stack screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="community/create" options={{ presentation: 'modal', headerTitle: 'Création communauté' }} />
        <Stack.Screen name="community/[id]" options={{ headerShown: false }} />
      </Stack>
    </Providers>
  );
}