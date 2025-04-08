import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Channel, 
  ChannelDetail,
  CreateChannelRequest, 
  UpdateChannelRequest 
} from '@/types/channel';
import { 
  getCommunityChannels, 
  createCommunityChannel as createCommunityChannelService, 
  createOrGetPrivateChannel, 
  getMyPrivateChannels, 
  getChannelDetail, 
  updateChannel as updateChannelService, 
  deleteChannel as deleteChannelService 
} from '@/services/channelService';
import chatService from '@/services/chatService';
import { Platform } from 'react-native';

// Configuration des URLs de l'API
//export const BASE_URL = PC_PRINCIPAL ? 'http://192.168.1.168:5000/v1' : 'http://172.20.10.2:5000/v1';
export const BASE_URL = 'http://172.20.10.2:5000/v1';
export const API_URL = Platform.OS === "android" ? 'http://10.0.2.2:5000/v1' : BASE_URL;

// Interface pour les valeurs retournées par le hook
export interface UseChannelReturn {
  // États
  loading: boolean;
  error: Error | null;
  isSignalRConnected: boolean;
  
  // Données
  communityChannels: Channel[];
  privateChannels: Channel[];
  currentChannel: ChannelDetail | null;
  
  // Actions - Canaux
  loadCommunityChannels: (communityId: string) => Promise<void>;
  loadPrivateChannels: () => Promise<void>;
  loadChannel: (channelId: string) => Promise<ChannelDetail | null>;
  createCommunityChannel: (communityId: string, channel: CreateChannelRequest) => Promise<Channel | null>;
  createPrivateChannel: (userId: string) => Promise<Channel | null>;
  updateChannel: (channelId: string, channel: UpdateChannelRequest) => Promise<boolean>;
  deleteChannel: (channelId: string) => Promise<boolean>;
  
  // Actions - Chat
  joinChannel: (channelId: string) => Promise<boolean>;
  leaveChannel: (channelId: string) => Promise<boolean>;
  
  // Service de chat
  chatService: typeof chatService;
  
  // Méthodes de compatibilité
  onConnectionClosed: (callback: (error?: Error) => void) => void;
  onConnectionReconnected: (callback: () => void) => void;
}

