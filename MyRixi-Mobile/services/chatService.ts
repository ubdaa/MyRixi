import { SendMessageRequest } from '@/types/message';
import * as signalR from '@microsoft/signalr';
import AsyncStorage from '@react-native-async-storage/async-storage';

export class ChatService {
  connection: signalR.HubConnection | null;
  callbacks: {
    messageReceived: (messageDto: any) => void,
    userJoinedChannel: (data: { UserId: string, ChannelId: string }) => void,
    userLeftChannel: (data: { UserId: string, ChannelId: string }) => void,
    connectionClosed: (error: Error | undefined) => void
  };

  constructor() {
    this.connection = null;
    this.callbacks = {
      messageReceived: () => {},
      userJoinedChannel: () => {},
      userLeftChannel: () => {},
      connectionClosed: () => {}
    };
  }

  async connect(url: string) {
    // Close any existing connection
    await this.disconnect();
    
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(url, {
        accessTokenFactory: async () => await AsyncStorage.getItem('token') || '',
        transport: signalR.HttpTransportType.WebSockets,
        skipNegotiation: true  // Try this if you're having connection issues
      })
      .configureLogging(signalR.LogLevel.Information)
      .withAutomaticReconnect([0, 2000, 5000, 10000, 15000, 30000]) // Retry with increasing delays
      .build();

    // Setup event handlers
    this.connection.on('ReceiveMessage', (messageDto: any) => {
      this.callbacks.messageReceived(messageDto);
    });

    this.connection.on('UserJoinedChannel', (data: { UserId: string, ChannelId: string }) => {
      this.callbacks.userJoinedChannel(data);
    });

    this.connection.on('UserLeftChannel', (data: { UserId: string, ChannelId: string }) => {
      this.callbacks.userLeftChannel(data);
    });

    // Setup connection closed handler
    this.connection.onclose((error) => {
      console.log('SignalR connection closed', error);
      this.callbacks.connectionClosed(error);
    });

    try {
      await this.connection.start();
      console.log('SignalR Connected');
      return true;
    } catch (err) {
      console.error('SignalR Connection Error: ', err);
      return false;
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
      this.connection = null;
    }
  }

  onMessageReceived(callback: (messageDto: any) => void) {
    this.callbacks.messageReceived = callback;
  }

  onUserJoinedChannel(callback: (data: { UserId: string, ChannelId: string }) => void) {
    this.callbacks.userJoinedChannel = callback;
  }

  onUserLeftChannel(callback: (data: { UserId: string, ChannelId: string }) => void) {
    this.callbacks.userLeftChannel = callback;
  }

  onConnectionClosed(callback: (error: Error | undefined) => void) {
    this.callbacks.connectionClosed = callback;
  }

  async joinChannel(channelId: string) {
    if (!this.connection || this.connection.state !== signalR.HubConnectionState.Connected) {
      console.error('Cannot join channel: SignalR not connected');
      return false;
    }

    try {
      // Make sure to convert string to GUID format if needed
      await this.connection.invoke('JoinChannel', channelId);
      console.log(`Joined channel: ${channelId}`);
      return true;
    } catch (err) {
      console.error('Error joining channel: ', err);
      return false;
    }
  }

  async leaveChannel(channelId: string) {
    if (!this.connection || this.connection.state !== signalR.HubConnectionState.Connected) {
      return false;
    }

    try {
      await this.connection.invoke('LeaveChannel', channelId);
      return true;
    } catch (err) {
      console.error('Error leaving channel: ', err);
      return false;
    }
  }

  async sendMessage(messageDto: SendMessageRequest) {
    if (!this.connection || this.connection.state !== signalR.HubConnectionState.Connected) {
      return false;
    }

    try {
      await this.connection.invoke('SendMessage', messageDto);
      return true;
    } catch (err) {
      console.error('Error sending message: ', err);
      return false;
    }
  }
}