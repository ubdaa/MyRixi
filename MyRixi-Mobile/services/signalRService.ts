import * as signalR from '@microsoft/signalr';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Événements disponibles
export const SignalREvents = {
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected', 
  RECONNECTING: 'reconnecting',
  RECONNECTED: 'reconnected',
  ERROR: 'error',
  MESSAGE_RECEIVED: 'message_received',
  USER_JOINED: 'user_joined',
  USER_LEFT: 'user_left'
};

/**
 * Configuration de l'environnement
 */
export const getApiBaseUrl = () => {
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:5000/v1';
  }
  return 'http://172.20.10.2:5000/v1';
};

type EventCallback = (...args: any[]) => void;

/**
 * Gestionnaire de connexion SignalR singleton
 * Gère une seule connexion pour toute l'application, avec reconnexion automatique
 */
class SignalRManager {
  private static instance: SignalRManager;
  private connection: signalR.HubConnection | null = null;
  private connectionUrl: string | null = null;
  private eventListeners: Map<string, Set<EventCallback>> = new Map();
  private isConnecting: boolean = false;
  private activeChannels: Set<string> = new Set();
  private reconnectTimer: NodeJS.Timeout | null = null;
  private connectionStartTime: number = 0;
  
  private constructor() {}
  
  public static getInstance(): SignalRManager {
    if (!SignalRManager.instance) {
      SignalRManager.instance = new SignalRManager();
    }
    return SignalRManager.instance;
  }

  /**
   * Ajoute un écouteur pour un événement
   */
  public on(event: string, callback: EventCallback): () => void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    
    this.eventListeners.get(event)?.add(callback);
    
