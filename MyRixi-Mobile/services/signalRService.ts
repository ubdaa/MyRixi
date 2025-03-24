import * as signalR from '@microsoft/signalr';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Gestionnaire de connexion SignalR centralisé utilisant un Singleton
 * pour assurer une seule connexion à travers l'application
 */
class SignalRManager {
  private static instance: SignalRManager;
  private connection: signalR.HubConnection | null = null;
  private connectionUrl: string | null = null;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 10;
  private eventListeners: Map<string, Set<Function>> = new Map();
  private isConnecting: boolean = false;
  private activeChannels: Set<string> = new Set();
  
  // Définition des événements internes
  public readonly events = {
    CONNECTED: 'connected',
    DISCONNECTED: 'disconnected',
    ERROR: 'error',
    RECONNECTING: 'reconnecting',
    RECONNECTED: 'reconnected'
  };
  
  private constructor() {}
  
  /**
   * Récupère l'instance unique du gestionnaire
   */
  public static getInstance(): SignalRManager {
    if (!SignalRManager.instance) {
      SignalRManager.instance = new SignalRManager();
    }
    return SignalRManager.instance;
  }

  /**
   * Ajoute un écouteur d'événement
   */
  public addEventListener(event: string, callback: Function): () => void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    this.eventListeners.get(event)?.add(callback);
    
