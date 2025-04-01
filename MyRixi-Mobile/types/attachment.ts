import { Media } from "./media";

export interface AttachmentResponse {
  url: any;
  id: string;
  mediaId: string;
}

export interface Attachment {
  id: string;
  media: Media;
}