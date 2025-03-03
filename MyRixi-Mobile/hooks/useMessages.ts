import { useState, useEffect, useCallback } from 'react';
import { ChannelDetail, ChannelMessagesOptions } from '@/types/channel';
import { getChannelDetail } from '@/services/channelService';
import { SendMessageRequest } from '@/types/message';
import { ChatService } from '@/services/chatService';

interface UseMessagesProps {
  channelId?: string;
  chatService: ChatService;
}

interface UseMessagesReturn {
  // États
  loading: boolean;
  error: Error | null;
  hasMoreMessages: boolean;
  
  // Données
  messages: any[]; // Remplacer par le type Message approprié
  channelDetail: ChannelDetail | null;
  
  // Actions
  fetchMessages: (options?: ChannelMessagesOptions) => Promise<void>;
  refreshMessages: () => Promise<void>;
  loadMoreMessages: () => Promise<void>;
  sendMessage: (content: string) => Promise<boolean>;
  
  // Événements
  onMessageReceived: (callback: (messageDto: any) => void) => void;
}

const pageSize = 25;

export const useMessages = ({ channelId, chatService }: UseMessagesProps): UseMessagesReturn => {
  // États
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [page, setPage] = useState(1);
  
  // Données
  const [messages, setMessages] = useState<any[]>([]);
  const [channelDetail, setChannelDetail] = useState<ChannelDetail | null>(null);
  const [currentOptions, setCurrentOptions] = useState<ChannelMessagesOptions>({
    pageSize: pageSize,
    pageNumber: 1
  });

  // Fonction pour récupérer les messages
  const fetchMessages = useCallback(async (options: ChannelMessagesOptions = {}) => {
    if (!channelId) return;
    
    setLoading(true);
    setError(null);

    const mergedOptions = {
      ...currentOptions,
      ...options
    };

    try {
      const channel = await getChannelDetail(channelId, mergedOptions);
      
      // Si c'est une nouvelle page, ajouter les messages à la liste existante
      if (mergedOptions.pageNumber && mergedOptions.pageNumber > 1) {
        setMessages(prev => [...prev, ...(channel.messages || [])]);
      } else {
        // Sinon, remplacer les messages existants
        setMessages(channel.messages || []);
      }
      
      setChannelDetail(channel);
      setCurrentOptions(mergedOptions);
      
      // Vérifier s'il y a plus de messages à charger
      setHasMoreMessages(channel.messages && channel.messages.length === mergedOptions.pageSize);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Une erreur est survenue'));
      console.error('Erreur lors du chargement des messages:', err);
    } finally {
      setLoading(false);
    }
  }, [channelId, currentOptions]);

  // Rafraîchir les messages (première page)
  const refreshMessages = useCallback(async () => {
    setPage(1);
    await fetchMessages({ pageSize: pageSize, pageNumber: 1 });
  }, [fetchMessages]);

  // Charger plus de messages (page suivante)
  const loadMoreMessages = useCallback(async () => {
    if (loading || !hasMoreMessages) return;
    
    const nextPage = page + 1;
    await fetchMessages({ pageSize: pageSize, pageNumber: nextPage });
    setPage(nextPage);
  }, [loading, hasMoreMessages, page, fetchMessages]);

  // Envoyer un message
  const sendMessage = useCallback(async (content: string): Promise<boolean> => {
    if (!channelId) return false;
    
    try {
      const messageDto: SendMessageRequest = {
        channelId,
        content,
        attachmentIds: []
      };

      const success = await chatService.sendMessage(messageDto);
      return success;
    } catch (err) {
      console.error('Erreur lors de l\'envoi du message:', err);
      setError(err instanceof Error ? err : new Error('Une erreur est survenue lors de l\'envoi du message.'));
      return false;
    }
  }, [channelId, chatService]);

  // S'abonner aux nouveaux messages
  const onMessageReceived = useCallback((callback: (messageDto: any) => void) => {
    chatService.onMessageReceived(callback);
  }, [chatService]);

  // Charger les messages au chargement du hook
  useEffect(() => {
    if (channelId) {
      refreshMessages();
    }
  }, []);

  // Configurer les écouteurs pour les nouveaux messages
  useEffect(() => {
    if (!channelId) return;

    const handleNewMessage = (messageDto: any) => {
      if (messageDto.channelId === channelId) {
        setMessages(prev => [messageDto, ...prev]);
      }
    };

    chatService.onMessageReceived(handleNewMessage);

    return () => {
      // Ne peut pas vraiment "désenregistrer" le callback, mais on peut le remplacer par un no-op
      chatService.onMessageReceived(() => {});
    };
  }, []);

  return {
    // États
    loading,
    error,
    hasMoreMessages,
    
    // Données
    messages,
    channelDetail,
    
    // Actions
    fetchMessages,
    refreshMessages,
    loadMoreMessages,
    sendMessage,
    
    // Événements
    onMessageReceived
  };
};

export default useMessages;