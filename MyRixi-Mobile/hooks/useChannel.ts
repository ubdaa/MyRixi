import { useState, useEffect, useCallback } from 'react';
import * as signalR from '@microsoft/signalr';
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
import { ChatService } from '@/services/chatService';
import { Platform } from 'react-native';

export const PC_PRINCIPAL = false;
//export const BASE_URL = PC_PRINCIPAL ? 'http://192.168.1.168:5000/v1' : 'http://172.20.10.2:5000/v1';
export const BASE_URL = 'http://172.20.10.2:5000/v1';

export const API_URL = Platform.OS === "android" 
  ? 'http://10.0.2.2:5000/v1' 
  : BASE_URL;

interface UseChannelReturn {
  // États
  loading: boolean;
  error: Error | null;
  
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
  chatService: ChatService;
  connectSignalR: () => Promise<boolean>;
  joinChannel: (channelId: string) => Promise<boolean>;
  leaveChannel: (channelId: string) => Promise<boolean>;
  
  // Callbacks pour notifications utilisateurs
  onUserJoinedChannel: (callback: (data: { UserId: string, ChannelId: string }) => void) => void;
  onUserLeftChannel: (callback: (data: { UserId: string, ChannelId: string }) => void) => void;
  onConnectionClosed: (callback: (error: Error | undefined) => void) => void;
  
  // SignalR connection state
  isConnected: boolean;
  isConnecting: boolean;
  connectionReady: boolean;
}

