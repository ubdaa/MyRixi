import { Message } from "./message";
import { UserChannel } from "./profile";

export interface Channel {
  id: string;
  name: string;
  description: string;
  isPrivate: boolean;
  type: string;
  communityId?: string;
  participantCount: number;
  unreadCount: number;
  lastMessage?: Message;
}

export interface ChannelDetail extends Channel {
  participants: UserChannel[];
  messages: Message[];
}

export interface CreateChannelRequest {
  name: string;
  description: string;
  isPrivate: boolean;
}

export interface UpdateChannelRequest {
  name: string;
  description: string;
  isPrivate: boolean;
}

export interface ChannelMessagesOptions {
  pageSize?: number;
  pageNumber?: number;
}