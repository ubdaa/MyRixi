import { Stack } from 'expo-router';
import { AuthProvider } from '@/contexts/AuthContext';
import { CommunityProvider } from '@/contexts/CommunityContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';


export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <CommunityProvider>
          <Stack screenOptions={{
              headerShown: false,
              animation: 'flip',
            }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false, animation: 'fade' }} />
            <Stack.Screen name="community/create" options={{ presentation: 'modal', headerTitle: 'Création communauté' }} />
            <Stack.Screen name="community/[id]" options={{ headerShown: false }} />
          </Stack>
        </CommunityProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}