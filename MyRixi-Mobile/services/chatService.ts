import { CreateMessageDto } from '@/types/message';
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
  isConnecting: boolean;
  isDisconnecting: boolean;

  constructor() {
    this.connection = null;
    this.callbacks = {
      messageReceived: () => {},
      userJoinedChannel: () => {},
      userLeftChannel: () => {},
      connectionClosed: () => {}
    };
    this.isConnecting = false;
    this.isDisconnecting = false;
  }

  async connect(url: string) {
    // Prevent concurrent connection attempts
    if (this.isConnecting) {
      console.log('Connection attempt already in progress');
      return false;
    }
    
    // If already connected, don't reconnect
    if (this.connection && this.connection.state === signalR.HubConnectionState.Connected) {
      console.log('SignalR already connected');
      return true;
    }

    this.isConnecting = true;
    
    try {
      // Make sure any existing connection is properly closed first
      await this.disconnect();
      
      // Add a small delay to ensure disconnect completes
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Build a new connection
      this.connection = new signalR.HubConnectionBuilder()
        .withUrl(url, {
          accessTokenFactory: async () => await AsyncStorage.getItem('token') || '',
          transport: signalR.HttpTransportType.WebSockets,
          skipNegotiation: true
        })
        .configureLogging(signalR.LogLevel.Information)
        .withAutomaticReconnect([0, 2000, 5000, 10000, 15000, 30000])
        .build();

      // Setup event handlers avec plus de logs de debug
      this.connection.on('ReceiveMessage', (messageDto: any) => {
        console.log('SignalR ReceiveMessage event triggered with data:', messageDto);
        this.callbacks.messageReceived(messageDto);
      });

      this.connection.on('UserJoinedChannel', (data: { UserId: string, ChannelId: string }) => {
        console.log('SignalR UserJoinedChannel event triggered:', data);
        this.callbacks.userJoinedChannel(data);
      });

      this.connection.on('UserLeftChannel', (data: { UserId: string, ChannelId: string }) => {
        console.log('SignalR UserLeftChannel event triggered:', data);
        this.callbacks.userLeftChannel(data);
      });

      // Setup connection closed handler
      this.connection.onclose((error) => {
        console.log('SignalR connection closed', error);
        this.callbacks.connectionClosed(error);
      });

      await this.connection.start();
      console.log('SignalR Connected');
      return true;
    } catch (err) {
      console.error('SignalR Connection Error: ', err);
      return false;
    } finally {
      this.isConnecting = false;
    }
  }

  async disconnect() {
    // Prevent concurrent disconnection attempts
    if (this.isDisconnecting) {
      console.log('Disconnection already in progress');
      return;
    }
    
    if (!this.connection) {
      console.log('No active connection to disconnect');
      return;
    }
    
    this.isDisconnecting = true;
    
    try {
      // Only try to stop if the connection is in a state that can be stopped
      if (this.connection.state !== signalR.HubConnectionState.Disconnected &&
          this.connection.state !== signalR.HubConnectionState.Disconnecting) {
        await this.connection.stop();
        console.log('SignalR Disconnected');
      } else {
        console.log('SignalR already disconnected or disconnecting');
      }
    } catch (err) {
      console.error('SignalR Disconnection Error: ', err);
    } finally {
      this.connection = null;
      this.isDisconnecting = false;
    }
  }

  onMessageReceived(callback: (messageDto: any) => void) {
    console.log('Setting up new message received callback');
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

  async sendMessage(messageDto: CreateMessageDto) {
    if (!this.connection || this.connection.state !== signalR.HubConnectionState.Connected) {
      console.error('Cannot send message: SignalR not connected');
      return false;
    }

    console.log('Sending message: ', messageDto);

    try {
      await this.connection.invoke('SendMessage', messageDto);
      console.log('Message sent successfully');
      return true;
    } catch (err) {
      console.error('Error sending message: ', err);
      return false;
    }
  }
}