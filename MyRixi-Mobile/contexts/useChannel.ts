import { useState, useEffect, useCallback } from 'react';
import { Channel, ChannelDetail, ChannelMessagesOptions, CreateChannelRequest, UpdateChannelRequest } from '@/types/channel';
import { getCommunityChannels, createCommunityChannel, createOrGetPrivateChannel, getMyPrivateChannels, getChannelDetail,  } from '@/services/channelService';

interface UseChannelReturn {
  // États
  loading: boolean;
  error: Error | null;
  
  // Données
  communityChannels: Channel[];
  privateChannels: Channel[];
  currentChannel: ChannelDetail | null;
  
  // Actions
  loadCommunityChannels: (communityId: string) => Promise<void>;
  loadPrivateChannels: () => Promise<void>;
  loadChannelDetail: (channelId: string, options?: ChannelMessagesOptions) => Promise<void>;
  createCommunityChannel: (communityId: string, channel: CreateChannelRequest) => Promise<Channel | null>;
  createPrivateChannel: (userId: string) => Promise<Channel | null>;
  updateChannel: (channelId: string, channel: UpdateChannelRequest) => Promise<boolean>;
  deleteChannel: (channelId: string) => Promise<boolean>;
  refreshCurrentChannel: () => Promise<void>;
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
  
  // Action: Charger les canaux d'une communauté
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
  
  // Action: Charger les canaux privés
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
  
  // Action: Charger les détails d'un canal
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
  
  // Action: Créer un canal dans une communauté
  const createCommunityChannel = useCallback(async (communityId: string, channel: CreateChannelRequest): Promise<Channel | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const newChannel = await createCommunityChannel(communityId, channel);
      // Mettre à jour la liste des canaux
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
  
  // Action: Créer ou récupérer un canal privé
  const createPrivateChannel = useCallback(async (userId: string): Promise<Channel | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const channel = await createOrGetPrivateChannel(userId);
      // Vérifier si le canal existe déjà dans la liste
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
  
  // Action: Mettre à jour un canal
  const updateChannel = useCallback(async (channelId: string, channel: UpdateChannelRequest): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      await updateChannel(channelId, channel);
      
      // Mettre à jour le canal dans les listes
      const updateChannelInList = (list: Channel[]): Channel[] => 
        list.map(c => c.id === channelId ? { ...c, ...channel } : c);
      
      setCommunityChannels(updateChannelInList);
      setPrivateChannels(updateChannelInList);
      
      // Mettre à jour le canal actuel si c'est celui qui est modifié
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
  
  // Action: Supprimer un canal
  const deleteChannel = useCallback(async (channelId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      await deleteChannel(channelId);
      
      // Supprimer le canal des listes
      setCommunityChannels(prev => prev.filter(c => c.id !== channelId));
      setPrivateChannels(prev => prev.filter(c => c.id !== channelId));
      
      // Réinitialiser le canal actuel si c'est celui qui est supprimé
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
  
  // Action: Rafraîchir le canal actuel
  const refreshCurrentChannel = useCallback(async () => {
    if (currentChannelOptions.id) {
      await loadChannelDetail(currentChannelOptions.id, {
        pageSize: currentChannelOptions.pageSize,
        pageNumber: currentChannelOptions.pageNumber
      });
    }
  }, [currentChannelOptions, loadChannelDetail]);
  
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
    refreshCurrentChannel
  };
};

export default useChannel;