    return () => this.off(event, callback);
  }

  /**
   * Supprime un écouteur d'événement spécifique
   */
  public off(event: string, callback?: EventCallback): void {
    if (!callback) {
      this.eventListeners.delete(event);
    } else if (this.eventListeners.has(event)) {
      this.eventListeners.get(event)?.delete(callback);
    }
  }

  /**
   * Déclenche un événement
   */
  private emit(event: string, ...args: any[]): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(...args);
        } catch (error) {
          console.error(`Erreur dans un écouteur d'événement ${event}:`, error);
        }
      });
    }
  }

  /**
   * Connecte au hub SignalR
   */
  public async connect(hubUrl: string): Promise<boolean> {
    // Éviter les connexions parallèles
    if (this.isConnecting) {
      console.log('[SignalR] Connexion déjà en cours');
      return false;
    }
    
    this.isConnecting = true;
    this.connectionUrl = hubUrl;
    
    try {
      // Si une connexion existe déjà, la fermer proprement
      await this.closeConnection();
      
      console.log('[SignalR] Création d\'une nouvelle connexion');
      
      // Création d'une nouvelle connexion avec des paramètres optimisés
      this.connection = new signalR.HubConnectionBuilder()
        .withUrl(hubUrl, {
          accessTokenFactory: async () => {
            const token = await AsyncStorage.getItem('token');
            return token || '';
          },
          skipNegotiation: true,
          transport: signalR.HttpTransportType.WebSockets
        })
        .withAutomaticReconnect({
          nextRetryDelayInMilliseconds: this.getRetryDelayStrategy()
        })
        .configureLogging(signalR.LogLevel.Information)
        .build();
      
      // Configuration des gestionnaires d'événements de base
      this.setupConnectionEventHandlers();
      
      // Configuration des méthodes du hub
      this.setupHubMethods();
      
      // Démarrage de la connexion
      await this.connection.start();
      this.connectionStartTime = Date.now();
      console.log('[SignalR] Connecté avec succès');
      this.emit(SignalREvents.CONNECTED);
      
      // Rejoindre à nouveau les canaux actifs si reconnexion
      this.rejoinActiveChannels();
      
      this.isConnecting = false;
      return true;
      
    } catch (error) {
      console.error('[SignalR] Erreur de connexion:', error);
      this.emit(SignalREvents.ERROR, error);
      this.isConnecting = false;
      
      // Programmer une nouvelle tentative
      this.scheduleReconnection();
      
      return false;
    }
  }

  /**
   * Configuration des gestionnaires d'événements pour la connexion
   */
  private setupConnectionEventHandlers(): void {
    if (!this.connection) return;
    
    this.connection.onreconnecting((error) => {
      console.log('[SignalR] Tentative de reconnexion en cours', error);
      this.emit(SignalREvents.RECONNECTING, error);
    });
    
    this.connection.onreconnected((connectionId) => {
      console.log('[SignalR] Reconnexion réussie', connectionId);
      this.emit(SignalREvents.RECONNECTED, connectionId);
      this.rejoinActiveChannels();
    });
    
    this.connection.onclose((error) => {
      console.log('[SignalR] Connexion fermée', error);
      this.emit(SignalREvents.DISCONNECTED, error);
      
      // Si la connexion n'a pas duré plus de 10 secondes, attendre plus longtemps avant de réessayer
      const connectionDuration = Date.now() - this.connectionStartTime;
      if (connectionDuration < 10000) {
        console.log('[SignalR] La connexion était instable (< 10s), attente plus longue avant nouvelle tentative');
        setTimeout(() => this.scheduleReconnection(), 5000);
      } else {
        this.scheduleReconnection();
      }
    });
  }

  /**
   * Configure les méthodes du hub SignalR
   */
  private setupHubMethods(): void {
    if (!this.connection) return;
    
    // Configuration des méthodes du hub
    this.connection.on('ReceiveMessage', (message) => {
      this.emit(SignalREvents.MESSAGE_RECEIVED, message);
    });
    
    this.connection.on('UserJoinedChannel', (data) => {
      this.emit(SignalREvents.USER_JOINED, data);
    });
    
    this.connection.on('UserLeftChannel', (data) => {
      this.emit(SignalREvents.USER_LEFT, data);
    });
    
    // Autres méthodes du hub peuvent être ajoutées ici
  }

  /**
   * Programme une reconnexion automatique
   */
  private scheduleReconnection(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }
    
    const delay = this.calculateReconnectDelay();
    console.log(`[SignalR] Nouvelle tentative dans ${delay}ms`);
    
    this.reconnectTimer = setTimeout(async () => {
      if (this.connection?.state === signalR.HubConnectionState.Connected) {
        return;
      }
      
      if (this.connectionUrl) {
        try {
          await this.connect(this.connectionUrl);
        } catch (error) {
          console.error('[SignalR] Échec de la reconnexion programmée:', error);
        }
      }
    }, delay);
  }

  /**
   * Calcule un délai de reconnexion avec backoff exponentiel et jitter
   */
  private calculateReconnectDelay(): number {
    // Calcule un délai entre 2-10 secondes
    const baseDelay = 2000;
    const maxJitter = 8000;
    return baseDelay + Math.floor(Math.random() * maxJitter);
  }

  /**
   * Définit la stratégie de délai pour les tentatives de reconnexion automatique
   */
  private getRetryDelayStrategy(): (retryContext: signalR.RetryContext) => number | null {
    return (retryContext: signalR.RetryContext) => {
      // Arrêter après 10 tentatives automatiques
      if (retryContext.previousRetryCount >= 10) {
        return null;
      }
      
      // Backoff exponentiel avec jitter
      const baseDelay = Math.min(1000 * Math.pow(2, retryContext.previousRetryCount), 30000);
      const jitter = Math.floor(Math.random() * 3000);
      return baseDelay + jitter;
    };
  }

  /**
   * Ferme proprement la connexion
   */
  private async closeConnection(): Promise<void> {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    
    if (this.connection && this.connection.state !== signalR.HubConnectionState.Disconnected) {
      try {
        await this.connection.stop();
        console.log('[SignalR] Connexion arrêtée');
      } catch (error) {
        console.warn('[SignalR] Erreur lors de l\'arrêt de la connexion:', error);
      }
    }
  }

  /**
   * Déconnecte du hub et nettoie les ressources
   */
  public async disconnect(): Promise<void> {
    await this.closeConnection();
    this.activeChannels.clear();
    this.eventListeners.clear();
  }

  /**
   * Rejoindre un canal chat
   */
  public async joinChannel(channelId: string): Promise<boolean> {
    try {
      if (!(await this.ensureConnected())) {
        return false;
      }
      
      await this.connection!.invoke('JoinChannel', channelId);
      this.activeChannels.add(channelId);
      console.log(`[SignalR] Canal rejoint: ${channelId}`);
      return true;
    } catch (error) {
      console.error(`[SignalR] Erreur lors de la jointure du canal ${channelId}:`, error);
      return false;
    }
  }

  /**
   * Quitter un canal chat
   */
  public async leaveChannel(channelId: string): Promise<boolean> {
    try {
      if (this.connection?.state === signalR.HubConnectionState.Connected) {
        await this.connection.invoke('LeaveChannel', channelId);
        console.log(`[SignalR] Canal quitté: ${channelId}`);
      }
      
      this.activeChannels.delete(channelId);
      return true;
    } catch (error) {
      console.error(`[SignalR] Erreur lors de la sortie du canal ${channelId}:`, error);
      return false;
    }
  }

  /**
   * Invoque une méthode sur le hub
   */
  public async invoke<T = any>(methodName: string, ...args: any[]): Promise<T> {
    if (!(await this.ensureConnected())) {
      throw new Error(`[SignalR] Impossible d'invoquer ${methodName}: non connecté`);
    }
    
    try {
      return await this.connection!.invoke<T>(methodName, ...args);
    } catch (error) {
      console.error(`[SignalR] Erreur lors de l'invocation de ${methodName}:`, error);
      
      // Si l'erreur est due à une connexion perdue, essayer de se reconnecter et réessayer
      if (this.connection?.state !== signalR.HubConnectionState.Connected) {
        if (await this.ensureConnected(true)) {
          return await this.connection!.invoke<T>(methodName, ...args);
        }
      }
      
      throw error;
    }
  }

  /**
   * S'assure que la connexion est active
   */
  public async ensureConnected(forceReconnect: boolean = false): Promise<boolean> {
    if (!this.connectionUrl) return false;
    
    if (this.connection?.state === signalR.HubConnectionState.Connected && !forceReconnect) {
      return true;
    }
    
    if (this.isConnecting) {
      // Attendre que la connexion en cours se termine
      return new Promise<boolean>((resolve) => {
        const checkInterval = setInterval(() => {
          if (!this.isConnecting) {
            clearInterval(checkInterval);
            resolve(this.connection?.state === signalR.HubConnectionState.Connected);
          }
        }, 100);
        
        // Timeout après 5 secondes
        setTimeout(() => {
          clearInterval(checkInterval);
          resolve(this.connection?.state === signalR.HubConnectionState.Connected);
        }, 5000);
      });
    }
    
    return await this.connect(this.connectionUrl);
  }

  /**
   * Rejoint tous les canaux actifs (utile après reconnexion)
   */
  private async rejoinActiveChannels(): Promise<void> {
    if (this.activeChannels.size === 0) return;
    
    console.log(`[SignalR] Réintégration de ${this.activeChannels.size} canaux actifs`);
    
    const channelIds = Array.from(this.activeChannels);
    for (const channelId of channelIds) {
      try {
        await this.joinChannel(channelId);
      } catch (error) {
        console.error(`[SignalR] Échec de réintégration du canal ${channelId}:`, error);
      }
    }
  }

  /**
   * Retourne l'état actuel de la connexion
   */
  public getConnectionState(): signalR.HubConnectionState | null {
    return this.connection?.state || null;
  }

  /**
   * Vérifie si la connexion est active
   */
  public isConnected(): boolean {
    return this.connection?.state === signalR.HubConnectionState.Connected;
  }
}

// Exporte l'instance singleton
export default SignalRManager.getInstance();