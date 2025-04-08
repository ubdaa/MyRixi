import { CreateMessageDto } from '@/types/message';
import SignalRManager, { SignalREvents, getApiBaseUrl } from './signalRService';

/**
 * Service de chat pour gérer les communications via SignalR
 */
class ChatService {
  private _isInitialized: boolean = false;
  
  /**
   * Initialise la connexion au hub de chat
   */
  async initialize(): Promise<boolean> {
    if (this._isInitialized) {
      return SignalRManager.isConnected();
    }
    
    try {
      const url = `${getApiBaseUrl()}/hubs/chat`;
      console.log(`[ChatService] Initialisation avec l'URL: ${url}`);
      
      const connected = await SignalRManager.connect(url);
      this._isInitialized = connected;
      return connected;
    } catch (error) {
      console.error('[ChatService] Erreur d\'initialisation:', error);
      return false;
    }
  }

  /**
   * Rejoindre un canal
   */
  async joinChannel(channelId: string): Promise<boolean> {
    try {
      if (!this._isInitialized) {
        await this.initialize();
      }
      
      console.log(`[ChatService] Rejoindre le canal: ${channelId}`);
      return await SignalRManager.joinChannel(channelId);
    } catch (error) {
      console.error(`[ChatService] Erreur en rejoignant le canal ${channelId}:`, error);
      return false;
    }
  }

  /**
   * Quitter un canal
   */
  async leaveChannel(channelId: string): Promise<boolean> {
    try {
      console.log(`[ChatService] Quitter le canal: ${channelId}`);
      return await SignalRManager.leaveChannel(channelId);
    } catch (error) {
      console.error(`[ChatService] Erreur en quittant le canal ${channelId}:`, error);
      return false;
    }
  }

  /**
   * Envoyer un message
   */
  async sendMessage(message: CreateMessageDto): Promise<boolean> {
    try {
      if (!this._isInitialized) {
        await this.initialize();
      }
      
      console.log(`[ChatService] Envoi d'un message au canal ${message.channelId}`);
      await SignalRManager.invoke('SendMessage', message);
      return true;
    } catch (error) {
      console.error('[ChatService] Erreur d\'envoi de message:', error);
      
      // Essayer de se reconnecter et réessayer une fois
      try {
        console.log('[ChatService] Tentative de reconnexion et nouvel essai');
        await this.initialize();
        await SignalRManager.invoke('SendMessage', message);
        return true;
      } catch (retryError) {
        console.error('[ChatService] Échec du second essai:', retryError);
        return false;
      }
    }
  }

  /**
   * Ajouter une réaction à un message
   */
  async addReaction(messageId: string, emoji: string): Promise<boolean> {
    try {
      if (!this._isInitialized) {
        await this.initialize();
      }
      
      await SignalRManager.invoke('AddReaction', messageId, emoji);
      return true;
    } catch (error) {
      console.error('[ChatService] Erreur d\'ajout de réaction:', error);
      return false;
    }
  }

  /**
   * Supprimer une réaction d'un message
   */
  async removeReaction(messageId: string, emoji: string): Promise<boolean> {
    try {
      if (!this._isInitialized) {
        await this.initialize();
      }
      
      await SignalRManager.invoke('RemoveReaction', messageId, emoji);
      return true;
    } catch (error) {
      console.error('[ChatService] Erreur de suppression de réaction:', error);
      return false;
    }
  }

  /**
   * Marquer les messages d'un canal comme lus
   */
  async markAsRead(channelId: string): Promise<boolean> {
    try {
      if (!this._isInitialized) {
        await this.initialize();
      }
      
      await SignalRManager.invoke('MarkAsRead', channelId);
      return true;
    } catch (error) {
      console.error('[ChatService] Erreur lors du marquage comme lu:', error);
      return false;
    }
  }

  /**
   * S'abonner à la réception des messages
   */
  onMessageReceived(callback: (message: any) => void): () => void {
    return SignalRManager.on(SignalREvents.MESSAGE_RECEIVED, callback);
  }

  /**
   * S'abonner aux notifications d'utilisateur rejoignant un canal
   */
  onUserJoinedChannel(callback: (data: any) => void): () => void {
    return SignalRManager.on(SignalREvents.USER_JOINED, callback);
  }

  /**
   * S'abonner aux notifications d'utilisateur quittant un canal
   */
  onUserLeftChannel(callback: (data: any) => void): () => void {
    return SignalRManager.on(SignalREvents.USER_LEFT, callback);
  }

  /**
   * S'abonner aux notifications de reconnexion
   */
  onReconnected(callback: () => void): () => void {
    return SignalRManager.on(SignalREvents.RECONNECTED, callback);
  }

  /**
   * S'abonner aux notifications de déconnexion
   */
  onDisconnected(callback: (error?: Error) => void): () => void {
    return SignalRManager.on(SignalREvents.DISCONNECTED, callback);
  }

  /**
   * S'abonner aux notifications d'erreur
   */
  onError(callback: (error: any) => void): () => void {
    return SignalRManager.on(SignalREvents.ERROR, callback);
  }

  /**
   * Vérifier si le service est connecté
   */
  isConnected(): boolean {
    return this._isInitialized && SignalRManager.isConnected();
  }
}

// Exporte une instance singleton
export default new ChatService();