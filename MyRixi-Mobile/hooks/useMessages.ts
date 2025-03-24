import { useState, useEffect, useCallback, useRef } from 'react';
import { ChannelDetail, ChannelMessagesOptions } from '@/types/channel';
import { getChannelDetail } from '@/services/channelService';
import { CreateMessageDto, Message } from '@/types/message';
import { ChatService } from '@/services/chatService';
import SignalRManager from '@/services/signalRService';

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
  messages: Message[];
  channelDetail: ChannelDetail | null;
  
  // Actions
  fetchMessages: (options?: ChannelMessagesOptions) => Promise<void>;
  refreshMessages: () => Promise<void>;
  loadMoreMessages: () => Promise<void>;
  sendMessage: (content: string) => Promise<boolean>;
  
  // Événements
  onMessageReceived: (callback: (messageDto: Message) => void) => void;
}

const pageSize = 25;

export const useMessages = ({ channelId, chatService }: UseMessagesProps): UseMessagesReturn => {
  // États
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [page, setPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Données
  const [messages, setMessages] = useState<Message[]>([]);
  const [channelDetail, setChannelDetail] = useState<ChannelDetail | null>(null);
  const [currentOptions, setCurrentOptions] = useState<ChannelMessagesOptions>({
    pageSize: pageSize,
    pageNumber: 1
  });
  
  // Références pour éviter les problèmes de fermeture (closure)
  const channelIdRef = useRef(channelId);
  const chatServiceRef = useRef(chatService);
  const pendingMessagesRef = useRef<Set<string>>(new Set());
  
  // Met à jour la référence quand channelId change
  useEffect(() => {
    channelIdRef.current = channelId;
  }, [channelId]);
  
  // Met à jour la référence quand chatService change
  useEffect(() => {
    chatServiceRef.current = chatService;
  }, [chatService]);
  
  // Gestionnaire d'erreur centralisé
  const handleError = useCallback((err: any, action: string) => {
    const errorMessage = err instanceof Error ? err.message : 'Une erreur inattendue est survenue';
    console.error(`Erreur lors de ${action}:`, err);
    setError(new Error(`${action} a échoué: ${errorMessage}`));
  }, []);

  // Fonction pour récupérer les messages avec gestion d'erreur améliorée
  const fetchMessages = useCallback(async (options: ChannelMessagesOptions = {}) => {
    if (!channelIdRef.current) return;
    
    setLoading(true);
    setError(null);

    const mergedOptions = {
      ...currentOptions,
      ...options
    };

    try {
      const channel = await getChannelDetail(channelIdRef.current, mergedOptions);
      
      // Normalisation des données pour assurer la cohérence
      const normalizedMessages = channel.messages?.map(normalizeMessage) || [];
      
      // Si c'est une nouvelle page ou un rafraîchissement, ajuste les messages
      if ((mergedOptions.pageNumber && mergedOptions.pageNumber > 1) && !isRefreshing) {
        setMessages(prev => {
          // Filtre les doublons par ID
          const existingIds = new Set(prev.map(m => m.id));
          const uniqueNewMessages = normalizedMessages.filter(m => !existingIds.has(m.id));
          return [...prev, ...uniqueNewMessages];
        });
      } else {
        setMessages(normalizedMessages);
        setIsRefreshing(false);
      }
      
      setChannelDetail(channel);
      setCurrentOptions(mergedOptions);
      
      // Vérification de la possibilité de charger plus de messages
      setHasMoreMessages(normalizedMessages.length === mergedOptions.pageSize);
    } catch (err) {
      handleError(err, 'chargement des messages');
      setIsRefreshing(false);
    } finally {
      setLoading(false);
    }
  }, [currentOptions, isRefreshing, handleError]);

  // Rafraîchir les messages (première page)
  const refreshMessages = useCallback(async () => {
    setIsRefreshing(true);
    setPage(1);
    await fetchMessages({ pageSize, pageNumber: 1 });
  }, [fetchMessages]);

  // Charger plus de messages (page suivante)
  const loadMoreMessages = useCallback(async () => {
    if (loading || !hasMoreMessages) return;
    
    const nextPage = page + 1;
    await fetchMessages({ pageSize, pageNumber: nextPage });
    setPage(nextPage);
  }, [loading, hasMoreMessages, page, fetchMessages]);

  // Envoyer un message avec gestion des erreurs et tentatives améliorées
  const sendMessage = useCallback(async (content: string): Promise<boolean> => {
    if (!channelIdRef.current) return false;
    
    // Génère un ID temporaire pour le suivi
    const tempId = `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    pendingMessagesRef.current.add(tempId);
    
    try {
      const messageDto: CreateMessageDto = {
        content: content,
        channelId: channelIdRef.current,
        attachmentIds: [],
      };

      // Optimistic UI update - ajoute le message immédiatement
      const optimisticMessage: Message = {
        id: tempId,
        content,
        sentAt: new Date(), // Using Date object instead of string
        isRead: false,
        channelId: channelIdRef.current,
        sender: { id: 'current-user', userName: 'Moi', avatar: "" }, // Sera remplacé par le vrai message
        attachments: [],
        reactions: [],
        isPending: true // Indicateur visuel que le message est en attente d'envoi
      };
      
      setMessages(prev => [optimisticMessage, ...prev]);
      
      // Vérifier l'état de la connexion avant d'envoyer
      if (!SignalRManager.getConnectionState() || SignalRManager.getConnectionState() !== 'Connected') {
        await SignalRManager.ensureConnected();
      }
      
      const success = await chatServiceRef.current.sendMessage(messageDto);
      
      if (!success) {
        // Si échec, marquer le message comme en erreur mais le garder visible
        setMessages(prev => 
          prev.map(msg => 
            msg.id === tempId 
              ? { ...msg, sendError: true, isPending: false } 
              : msg
          )
        );
      }
      
      pendingMessagesRef.current.delete(tempId);
      return success;
    } catch (err) {
      console.error('Erreur lors de l\'envoi du message:', err);
      
      // Marquer le message comme en erreur
      setMessages(prev => 
        prev.map(msg => 
          msg.id === tempId 
            ? { ...msg, sendError: true, isPending: false } 
            : msg
        )
      );
      
      pendingMessagesRef.current.delete(tempId);
      setError(err instanceof Error ? err : new Error('Une erreur est survenue lors de l\'envoi du message.'));
      return false;
    }
  }, []);

  // Normalise un message pour garantir la cohérence entre les propriétés
  const normalizeMessage = (messageDto: any): Message => {
    return {
      id: messageDto.Id || messageDto.id,
      content: messageDto.Content || messageDto.content,
      sentAt: messageDto.SentAt || messageDto.sentAt,
      isRead: messageDto.IsRead || messageDto.isRead || false,
      channelId: messageDto.ChannelId || messageDto.channelId,
      sender: messageDto.Sender || messageDto.sender || {},
      attachments: messageDto.Attachments || messageDto.attachments || [],
      reactions: messageDto.Reactions || messageDto.reactions || []
    };
  };

  // S'abonner aux nouveaux messages
  const onMessageReceived = useCallback((callback: (messageDto: Message) => void) => {
    chatServiceRef.current.onMessageReceived(callback);
  }, []);

  // Charger les messages au chargement du hook ou quand le channelId change
  useEffect(() => {
    if (channelId) {
      refreshMessages();
    }
    
    return () => {
      // Nettoyage si nécessaire
    };
  }, [channelId]);

  // Configurer les écouteurs pour les nouveaux messages
  useEffect(() => {
    if (!channelId) return;

    let isMounted = true;
    
    const handleNewMessage = (messageDto: any) => {
      if (!isMounted || !channelId) return;
      
      const normalizedMessage = normalizeMessage(messageDto);
      
      // Ne traiter que les messages du canal actuel
      if (normalizedMessage.channelId === channelId) {
        console.log('Message reçu dans useMessages:', normalizedMessage);
        
        setMessages(prev => {
          // Vérifier si le message existe déjà (pour éviter les doublons)
          const messageExists = prev.some(m => 
            m.id === normalizedMessage.id ||
            (m.id.startsWith('temp-') && 
             pendingMessagesRef.current.has(m.id) && 
             m.content === normalizedMessage.content)
          );
          
          if (messageExists) {
            // Remplacer le message temporaire par le message réel
            return prev.map(m => 
              (m.id.startsWith('temp-') && 
               pendingMessagesRef.current.has(m.id) && 
               m.content === normalizedMessage.content)
                ? { ...normalizedMessage, isPending: false }
                : m
            );
          } else {
            // Ajouter le nouveau message
            return [normalizedMessage, ...prev];
          }
        });
      }
    };

    chatServiceRef.current.onMessageReceived(handleNewMessage);
    
    // Configurer les écouteurs pour les reconnexions
    const handleReconnection = () => {
      if (isMounted) {
        console.log('Reconnecté dans useMessages, rafraîchissement des messages');
        refreshMessages();
      }
    };
    
    chatServiceRef.current.onConnectionReconnected(handleReconnection);
    
    return () => {
      isMounted = false;
      // Pas besoin de nettoyer les callbacks car ChatService conserve une seule référence
    };
  }, [channelId, refreshMessages]);

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