import { Stack } from 'expo-router';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import Providers from '@/components/providers';

function AppLayout() {
  const { colorMode } = useTheme();
  
  return (
    <View style={{ flex: 1 }}>
      <StatusBar style={colorMode === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: 'transparent',
        },
      }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen
          name="community/create"
          options={{
            presentation: 'modal',
            headerTitle: 'Création communauté',
            // Options pour un effet glassmorphique dans la modal
            headerStyle: { backgroundColor: 'transparent' },
            headerTransparent: true,
            headerBlurEffect: colorMode === 'dark' ? 'dark' : 'light',
          }}
        />
        <Stack.Screen name="community/[id]" options={{ headerShown: false }} />
        <Stack.Screen
          name="community/discover"
          options={{
            presentation: 'modal',
            headerTitle: 'Découvrir',
            // Options pour un effet glassmorphique dans la modal
            headerStyle: { backgroundColor: 'transparent' },
            headerTransparent: true,
            headerBlurEffect: colorMode === 'dark' ? 'dark' : 'light',
          }}
        />
        <Stack.Screen name="channel/[channelId]" options={{ headerShown: false }} />
        <Stack.Screen
          name="channel/create"
          options={{
            presentation: 'modal',
            headerTitle: 'Nouveau canal',
            // Options pour un effet glassmorphique dans la modal
            headerStyle: { backgroundColor: 'transparent' },
            headerTransparent: true,
            headerBlurEffect: colorMode === 'dark' ? 'dark' : 'light',
          }}
        />
      </Stack>
    </View>
  );
}

export default function RootLayout() {
  return (
    <Providers>
      <AppLayout />
    </Providers>
  );
}