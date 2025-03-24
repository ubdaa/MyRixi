import { ChannelHeader } from "@/components/channel/channel-header";
import { MessageInput } from "@/components/channel/message-input";
import { MessageList } from "@/components/channel/message-list";
import useChannel from "@/hooks/useChannel";
import useMessages from "@/hooks/useMessages";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform, 
  TouchableOpacity, 
  ActivityIndicator 
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';

export default function ChannelScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { channelId } = useLocalSearchParams();
  const id = Array.isArray(channelId) ? channelId[0] : channelId || '';
  
  // États pour gérer l'affichage
  const [isInitializing, setIsInitializing] = useState(true);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [isReconnecting, setIsReconnecting] = useState(false);

  // Hooks pour la gestion des canaux et messages
  const { 
    loading: channelLoading, 
    error: channelError, 
    currentChannel,
    loadChannel, 
    joinChannel, 
    leaveChannel,
    chatService,
    isSignalRConnected,
    connectSignalR,
    onConnectionClosed,
    onConnectionReconnected
  } = useChannel();

  const { 
    loading: messagesLoading, 
    error: messagesError,
    messages,
    loadMoreMessages,
    refreshMessages,
    sendMessage
  } = useMessages({ 
    channelId: id, 
    chatService 
  });
  
  // Vérifier et restaurer la connexion si nécessaire
  const checkConnection = useCallback(async () => {
    if (!isSignalRConnected) {
      console.log("SignalR déconnecté, tentative de reconnexion...");
      setIsReconnecting(true);
      const reconnected = await connectSignalR();
      
      if (reconnected) {
        console.log("Reconnecté! Réintégration du canal...");
        const joined = await joinChannel(id);
        setIsReconnecting(false);
        return joined;
      }
      
      setIsReconnecting(false);
      return false;
    }
    return true;
  }, [isSignalRConnected, connectSignalR, joinChannel, id]);
  
  // Gérer la réessai quand la connexion échoue
  const handleRetry = useCallback(async () => {
    setConnectionError(null);
    setIsInitializing(true);
    
    try {
      // Tentative de reconnexion à SignalR
      const reconnected = await connectSignalR();
      if (!reconnected) {
        throw new Error("Impossible de se connecter au serveur de chat");
      }
      
      // Rechargement des données du canal
      await loadChannel(id);
      
      // Réintégration du canal
      const joined = await joinChannel(id);
      if (!joined) {
        throw new Error("Impossible de rejoindre le canal");
      }
      
      // Rafraîchissement des messages
      await refreshMessages();
      
      setIsInitializing(false);
    } catch (err) {
      console.error("Erreur pendant la réessai:", err);
      setConnectionError((err as Error).message || "Échec de la connexion");
      setIsInitializing(false);
    }
  }, [connectSignalR, loadChannel, joinChannel, id, refreshMessages]);
  
  // Initialisation du canal
  useEffect(() => {
    if (!id) {
      setConnectionError("ID de canal manquant");
      setIsInitializing(false);
      return;
    }

    let mounted = true;
    
    async function initializeChannel() {
      try {
        // Chargement des détails du canal d'abord
        const channelDetails = await loadChannel(id);
        if (!mounted) return;
        
        if (!channelDetails) {
          throw new Error("Canal introuvable");
        }
        
        // Établir la connexion SignalR si nécessaire
        if (!isSignalRConnected) {
          await connectSignalR();
          if (!mounted) return;
        }
        
        // Rejoindre le canal
        const joinSuccess = await joinChannel(id);
        if (!mounted) return;
        
        if (!joinSuccess) {
          throw new Error("Impossible de rejoindre le canal");
        }
      } catch (err) {
        if (!mounted) return;
        console.error("Erreur d'initialisation du canal:", err);
        setConnectionError((err as Error).message || "Échec d'initialisation du canal");
      } finally {
        if (mounted) {
          setIsInitializing(false);
        }
      }
    }

    initializeChannel();
    
    // Configuration des gestionnaires d'événements pour la connexion
    const handleConnectionClosed = (error?: Error) => {
      if (mounted) {
        console.log("Connexion fermée dans ChannelScreen:", error);
        setIsReconnecting(true);
      }
    };
    
    const handleConnectionReconnected = () => {
      if (mounted) {
        console.log("Reconnexion réussie dans ChannelScreen");
        setIsReconnecting(false);
        // Réintégrer le canal
        joinChannel(id).catch(console.error);
      }
    };
    
    onConnectionClosed(handleConnectionClosed);
    onConnectionReconnected(handleConnectionReconnected);

    // Fonction de nettoyage
    return () => {
      mounted = false;
      if (id) {
        leaveChannel(id).catch(err => console.error("Erreur lors du départ du canal:", err));
      }
    };
  }, [
    id, 
    loadChannel, 
    joinChannel, 
    leaveChannel, 
    connectSignalR, 
    isSignalRConnected, 
    onConnectionClosed, 
    onConnectionReconnected
  ]);
  
  // Vérification périodique de la connexion
  useEffect(() => {
    if (connectionError || isInitializing) return;
    
    const interval = setInterval(() => {
      checkConnection().catch(err => 
        console.error("Erreur pendant la vérification de connexion:", err)
      );
    }, 30000); // Vérification toutes les 30 secondes
    
    return () => clearInterval(interval);
  }, [checkConnection, connectionError, isInitializing]);

  // États de l'interface utilisateur
  if (isInitializing || channelLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Chargement du canal...</Text>
      </View>
    );
  }

  // Écran d'erreur avec bouton de réessai
  if (connectionError || channelError?.message || messagesError?.message) {
    const errorMessage = connectionError || channelError?.message || messagesError?.message || "Erreur inconnue";
    return (
      <View style={styles.errorContainer}>
        <View style={styles.centerContent}>
          <Ionicons name="alert-circle-outline" size={48} color="#e57373" />
          <Text style={styles.errorTitle}>Erreur de connexion</Text>
          <Text style={styles.errorText}>{errorMessage}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
            <Text style={styles.retryButtonText}>Réessayer</Text>
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
          onBackPress={() => {
            leaveChannel(id).catch(err => console.error("Erreur lors du départ du canal:", err));
            router.back();
          }}
        />
        
        {isReconnecting && (
          <View style={styles.reconnectingBanner}>
            <Ionicons name="wifi" size={16} color="#fff" />
            <Text style={styles.reconnectingText}>Reconnexion en cours...</Text>
          </View>
        )}
        
        <MessageList
          messages={messages}
          loading={messagesLoading}
          onLoadMore={loadMoreMessages}
          //onRefresh={refreshMessages}
        />
        
        <MessageInput
          channelId={id}
          onSend={async (content) => {
            // Vérifier la connexion avant d'envoyer
            const connected = await checkConnection();
            if (connected) {
              return sendMessage(content);
            } else {
              // Permettre d'envoyer même hors ligne - le message sera mis en file d'attente
              return sendMessage(content);
            }
          }}
          disabled={!isSignalRConnected && !isReconnecting}
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
    gap: 12,
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
    gap: 12,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  errorText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  reconnectingBanner: {
    backgroundColor: '#f59e0b',
    padding: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  reconnectingText: {
    color: '#fff',
    fontWeight: '500',
  },
});