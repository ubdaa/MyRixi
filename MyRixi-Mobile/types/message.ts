import { Channel } from "./channel";
import { Media } from "./media";
import { UserChannel } from "./profile";
import { Reaction } from "./reaction";

export interface Message {
  id: string;
  content: string;
  sentAt: Date;
  isRead: boolean;
  channelId: string;
  channel?: Channel;
  sender?: UserChannel;
  attachments: Media[];
  reactions: Reaction[];
}

export interface SendMessageRequest {
  content: string;
  channelId: string;
  attachmentIds: string[];
}