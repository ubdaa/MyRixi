import CommunityChannels from '@/components/community/channels/channels-list';
import { useEffect } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useChannel } from '@/hooks/useChannel';
import { useTheme } from '@/contexts/ThemeContext';

export default function CommunityChatsScreen() {
  const { chatService } = useChannel();
  const { theme, colorMode } = useTheme();
  
  useEffect(() => {
    // S'assurer que le service de chat est initialisé au chargement de l'écran
    chatService.initialize().catch(err => 
      console.error("Erreur d'initialisation du chat:", err)
    );
    
    // Pas besoin de nettoyer car SignalRManager est un singleton
  }, []);
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background1 }]}>
      <SafeAreaView style={styles.container} edges={['top']}>
        <CommunityChannels />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
});