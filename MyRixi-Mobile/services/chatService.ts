import * as signalR from '@microsoft/signalr';
import AsyncStorage from '@react-native-async-storage/async-storage';

export class ChatService {
  connection: signalR.HubConnection | null;
  callbacks: {
    messageReceived: (user: string, message: string) => void,
    groupMessageReceived: (group: string, user: string, message: string) => void,
  };

  constructor() {
    this.connection = null;
    this.callbacks = {
      messageReceived: () => {},
      groupMessageReceived: () => {},
    };
  }

  async connect(url: string) {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(url, {
        accessTokenFactory: async () => await AsyncStorage.getItem('token') || '',
        transport: signalR.HttpTransportType.WebSockets
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    // Récupérer les évènements émis par le hub SignalR
    this.connection.on('ReceiveMessage', (user: string, message: string) => {
      this.callbacks.messageReceived(user, message);
    });

    this.connection.on('ReceiveGroupMessage', (group: string, user: string, message: string) => {
      this.callbacks.groupMessageReceived(group, user, message);
    });

    try {
      await this.connection.start();
      console.log('SignalR Connected');
    } catch (err) {
      console.error('SignalR Connection Error: ', err);
    }
  }

  async disconnect() {
    if (this.connection) {
      try {
        await this.connection.stop();
        console.log('SignalR Disconnected');
      } catch (err) {
        console.error('SignalR Disconnection Error: ', err);
      }
    }
  }

  onMessageReceived(callback: (user: string, message: string) => void) {
    this.callbacks.messageReceived = callback;
  }

  onGroupMessageReceived(callback: (group: string, user: string, message: string) => void) {
    this.callbacks.groupMessageReceived = callback;
  }

  async sendMessage(user: string, message: string) {
    if (this.connection) {
      try {
        await this.connection.invoke('SendMessage', user, message);
      } catch (err) {
        console.error('Error sending message: ', err);
      }
    }
  }

  async joinChannel(channelId: string) {
    if (this.connection) {
      try {
        await this.connection.invoke('JoinChannel', channelId);
      } catch (err) {
        console.error('Error joining group: ', err);
      }
    }
  }

  async sendToChannel(channelId: string, user: string, message: string) {
    if (this.connection) {
      try {
        await this.connection.invoke('SendMessage', channelId, user, message);
      } catch (err) {
        console.error('Error sending to group: ', err);
      }
    }
  }
}