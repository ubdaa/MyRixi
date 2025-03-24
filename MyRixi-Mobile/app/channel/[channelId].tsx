import { ChannelHeader } from "@/components/channel/channel-header";
import { MessageInput } from "@/components/channel/message-input";
import { MessageList } from "@/components/channel/message-list";
import useChannel from "@/hooks/useChannel";
import useMessages from "@/hooks/useMessages";
import { useLocalSearchParams, useRouter, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, Keyboard, ActivityIndicator, TouchableOpacity } from "react-native";
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
  const [retryAttempts, setRetryAttempts] = useState(0);

  // Hooks personnalisés pour la gestion des canaux et messages
  const { 
    loading: channelLoading, 
    error: channelError, 
    currentChannel,
    loadChannel, 
    joinChannel, 
    leaveChannel,
    chatService,
    connectSignalR,
    isConnected,
    connectionReady
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
        
        // Ensure we have a SignalR connection first
        console.log("Ensuring SignalR connection before joining channel...");
        const connected = await connectSignalR();
        
        if (connected) {
          console.log("SignalR connected, waiting for connection to stabilize...");
          // Give the connection a moment to fully establish
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Rejoindre le canal pour la connexion en temps réel
          const joinSuccess = await joinChannel(id);
          if (!joinSuccess) {
            console.error("Failed to join channel after connection");
            setConnectionError("Failed to connect to channel");
            
            // Try once more if joining failed
            if (retryAttempts < 2) {
              setRetryAttempts(prev => prev + 1);
              await new Promise(resolve => setTimeout(resolve, 2000));
              initializeChannel();
              return;
            }
          } else {
            console.log(`Successfully joined channel ${id}`);
            setConnectionError(null);
          }
        } else {
          console.error("Failed to establish SignalR connection");
          setConnectionError("Failed to connect to chat service");
          
          // Try once more if connection failed
          if (retryAttempts < 2) {
            setRetryAttempts(prev => prev + 1);
            await new Promise(resolve => setTimeout(resolve, 2000));
            initializeChannel();
            return;
          }
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
  
  // Add a retry button in case of connection errors
  const retryConnection = async () => {
    setIsInitializing(true);
    setConnectionError(null);
    try {
      await connectSignalR();
      await new Promise(resolve => setTimeout(resolve, 1000));
      const success = await joinChannel(id);
      if (!success) {
        setConnectionError("Failed to join channel after retrying");
      }
    } catch (err) {
      console.error("Error during retry:", err);
      setConnectionError("Connection retry failed");
    } finally {
      setIsInitializing(false);
    }
  };
  
  // Gestion des états de chargement et d'erreur
  if (isInitializing || channelLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
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
          <TouchableOpacity style={styles.retryButton} onPress={retryConnection}>
            <Text style={styles.retryButtonText}>Retry Connection</Text>
          </TouchableOpacity>
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
          disabled={!isConnected}
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
    marginTop: 16,
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
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 16,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});