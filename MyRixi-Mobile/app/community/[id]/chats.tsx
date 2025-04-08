import CommunityChannels from '@/components/community/channels/channels-list';
import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useChannel } from '@/hooks/useChannel';

export default function CommunityChatsScreen() {
  const { chatService } = useChannel();
  
  useEffect(() => {
    // S'assurer que le service de chat est initialisé au chargement de l'écran
    chatService.initialize().catch(err => 
      console.error("Erreur d'initialisation du chat:", err)
    );
    
    // Pas besoin de nettoyer car SignalRManager est un singleton
  }, []);
  
  return (
    <SafeAreaView style={styles.container} edges={['top', 'right', 'left']}>
      <CommunityChannels />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});