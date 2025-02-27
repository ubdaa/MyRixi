import { Media } from "./media";
import { UserChannel } from "./profile";
import { Reaction } from "./reaction";

export interface Message {
  id: string;
  content: string;
  sentAt: Date;
  isRead: boolean;
  sender?: UserChannel;
  attachments: Media[];
  reactions: Reaction[];
}