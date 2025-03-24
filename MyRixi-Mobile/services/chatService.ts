import { CreateMessageDto } from '@/types/message';
import SignalRManager, { SignalREvents } from './signalRService';

export class ChatService {
  private callbacks: {
    messageReceived: (messageDto: any) => void,
    userJoinedChannel: (data: { UserId: string, ChannelId: string }) => void,
    userLeftChannel: (data: { UserId: string, ChannelId: string }) => void,
    connectionClosed: (error: Error | undefined) => void,
    connectionReconnected: () => void
  };
  
  private registeredEvents: boolean = false;
  private cleanupFunctions: (() => void)[] = [];

  constructor() {
    this.callbacks = {
      messageReceived: () => {},
      userJoinedChannel: () => {},
      userLeftChannel: () => {},
      connectionClosed: () => {},
      connectionReconnected: () => {}
    };
  }

  /**
   * Établit la connexion au hub SignalR et enregistre les gestionnaires d'événements
   */
  async connect(url: string): Promise<boolean> {
    try {
      // Nettoie les écouteurs précédents
      this.unregisterEventHandlers();
      
      const success = await SignalRManager.connect(url);
      
      if (success) {
        this.registerEventHandlers();
      }
      
      return success;
    } catch (error) {
      console.error('Erreur lors de la connexion à SignalR:', error);
      return false;
    }
  }

  /**
   * Enregistre les gestionnaires d'événements pour SignalR
   */
  private registerEventHandlers(): void {
    if (this.registeredEvents) {
      return;
    }
    
    // Gestion des messages reçus
    SignalRManager.on('ReceiveMessage', (messageDto: any) => {
      console.log('SignalR: événement ReceiveMessage déclenché:', messageDto);
      this.callbacks.messageReceived(messageDto);
    });
    
    // Gestion des utilisateurs rejoignant un canal
    SignalRManager.on('UserJoinedChannel', (data: { UserId: string, ChannelId: string }) => {
      console.log('SignalR: événement UserJoinedChannel déclenché:', data);
      this.callbacks.userJoinedChannel(data);
    });
    
    // Gestion des utilisateurs quittant un canal
    SignalRManager.on('UserLeftChannel', (data: { UserId: string, ChannelId: string }) => {
      console.log('SignalR: événement UserLeftChannel déclenché:', data);
      this.callbacks.userLeftChannel(data);
    });
    
    // Gestion des événements de connexion/déconnexion
    const disconnectedCleaner = SignalRManager.addEventListener(SignalREvents.DISCONNECTED, 
      (error: Error | undefined) => {
        console.log('SignalR: événement DISCONNECTED déclenché');
        this.callbacks.connectionClosed(error);
      }
    );
    
    const reconnectedCleaner = SignalRManager.addEventListener(SignalREvents.RECONNECTED, 
      () => {
        console.log('SignalR: événement RECONNECTED déclenché');
        this.callbacks.connectionReconnected();
      }
    );
    
    // Sauvegarde des fonctions de nettoyage
    this.cleanupFunctions.push(disconnectedCleaner, reconnectedCleaner);
    
    this.registeredEvents = true;
  }

  /**
   * Supprime les gestionnaires d'événements
   */
  private unregisterEventHandlers(): void {
    if (!this.registeredEvents) {
      return;
    }
    
    // Suppression des gestionnaires d'événements hub
    SignalRManager.off('ReceiveMessage');
    SignalRManager.off('UserJoinedChannel');
    SignalRManager.off('UserLeftChannel');
    
    // Suppression des écouteurs d'événements
    this.cleanupFunctions.forEach(cleanup => cleanup());
    this.cleanupFunctions = [];
    
    this.registeredEvents = false;
  }

  /**
   * Ferme la connexion
   */
  async disconnect(): Promise<void> {
    this.unregisterEventHandlers();
    // Pas besoin de fermer la connexion SignalR ici
    // car SignalRManager gère cela au niveau global
  }

  /**
   * Définit le callback pour les messages reçus
   */
  onMessageReceived(callback: (messageDto: any) => void): void {
    console.log('Configuration du callback pour les nouveaux messages');
    this.callbacks.messageReceived = callback;
  }

  /**
   * Définit le callback pour les utilisateurs rejoignant un canal
   */
  onUserJoinedChannel(callback: (data: { UserId: string, ChannelId: string }) => void): void {
    this.callbacks.userJoinedChannel = callback;
  }

  /**
   * Définit le callback pour les utilisateurs quittant un canal
   */
  onUserLeftChannel(callback: (data: { UserId: string, ChannelId: string }) => void): void {
    this.callbacks.userLeftChannel = callback;
  }

  /**
   * Définit le callback pour la fermeture de connexion
   */
  onConnectionClosed(callback: (error: Error | undefined) => void): void {
    this.callbacks.connectionClosed = callback;
  }

  /**
   * Définit le callback pour la reconnexion
   */
  onConnectionReconnected(callback: () => void): void {
    this.callbacks.connectionReconnected = callback;
  }

  /**
   * Rejoint un canal
   */
  async joinChannel(channelId: string): Promise<boolean> {
    return await SignalRManager.joinChannel(channelId);
  }

  /**
   * Quitte un canal
   */
  async leaveChannel(channelId: string): Promise<boolean> {
    return await SignalRManager.leaveChannel(channelId);
  }

  /**
   * Envoie un message
   */
  async sendMessage(messageDto: CreateMessageDto): Promise<boolean> {
    try {
      console.log('Envoi de message:', messageDto);
      await SignalRManager.invoke('SendMessage', messageDto);
      console.log('Message envoyé avec succès');
      return true;
    } catch (err) {
      console.error('Erreur lors de l\'envoi du message:', err);
      
      // Tentative de reconnexion et nouvel essai
      try {
        const reconnected = await SignalRManager.ensureConnected();
        if (reconnected) {
          await SignalRManager.invoke('SendMessage', messageDto);
          console.log('Message envoyé après reconnexion');
          return true;
        }
      } catch (retryErr) {
        console.error('Échec de la tentative de réenvoi:', retryErr);
      }
      
      return false;
    }
  }
  
  /**
   * Vérifie si la connexion est établie
   */
  isConnected(): boolean {
    const state = SignalRManager.getConnectionState();
    return state === 'Connected';
  }
}

// Exporte une instance par défaut pour faciliter l'utilisation
export default new ChatService();