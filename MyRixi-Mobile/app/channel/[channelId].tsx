import { ChannelHeader } from "@/components/channel/channel-header";
import { MessageInput } from "@/components/channel/message-input";
import { MessageList } from "@/components/channel/message-list";
import useChannel from "@/hooks/useChannel";
import useMessages from "@/hooks/useMessages";
import { useLocalSearchParams, useRouter, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, Keyboard } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ChannelScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const navigation = useNavigation();
  const { channelId } = useLocalSearchParams();
  const id = Array.isArray(channelId) ? channelId[0] : channelId || '';
  
  // États locaux pour gérer l'affichage
  const [isInitializing, setIsInitializing] = useState(true);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  // Hooks personnalisés pour la gestion des canaux et messages
  const { 
    loading: channelLoading, 
    error: channelError, 
    currentChannel,
    loadChannel, 
    joinChannel, 
    leaveChannel,
    chatService
  } = useChannel();

  const { 
    loading: messagesLoading, 
    error: messagesError,
    messages,
    loadMoreMessages,
    sendMessage
  } = useMessages({ 
    channelId: id, 
    chatService 
  });

  // Initialisation du canal
  useEffect(() => {
    if (!id) {
      setConnectionError("Channel ID is missing");
      setIsInitializing(false);
      return;
    }

    async function initializeChannel() {
      try {
        // Chargement des détails du canal
        await loadChannel(id);
        
        // Rejoindre le canal pour la connexion en temps réel
        const success = await joinChannel(id);
        if (!success) {
          setConnectionError("Failed to connect to channel");
        }
      } catch (err) {
        console.error("Error initializing channel:", err);
        setConnectionError("An error occurred while loading the channel");
      } finally {
        setIsInitializing(false);
      }
    }

    initializeChannel();

    return () => {
      if (id) {
        leaveChannel(id).catch(err => console.error("Error leaving channel:", err));
      }
    };
  }, []);
  
  // Gestion des états de chargement et d'erreur
  if (isInitializing || channelLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading channel...</Text>
      </View>
    );
  }

  // Gestion des erreurs
  const error = connectionError || channelError?.message || messagesError?.message;
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={[styles.container]} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={-insets.bottom}
    >
      <View style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom }}>
        <ChannelHeader
          channel={currentChannel}
          onBackPress={() => router.back()}
        />
        
        <MessageList
          messages={messages}
          loading={messagesLoading}
          onLoadMore={loadMoreMessages}
        />
        
        <MessageInput
          channelId={id}
          onSend={content => sendMessage(content)}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5', 
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    color: '#424242',
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#e57373',
    fontSize: 16,
    textAlign: 'center',
  },
});