import { useState, useEffect, useCallback } from 'react';
import * as signalR from '@microsoft/signalr';
import { 
  Channel, 
  ChannelDetail, 
  ChannelMessagesOptions, 
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

const chatService = new ChatService();

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
  loadChannelDetail: (channelId: string, options?: ChannelMessagesOptions) => Promise<void>;
  createCommunityChannel: (communityId: string, channel: CreateChannelRequest) => Promise<Channel | null>;
  createPrivateChannel: (userId: string) => Promise<Channel | null>;
  updateChannel: (channelId: string, channel: UpdateChannelRequest) => Promise<boolean>;
  deleteChannel: (channelId: string) => Promise<boolean>;
  refreshCurrentChannel: () => Promise<void>;

  // Actions liées à SignalR / Chat
  connectSignalR: (url: string) => Promise<void>;
  sendMessage: (user: string, message: string) => Promise<void>;
  joinGroup: (groupName: string) => Promise<void>;
  sendToGroup: (groupName: string, user: string, message: string) => Promise<void>;
  onMessageReceived: (callback: (user: string, message: string) => void) => void;
  onGroupMessageReceived: (callback: (group: string, user: string, message: string) => void) => void;
}

export const useChannel = (): UseChannelReturn => {
  // États
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  // Données
  const [communityChannels, setCommunityChannels] = useState<Channel[]>([]);
  const [privateChannels, setPrivateChannels] = useState<Channel[]>([]);
  const [currentChannel, setCurrentChannel] = useState<ChannelDetail | null>(null);
  const [currentChannelOptions, setCurrentChannelOptions] = useState<ChannelMessagesOptions & { id: string }>({ id: '' });

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

  const loadChannelDetail = useCallback(async (channelId: string, options: ChannelMessagesOptions = {}) => {
    setLoading(true);
    setError(null);

    try {
      const channel = await getChannelDetail(channelId, options);
      setCurrentChannel(channel);
      setCurrentChannelOptions({ ...options, id: channelId });
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Une erreur est survenue'));
      console.error('Erreur lors du chargement des détails du canal:', err);
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

  const refreshCurrentChannel = useCallback(async () => {
    if (currentChannelOptions.id) {
      await loadChannelDetail(currentChannelOptions.id, {
        pageSize: currentChannelOptions.pageSize,
        pageNumber: currentChannelOptions.pageNumber
      });
    }
  }, [currentChannelOptions, loadChannelDetail]);

  // Actions liées à SignalR / Chat
  const connectSignalR = useCallback(async (url: string) => {
    await chatService.connect(url);
  }, []);

  const sendMessage = useCallback(async (user: string, message: string) => {
    await chatService.sendMessage(user, message);
  }, []);

  const joinChannel = useCallback(async (groupName: string) => {
    await chatService.joinChannel(groupName);
  }, []);

  const sendToChannel = useCallback(async (groupName: string, user: string, message: string) => {
    await chatService.sendToChannel(groupName, user, message);
  }, []);

  const onMessageReceived = useCallback((callback: (user: string, message: string) => void) => {
    chatService.onMessageReceived(callback);
  }, []);

  const onGroupMessageReceived = useCallback((callback: (group: string, user: string, message: string) => void) => {
    chatService.onGroupMessageReceived(callback);
  }, []);

  return {
    loading,
    error,
    communityChannels,
    privateChannels,
    currentChannel,
    loadCommunityChannels,
    loadPrivateChannels,
    loadChannelDetail,
    createCommunityChannel,
    createPrivateChannel,
    updateChannel,
    deleteChannel,
    refreshCurrentChannel,
    connectSignalR,
    sendMessage,
    joinGroup: joinChannel,
    sendToGroup: sendToChannel,
    onMessageReceived,
    onGroupMessageReceived
  };
};

export default useChannel;