export const useChannel = (): UseChannelReturn => {
  // États
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Données
  const [communityChannels, setCommunityChannels] = useState<Channel[]>([]);
  const [privateChannels, setPrivateChannels] = useState<Channel[]>([]);
  const [currentChannel, setCurrentChannel] = useState<ChannelDetail | null>(null);
  
  // Initialisation du service Chat et état de connexion
  const [chatService] = useState<ChatService>(() => new ChatService());
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  // Add a flag to indicate when the connection is fully ready to use
  const [connectionReady, setConnectionReady] = useState<boolean>(false);
  // Add retries counter
  const [connectionRetries, setConnectionRetries] = useState<number>(0);
  const MAX_RETRIES = 3;

  // Actions liées aux canaux
  const loadCommunityChannels = useCallback(async (communityId: string) => {
    setLoading(true);
    setError(null);

    try {
      const channels = await getCommunityChannels(communityId);
      setCommunityChannels(channels);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Une erreur est survenue'));
      console.error('Erreur lors du chargement des canaux de la communauté:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadPrivateChannels = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const channels = await getMyPrivateChannels();
      setPrivateChannels(channels);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Une erreur est survenue'));
      console.error('Erreur lors du chargement des canaux privés:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadChannel = useCallback(async (channelId: string) => {
    setLoading(true);
    setError(null);

    try {
      const channel = await getChannelDetail(channelId);
      setCurrentChannel(channel);
      return channel;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Une erreur est survenue'));
      console.error('Erreur lors du chargement des détails du canal:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createCommunityChannel = useCallback(async (communityId: string, channel: CreateChannelRequest): Promise<Channel | null> => {
    setLoading(true);
    setError(null);

    try {
      const newChannel = await createCommunityChannelService(communityId, channel);
      if (newChannel) {
        setCommunityChannels(prev => [...prev, newChannel]);
      }
      return newChannel;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Une erreur est survenue'));
      console.error('Erreur lors de la création du canal:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createPrivateChannel = useCallback(async (userId: string): Promise<Channel | null> => {
    setLoading(true);
    setError(null);

    try {
      const channel = await createOrGetPrivateChannel(userId);
      const channelExists = privateChannels.some(c => c.id === channel.id);
      if (!channelExists) {
        setPrivateChannels(prev => [...prev, channel]);
      }
      return channel;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Une erreur est survenue'));
      console.error('Erreur lors de la création du canal privé:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [privateChannels]);

  const updateChannel = useCallback(async (channelId: string, channel: UpdateChannelRequest): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      await updateChannelService(channelId, channel);

      const updateChannelInList = (list: Channel[]): Channel[] =>
        list.map(c => c.id === channelId ? { ...c, ...channel } : c);

      setCommunityChannels(prev => updateChannelInList(prev));
      setPrivateChannels(prev => updateChannelInList(prev));

      if (currentChannel && currentChannel.id === channelId) {
        setCurrentChannel({ ...currentChannel, ...channel });
      }

      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Une erreur est survenue'));
      console.error('Erreur lors de la mise à jour du canal:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [currentChannel]);

  const deleteChannel = useCallback(async (channelId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      await deleteChannelService(channelId);

      setCommunityChannels(prev => prev.filter(c => c.id !== channelId));
      setPrivateChannels(prev => prev.filter(c => c.id !== channelId));

      if (currentChannel && currentChannel.id === channelId) {
        setCurrentChannel(null);
      }

      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Une erreur est survenue'));
      console.error('Erreur lors de la suppression du canal:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [currentChannel]);

  // Actions liées à SignalR
  const connectSignalR = useCallback(async () => {
    // Prevent multiple connection attempts
    if (isConnecting) return false;
    if (isConnected && connectionReady) return true;
    
    setIsConnecting(true);
    setError(null);
    
    try {
      console.log("Trying to connect to SignalR hub...");
      const result = await chatService.connect(`${API_URL}/hubs/chat`);
      
      if (result) {
        console.log("SignalR connection established");
        setIsConnected(true);
        
        // Give the connection a moment to fully initialize
        setTimeout(() => {
          setConnectionReady(true);
          setConnectionRetries(0);
          console.log("SignalR connection ready for use");
        }, 500);
      } else {
        throw new Error("Failed to connect to SignalR hub");
      }
      
      return result;
    } catch (err) {
      console.error('SignalR connection error:', err);
      setError(err instanceof Error ? err : new Error('SignalR connection failed'));
      
      // Implement retry logic
      if (connectionRetries < MAX_RETRIES) {
        console.log(`Retrying SignalR connection (${connectionRetries + 1}/${MAX_RETRIES})...`);
        setConnectionRetries(prev => prev + 1);
        
        // Wait before retry
        setTimeout(() => {
          setIsConnecting(false);
          connectSignalR();
        }, 2000);
      }
      
      return false;
    } finally {
      setIsConnecting(false);
    }
  }, [chatService, isConnected, isConnecting, connectionRetries, connectionReady]);

  const joinChannel = useCallback(async (channelId: string) => {
    // Ensure we have an active connection before joining
    if (!isConnected || !connectionReady) {
      console.log("SignalR not ready, attempting to connect before joining channel");
      const connected = await connectSignalR();
      if (!connected) {
        console.error("Cannot join channel: SignalR not connected");
        return false;
      }
      
      // Give a small delay to ensure the connection is fully established
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    try {
      console.log(`Joining channel ${channelId}...`);
      return await chatService.joinChannel(channelId);
    } catch (err) {
      console.error(`Error joining channel ${channelId}:`, err);
      return false;
    }
  }, [connectionReady, connectSignalR]);

  const leaveChannel = useCallback(async (channelId: string) => {
    if (!isConnected) {
      console.log("Not connected, no need to leave channel");
      return true;
    }
    
    try {
      console.log(`Leaving channel ${channelId}...`);
      return await chatService.leaveChannel(channelId);
    } catch (err) {
      console.error(`Error leaving channel ${channelId}:`, err);
      return false;
    }
  }, [chatService, isConnected]);

  // Callbacks pour notifications utilisateurs
  const onUserJoinedChannel = useCallback((callback: (data: { UserId: string, ChannelId: string }) => void) => {
    chatService.onUserJoinedChannel(callback);
  }, [chatService]);

  const onUserLeftChannel = useCallback((callback: (data: { UserId: string, ChannelId: string }) => void) => {
    chatService.onUserLeftChannel(callback);
  }, [chatService]);

  const onConnectionClosed = useCallback((callback: (error: Error | undefined) => void) => {
    chatService.onConnectionClosed(callback);
  }, [chatService]);

  // Connexion SignalR au chargement du hook
  useEffect(() => {
    let mounted = true;
    
    const setupConnection = async () => {
      try {
        if (mounted) {
          const success = await connectSignalR();
          if (mounted && success) {
            setIsConnected(true);
          }
        }
      } catch (err) {
        if (mounted) {
          console.error('Erreur lors de la connexion SignalR:', err);
          setError(new Error('La connexion au chat a échoué. Veuillez réessayer.'));
        }
      }
    };
    
    setupConnection();

    return () => {
      mounted = false;
      chatService.disconnect().catch(err => {
        console.error('Erreur lors de la déconnexion SignalR:', err);
      });
    };
  }, []);

  // Update connection status when connection is closed
  useEffect(() => {
    const handleConnectionClosed = (error?: Error) => {
      console.log("SignalR connection closed", error);
      setIsConnected(false);
      setConnectionReady(false);
      
      // Auto reconnect on unexpected disconnection
      if (error) {
        setTimeout(() => {
          connectSignalR().catch(err => {
            console.error("Auto reconnect failed:", err);
          });
        }, 3000);
      }
    };
    
    chatService.onConnectionClosed(handleConnectionClosed);
    
    return () => {
      // Clean up by removing the handler
      chatService.onConnectionClosed(() => {});
    };
  }, [chatService, connectSignalR]);

  return {
    // États
    loading,
    error,

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
    chatService,
    connectSignalR,
    joinChannel,
    leaveChannel,
    
    // Callbacks pour notifications utilisateurs
    onUserJoinedChannel,
    onUserLeftChannel,
    onConnectionClosed,
    
    // SignalR connection state
    isConnected,
    isConnecting,
    connectionReady
  };
};

export default useChannel;