    // Retourne une fonction de nettoyage
    return () => {
      this.eventListeners.get(event)?.delete(callback);
    };
  }

  /**
   * Déclenche un événement pour tous les écouteurs abonnés
   */
  private emitEvent(event: string, ...args: any[]): void {
    this.eventListeners.get(event)?.forEach(callback => {
      callback(...args);
    });
  }

  /**
   * Ajoute un canal à la liste des canaux actifs
   */
  public addActiveChannel(channelId: string): void {
    this.activeChannels.add(channelId);
  }

  /**
   * Supprime un canal de la liste des canaux actifs
   */
  public removeActiveChannel(channelId: string): void {
    this.activeChannels.delete(channelId);
  }

  /**
   * Établit la connexion au hub SignalR
   */
  public async connect(url: string): Promise<boolean> {
    // Évite les connexions simultanées
    if (this.isConnecting) {
      console.log('SignalR: connexion déjà en cours');
      return false;
    }
    
    // Enregistre l'URL pour les reconnexions
    this.connectionUrl = url;
    this.isConnecting = true;

    try {
      // Ferme la connexion existante si nécessaire
      await this.disconnect();
      
      console.log('SignalR: création d\'une nouvelle connexion');
      
      // Crée une nouvelle connexion avec des paramètres robustes
      this.connection = new signalR.HubConnectionBuilder()
        .withUrl(url, {
          accessTokenFactory: async () => await AsyncStorage.getItem('token') || '',
          transport: signalR.HttpTransportType.WebSockets,
          skipNegotiation: true
        })
        .configureLogging(signalR.LogLevel.Information)
        .withAutomaticReconnect({
          // Stratégie de backoff exponentiel avec jitter pour éviter la surcharge
          nextRetryDelayInMilliseconds: (retryContext) => {
            if (retryContext.previousRetryCount > 10) {
              // Retourne null pour arrêter les tentatives après 10 essais
              return null;
            }
            
            // Backoff exponentiel avec jitter (0-3s) pour éviter les reconnexions simultanées
            const jitter = Math.floor(Math.random() * 3000);
            const delay = Math.min(30000, 1000 * Math.pow(2, retryContext.previousRetryCount)) + jitter;
            console.log(`SignalR: tentative de reconnexion dans ${delay}ms (essai ${retryContext.previousRetryCount + 1})`);
            return delay;
          }
        })
        .build();

      // Configuration des gestionnaires d'événements de reconnexion
      this.connection.onreconnecting(error => {
        console.log('SignalR: reconnexion en cours', error);
        this.emitEvent(this.events.RECONNECTING, error);
      });

      this.connection.onreconnected(connectionId => {
        console.log('SignalR: reconnecté', connectionId);
        this.reconnectAttempts = 0;
        this.emitEvent(this.events.RECONNECTED, connectionId);
        
        // Réintégration automatique aux canaux actifs
        this.rejoinActiveChannels();
      });

      this.connection.onclose(error => {
        console.log('SignalR: connexion fermée', error);
        this.emitEvent(this.events.DISCONNECTED, error);
        
        // Logique de reconnexion manuelle si la reconnexion automatique échoue
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++;
          console.log(`SignalR: tentative manuelle ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
          this.isConnecting = false;
          setTimeout(() => {
            // Vérification supplémentaire pour éviter les reconnexions inutiles
            if (this.connection?.state !== signalR.HubConnectionState.Connected) {
              this.connect(this.connectionUrl!);
            }
          }, 5000);
        }
      });
      
      // Démarre la connexion
      await this.connection.start();
      console.log('SignalR: connecté avec succès');
      this.reconnectAttempts = 0;
      this.emitEvent(this.events.CONNECTED);
      this.isConnecting = false;
      return true;
      
    } catch (error) {
      console.error('SignalR: erreur de connexion:', error);
      this.emitEvent(this.events.ERROR, error);
      this.isConnecting = false;
      
      // Nouvelle tentative automatique en cas d'échec initial
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++;
        console.log(`SignalR: nouvelle tentative ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
        setTimeout(() => {
          this.connect(url);
        }, 3000);
      }
      
      return false;
    }
  }

  /**
   * Ferme la connexion
   */
  public async disconnect(): Promise<void> {
    if (this.connection) {
      try {
        await this.connection.stop();
        console.log('SignalR: déconnecté');
      } catch (err) {
        console.error('SignalR: erreur lors de la déconnexion:', err);
      }
      this.connection = null;
    }
  }

  /**
   * Invoque une méthode sur le hub SignalR
   */
  public async invoke(methodName: string, ...args: any[]): Promise<any> {
    if (!this.connection || this.connection.state !== signalR.HubConnectionState.Connected) {
      console.warn(`SignalR: impossible d'invoquer ${methodName}: non connecté`);
      
      // Essaie de se reconnecter avant d'échouer
      const connected = await this.ensureConnected();
      if (!connected) {
        throw new Error(`Échec de l'invocation de ${methodName}: connexion indisponible`);
      }
    }

    try {
      return await this.connection!.invoke(methodName, ...args);
    } catch (error) {
      console.error(`SignalR: erreur lors de l'invocation de ${methodName}:`, error);
      throw error;
    }
  }

  /**
   * Enregistre un gestionnaire pour un événement du hub
   */
  public on(methodName: string, callback: (...args: any[]) => void): void {
    if (this.connection) {
      this.connection.on(methodName, callback);
    } else {
      console.error(`SignalR: impossible d'enregistrer un gestionnaire pour ${methodName}: non initialisé`);
    }
  }

  /**
   * Supprime un gestionnaire d'événement
   */
  public off(methodName: string, callback?: (...args: any[]) => void): void {
    if (this.connection) {
      if (!callback) {
        this.connection.off(methodName);
      } else {
        this.connection.off(methodName, callback);
      }
    }
  }

  /**
   * Récupère l'état actuel de la connexion
   */
  public getConnectionState(): signalR.HubConnectionState | null {
    return this.connection?.state || null;
  }

  /**
   * S'assure que la connexion est établie
   */
  public async ensureConnected(): Promise<boolean> {
    if (!this.connectionUrl) return false;
    
    if (this.connection?.state === signalR.HubConnectionState.Connected) {
      return true;
    }
    
    if (this.connection?.state === signalR.HubConnectionState.Disconnected) {
      try {
        await this.connection.start();
        console.log('SignalR: reconnecté avec succès');
        
        // Réintégration automatique aux canaux actifs
        this.rejoinActiveChannels();
        return true;
      } catch (error) {
        console.error('SignalR: erreur de reconnexion:', error);
        return false;
      }
    }
    
    return this.isConnecting;
  }

  /**
   * Rejoint un canal
   */
  public async joinChannel(channelId: string): Promise<boolean> {
    try {
      await this.ensureConnected();
      await this.invoke('JoinChannel', channelId);
      console.log(`SignalR: canal rejoint: ${channelId}`);
      this.addActiveChannel(channelId);
      return true;
    } catch (err) {
      console.error(`SignalR: erreur lors du join du canal ${channelId}:`, err);
      return false;
    }
  }

  /**
   * Quitte un canal
   */
  public async leaveChannel(channelId: string): Promise<boolean> {
    try {
      if (this.connection?.state === signalR.HubConnectionState.Connected) {
        await this.invoke('LeaveChannel', channelId);
        console.log(`SignalR: canal quitté: ${channelId}`);
      }
      this.removeActiveChannel(channelId);
      return true;
    } catch (err) {
      console.error(`SignalR: erreur lors du leave du canal ${channelId}:`, err);
      return false;
    }
  }

  /**
   * Rejoint tous les canaux actifs (utile après reconnexion)
   */
  private async rejoinActiveChannels(): Promise<void> {
    if (this.activeChannels.size > 0) {
      console.log(`SignalR: réintégration de ${this.activeChannels.size} canaux actifs`);
      const promises = Array.from(this.activeChannels).map(async (channelId) => {
        try {
          await this.invoke('JoinChannel', channelId);
          console.log(`SignalR: réintégration du canal ${channelId} réussie`);
        } catch (err) {
          console.error(`SignalR: échec de la réintégration du canal ${channelId}:`, err);
        }
      });
      
      await Promise.allSettled(promises);
    }
  }
}

// Export des constantes d'événements pour faciliter l'utilisation
export const SignalREvents = {
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected',
  ERROR: 'error',
  RECONNECTING: 'reconnecting',
  RECONNECTED: 'reconnected',
};

// Exporte l'instance unique
export default SignalRManager.getInstance();