import { Stack } from 'expo-router';
import { AuthProvider } from '@/contexts/AuthContext';
import { CommunityProvider } from '@/contexts/CommunityContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <CommunityProvider>
        <Stack screenOptions={{
            headerShown: false,
          }}>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="community/create" options={{ presentation: 'modal', headerTitle: 'Création communauté' }} />
        </Stack>
      </CommunityProvider>
    </AuthProvider>
  );
}