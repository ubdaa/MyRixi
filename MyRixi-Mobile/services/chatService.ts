import * as signalR from '@microsoft/signalr';

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
      .withUrl(url)
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

  async joinGroup(groupName: string) {
    if (this.connection) {
      try {
        await this.connection.invoke('JoinGroup', groupName);
      } catch (err) {
        console.error('Error joining group: ', err);
      }
    }
  }

  async sendToGroup(groupName: string, user: string, message: string) {
    if (this.connection) {
      try {
        await this.connection.invoke('SendToGroup', groupName, user, message);
      } catch (err) {
        console.error('Error sending to group: ', err);
      }
    }
  }
}