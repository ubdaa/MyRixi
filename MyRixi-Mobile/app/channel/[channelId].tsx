import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useChannel } from '@/hooks/useChannel';
import { ChannelHeader } from '@/components/channel/channel-header';
import { MessageList } from '@/components/channel/message-list';
import { MessageInput } from '@/components/channel/message-input';
import { CreateMessageDto, Message } from '@/types/message';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ChannelScreen() {
  // Récupérer l'ID du canal depuis les paramètres d'URL
  const { channelId } = useLocalSearchParams<{ channelId: string }>();
  
  // État local pour les messages et l'état de la page
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Utiliser le hook useChannel
  const {
    chatService,
    currentChannel,
    loadChannel,
    joinChannel,
    leaveChannel,
    isSignalRConnected
  } = useChannel();

  // Charger les détails du canal et rejoindre le canal
  useEffect(() => {
    let isMounted = true;
    
    const initializeChannel = async () => {
      if (!channelId) return;
      
      try {
        setLoading(true);
        
        // Charger les détails du canal
        const channelDetails = await loadChannel(channelId);
        
        if (!channelDetails && isMounted) {
          setError("Canal non trouvé");
          setLoading(false);
          return;
        }

        // Rejoindre le canal via SignalR
        const joined = await joinChannel(channelId);
        if (!joined && isMounted) {
          setError("Impossible de rejoindre le canal");
        }
        
        // Simuler le chargement des messages (à remplacer par votre API)
        // Dans une vraie application, appelez votre service de messages ici
        if (isMounted) {
          setMessages([]);  // Chargement de messages réels à implémenter
          setLoading(false);
        }
      } catch (err) {
        console.error("Erreur lors de l'initialisation du canal:", err);
        if (isMounted) {
          setError("Une erreur est survenue lors du chargement du canal");
          setLoading(false);
        }
      }
    };

    initializeChannel();

    // Nettoyage lors de la sortie
    return () => {
      isMounted = false;
      if (channelId) {
        leaveChannel(channelId).catch(err => {
          console.error("Erreur lors de la sortie du canal:", err);
        });
      }
    };
  }, [channelId, loadChannel, joinChannel, leaveChannel]);

  // Gérer les messages en temps réel
  useEffect(() => {
    if (!channelId) return;
    
    // Écouter les nouveaux messages
    const messageListener = chatService.onMessageReceived((newMessage) => {
      if (newMessage.channelId === channelId) {
        setMessages(prevMessages => [newMessage, ...prevMessages]);
      }
    });

    // Nettoyage des écouteurs
    return () => {
      messageListener();
    };
  }, [channelId, chatService]);

  // Gérer l'envoi d'un message
  const handleSendMessage = useCallback(async (content: string, channelId: string): Promise<boolean> => {
    if (!content.trim()) return false;
    
    try {
      const messageDto: CreateMessageDto = {
        content: content.trim(),
        channelId,
        attachmentIds: []
      };
      
      return await chatService.sendMessage(messageDto);
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
      return false;
    }
  }, [chatService]);

  // Gérer le bouton retour
  const handleBackPress = useCallback(() => {
    router.back();
  }, []);

  // Gérer le chargement de plus de messages
  const handleLoadMoreMessages = useCallback(() => {
    // Implémenter le chargement de messages plus anciens ici
    console.log("Chargement de plus de messages...");
  }, []);

  // Afficher un indicateur de chargement
  if (loading) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#7289da" />
        <Text style={styles.loadingText}>Chargement du canal...</Text>
      </SafeAreaView>
    );
  }

  // Afficher un message d'erreur
  if (error) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoid} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <ChannelHeader 
          channel={currentChannel} 
          onBackPress={handleBackPress} 
        />
        
        <MessageList
          messages={messages}
          loading={false}
          onLoadMore={handleLoadMoreMessages}
        />
        
        <MessageInput
          channelId={channelId || ''}
          onSend={handleSendMessage}
          disabled={!isSignalRConnected}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  keyboardAvoid: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    color: '#424242',
    fontSize: 16,
  },
  errorText: {
    color: '#e53935',
    fontSize: 16,
    textAlign: 'center',
  }
});