export const useChannel = (): UseChannelReturn => {
  // États
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [isSignalRConnected, setIsSignalRConnected] = useState<boolean>(false);
  const [communityChannels, setCommunityChannels] = useState<Channel[]>([]);
  const [privateChannels, setPrivateChannels] = useState<Channel[]>([]);
  const [currentChannel, setCurrentChannel] = useState<ChannelDetail | null>(null);
  
  // Références pour éviter les problèmes de fermeture (closure)
  const chatServiceRef = useRef(chatService);
  
  // Gestionnaire d'erreur centralisé
  const handleApiError = useCallback((err: any, action: string) => {
    console.error(`Erreur lors de ${action}:`, err);
    const errorMessage = err instanceof Error ? err.message : "Une erreur inattendue est survenue";
    setError(new Error(`${action} a échoué: ${errorMessage}`));
    return null;
  }, []);

  // Initialisation du service de chat
  useEffect(() => {
    let isMounted = true;

    const initializeChatService = async () => {
      try {
        const connected = await chatService.initialize();
        if (isMounted) {
          setIsSignalRConnected(connected);
        }
      } catch (err) {
        console.error("Erreur d'initialisation du service de chat:", err);
        if (isMounted) {
          setError(new Error("Impossible de se connecter au service de chat"));
        }
      }
    };

    // Configuration des écouteurs d'événements
    const disconnectCleanup = chatService.onDisconnected(() => {
      if (isMounted) {
        setIsSignalRConnected(false);
      }
    });

    const reconnectCleanup = chatService.onReconnected(() => {
      if (isMounted) {
        setIsSignalRConnected(true);
      }
    });

    const errorCleanup = chatService.onError((err) => {
      console.error("Erreur SignalR:", err);
      if (isMounted) {
        setError(new Error("Erreur de communication avec le serveur"));
      }
    });

    initializeChatService();

    // Nettoyer les écouteurs d'événements
    return () => {
      isMounted = false;
      disconnectCleanup();
      reconnectCleanup();
      errorCleanup();
    };
  }, []);

  // Chargement des canaux d'une communauté
  const loadCommunityChannels = useCallback(async (communityId: string) => {
    setLoading(true);
    setError(null);

    try {
      const channels = await getCommunityChannels(communityId);
      setCommunityChannels(channels);
    } catch (err) {
      handleApiError(err, 'chargement des canaux communautaires');
    } finally {
      setLoading(false);
    }
  }, [handleApiError]);

  // Chargement des canaux privés
  const loadPrivateChannels = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const channels = await getMyPrivateChannels();
      setPrivateChannels(channels);
    } catch (err) {
      handleApiError(err, 'chargement des canaux privés');
    } finally {
      setLoading(false);
    }
  }, [handleApiError]);

  // Chargement des détails d'un canal
  const loadChannel = useCallback(async (channelId: string) => {
    setLoading(true);
    setError(null);

    try {
      const channel = await getChannelDetail(channelId);
      setCurrentChannel(channel);
      return channel;
    } catch (err) {
      handleApiError(err, 'chargement des détails du canal');
      return null;
    } finally {
      setLoading(false);
    }
  }, [handleApiError]);

  // Création d'un canal communautaire
  const createCommunityChannel = useCallback(async (communityId: string, channel: CreateChannelRequest): Promise<Channel | null> => {
    setLoading(true);
    setError(null);

    try {
      const newChannel = await createCommunityChannelService(communityId, channel);
      setCommunityChannels(prev => [...prev, newChannel]);
      return newChannel;
    } catch (err) {
      handleApiError(err, 'création du canal communautaire');
      return null;
    } finally {
      setLoading(false);
    }
  }, [handleApiError]);

  // Création d'un canal privé
  const createPrivateChannel = useCallback(async (userId: string): Promise<Channel | null> => {
    setLoading(true);
    setError(null);

    try {
      const channel = await createOrGetPrivateChannel(userId);
      // Vérifie si le canal existe déjà pour éviter les doublons
      const channelExists = privateChannels.some(c => c.id === channel.id);
      if (!channelExists) {
        setPrivateChannels(prev => [...prev, channel]);
      }
      return channel;
    } catch (err) {
      handleApiError(err, 'création du canal privé');
      return null;
    } finally {
      setLoading(false);
    }
  }, [privateChannels, handleApiError]);

  // Mise à jour d'un canal
  const updateChannel = useCallback(async (channelId: string, channel: UpdateChannelRequest): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      await updateChannelService(channelId, channel);
      
      // Met à jour le canal dans les deux listes si présent
      const updateChannelInList = (list: Channel[]): Channel[] =>
        list.map(c => c.id === channelId ? { ...c, ...channel } : c);

      setCommunityChannels(updateChannelInList);
      setPrivateChannels(updateChannelInList);
      
      // Met à jour le canal courant s'il s'agit du même
      if (currentChannel && currentChannel.id === channelId) {
        setCurrentChannel({ ...currentChannel, ...channel });
      }

      return true;
    } catch (err) {
      handleApiError(err, 'mise à jour du canal');
      return false;
    } finally {
      setLoading(false);
    }
  }, [currentChannel, handleApiError]);

  // Suppression d'un canal
  const deleteChannel = useCallback(async (channelId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      await deleteChannelService(channelId);
      
      // Supprime le canal des deux listes
      setCommunityChannels(prev => prev.filter(c => c.id !== channelId));
      setPrivateChannels(prev => prev.filter(c => c.id !== channelId));
      
      // Réinitialise le canal courant si c'est celui qui est supprimé
      if (currentChannel && currentChannel.id === channelId) {
        setCurrentChannel(null);
      }

      return true;
    } catch (err) {
      handleApiError(err, 'suppression du canal');
      return false;
    } finally {
      setLoading(false);
    }
  }, [currentChannel, handleApiError]);

  // Rejoindre un canal avec SignalR
  const joinChannel = useCallback(async (channelId: string): Promise<boolean> => {
    try {
      setError(null);
      const success = await chatService.joinChannel(channelId);
      if (!success) {
        setError(new Error("Impossible de rejoindre le canal"));
      }
      return success;
    } catch (err) {
      handleApiError(err, 'rejoindre le canal');
      return false;
    }
  }, [handleApiError]);

  // Quitter un canal avec SignalR
  const leaveChannel = useCallback(async (channelId: string): Promise<boolean> => {
    try {
      return await chatService.leaveChannel(channelId);
    } catch (err) {
      handleApiError(err, 'quitter le canal');
      return false;
    }
  }, [handleApiError]);

  // Méthodes de compatibilité pour l'ancienne interface
  const onConnectionClosed = useCallback((callback: (error?: Error) => void): void => {
    console.log('useChannel: onConnectionClosed appelé (déprécié), utiliser chatService.onDisconnected à la place');
    chatServiceRef.current.onDisconnected(callback);
  }, []);
  
  const onConnectionReconnected = useCallback((callback: () => void): void => {
    console.log('useChannel: onConnectionReconnected appelé (déprécié), utiliser chatService.onReconnected à la place');
    chatServiceRef.current.onReconnected(callback);
  }, []);

  return {
    // États
    loading,
    error,
    isSignalRConnected,

    // Données
    communityChannels,
    privateChannels,
    currentChannel,
    
    // Actions - Canaux
    loadCommunityChannels,
    loadPrivateChannels,
    loadChannel,
    createCommunityChannel,
    createPrivateChannel,
    updateChannel,
    deleteChannel,
    
    // Actions - Chat
    joinChannel,
    leaveChannel,
    
    // Service de chat
    chatService: chatServiceRef.current,
    
    // Méthodes de compatibilité
    onConnectionClosed,
    onConnectionReconnected
  };
};

export default useChannel;