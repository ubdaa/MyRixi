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
import SignalRManager from '@/services/signalRService';

// Configuration des URLs de l'API
//export const BASE_URL = PC_PRINCIPAL ? 'http://192.168.1.168:5000/v1' : 'http://172.20.10.2:5000/v1';
export const BASE_URL = 'http://192.168.1.168:5000/v1';
export const API_URL = Platform.OS === "android" ? 'http://10.0.2.2:5000/v1' : BASE_URL;

// Interface définissant les valeurs de retour du hook
interface UseChannelReturn {
  // États
  loading: boolean;
  error: Error | null;
  isSignalRConnected: boolean;
  
  // Données
  communityChannels: Channel[];
  privateChannels: Channel[];
  currentChannel: ChannelDetail | null;
  
  // Actions liées aux canaux
  loadCommunityChannels: (communityId: string) => Promise<void>;
  loadPrivateChannels: () => Promise<void>;
  loadChannel: (channelId: string) => Promise<ChannelDetail | null>;
  createCommunityChannel: (communityId: string, channel: CreateChannelRequest) => Promise<Channel | null>;
  createPrivateChannel: (userId: string) => Promise<Channel | null>;
  updateChannel: (channelId: string, channel: UpdateChannelRequest) => Promise<boolean>;
  deleteChannel: (channelId: string) => Promise<boolean>;
  
  // Actions liées à SignalR
  chatService: typeof chatService;
  connectSignalR: () => Promise<boolean>;
  joinChannel: (channelId: string) => Promise<boolean>;
  leaveChannel: (channelId: string) => Promise<boolean>;
  
  // Callbacks pour notifications utilisateurs
  onUserJoinedChannel: (callback: (data: { UserId: string, ChannelId: string }) => void) => void;
  onUserLeftChannel: (callback: (data: { UserId: string, ChannelId: string }) => void) => void;
  onConnectionClosed: (callback: (error: Error | undefined) => void) => void;
  onConnectionReconnected: (callback: () => void) => void;
}

export const useChannel = (): UseChannelReturn => {
  // États de base
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [isSignalRConnected, setIsSignalRConnected] = useState<boolean>(false);
  
  // États pour les données des canaux
  const [communityChannels, setCommunityChannels] = useState<Channel[]>([]);
  const [privateChannels, setPrivateChannels] = useState<Channel[]>([]);
  const [currentChannel, setCurrentChannel] = useState<ChannelDetail | null>(null);
  
  // Références pour éviter les problèmes de fermeture (closure)
  const chatServiceRef = useRef(chatService);
  
  // Gestionnaire d'erreur d'API centralisé
  const handleApiError = useCallback((err: any, action: string) => {
    const errorMessage = err instanceof Error ? err.message : 'Une erreur inattendue est survenue';
    console.error(`Erreur lors de ${action}:`, err);
    setError(new Error(`${action} a échoué: ${errorMessage}`));
    return null;
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
      handleApiError(err, 'création d\'un canal communautaire');
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
      handleApiError(err, 'création d\'un canal privé');
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

  // Connexion à SignalR
  const connectSignalR = useCallback(async () => {
    try {
      const success = await chatServiceRef.current.connect(`${API_URL}/hubs/chat`);
      setIsSignalRConnected(success);
      return success;
    } catch (err) {
      handleApiError(err, 'connexion au chat');
      setIsSignalRConnected(false);
      return false;
    }
  }, [handleApiError]);

  // Rejoindre un canal
  const joinChannel = useCallback(async (channelId: string) => {
    try {
      const success = await chatServiceRef.current.joinChannel(channelId);
      if (!success) {
        console.warn(`Échec de connexion au canal ${channelId}, tentative de reconnexion`);
        // Tente de se reconnecter puis de rejoindre à nouveau
        const reconnected = await connectSignalR();
        if (reconnected) {
          return await chatServiceRef.current.joinChannel(channelId);
        }
      }
      return success;
    } catch (err) {
      handleApiError(err, `rejoindre le canal ${channelId}`);
      return false;
    }
  }, [connectSignalR, handleApiError]);

  // Quitter un canal
  const leaveChannel = useCallback(async (channelId: string) => {
    try {
      return await chatServiceRef.current.leaveChannel(channelId);
    } catch (err) {
      handleApiError(err, `quitter le canal ${channelId}`);
      return false;
    }
  }, [handleApiError]);

  // Callback pour les utilisateurs rejoignant un canal
  const onUserJoinedChannel = useCallback((callback: (data: { UserId: string, ChannelId: string }) => void) => {
    chatServiceRef.current.onUserJoinedChannel(callback);
  }, []);

  // Callback pour les utilisateurs quittant un canal
  const onUserLeftChannel = useCallback((callback: (data: { UserId: string, ChannelId: string }) => void) => {
    chatServiceRef.current.onUserLeftChannel(callback);
  }, []);

  // Callback pour la fermeture de connexion
  const onConnectionClosed = useCallback((callback: (error: Error | undefined) => void) => {
    chatServiceRef.current.onConnectionClosed((error) => {
      setIsSignalRConnected(false);
      callback(error);
    });
  }, []);

  // Callback pour la reconnexion
  const onConnectionReconnected = useCallback((callback: () => void) => {
    chatServiceRef.current.onConnectionReconnected(() => {
      setIsSignalRConnected(true);
      callback();
    });
  }, []);

  // Connexion automatique à SignalR au chargement du hook
  useEffect(() => {
    let isMounted = true;
    
    connectSignalR().catch(err => {
      if (isMounted) {
        console.error('Échec de connexion à SignalR:', err);
        setError(new Error('La connexion au chat a échoué. Veuillez réessayer.'));
      }
    });
    
    // Configuration des événements de connexion/déconnexion
    chatServiceRef.current.onConnectionClosed(() => {
      if (isMounted) {
        setIsSignalRConnected(false);
      }
    });
    
    chatServiceRef.current.onConnectionReconnected(() => {
      if (isMounted) {
        setIsSignalRConnected(true);
      }
    });
    
    // Nettoyage lors du démontage du hook
    return () => {
      isMounted = false;
      // Pas besoin de se déconnecter ici car SignalRManager gère la connexion globale
    };
  }, [connectSignalR]);

  return {
    // États
    loading,
    error,
    isSignalRConnected,

    // Données
    communityChannels,
    privateChannels,
    currentChannel,
    
    // Actions liées aux canaux
    loadCommunityChannels,
    loadPrivateChannels,
    loadChannel,
    createCommunityChannel,
    createPrivateChannel,
    updateChannel,
    deleteChannel,
    
    // Actions liées à SignalR
    chatService: chatServiceRef.current,
    connectSignalR,
    joinChannel,
    leaveChannel,
    
    // Callbacks pour notifications utilisateurs
    onUserJoinedChannel,
    onUserLeftChannel,
    onConnectionClosed,
    onConnectionReconnected
  };
};

export default useChannel;