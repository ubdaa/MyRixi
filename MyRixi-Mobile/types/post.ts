import { TagResponse } from './tag';
import { Attachment } from './attachment';
import { CommentResponse } from './comment';

export enum PostType {
  Standard = 0,
}

export interface Post {
  id: string;
  title: string;
  content: string;
  publishedAt: string;
  postType: PostType;
  tags: TagResponse[];
  attachments: Attachment[];
  comments: CommentResponse[];
}