import { Media } from "./media";

export interface AttachmentResponse {
  id: string;
  mediaId: string;
}

export interface Attachment {
  id: string;
  media: Media;
}