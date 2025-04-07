import { TagResponse } from './tag';
import { Attachment } from './attachment';
import { CommentResponse } from './comment';

export enum PostType {
  Standard = 0,
}

export enum PostState {
  Draft = 0,
  Published = 1,
}

export interface Author {
  id: string;
  username: string;
  displayName: string;
  profileImageUrl: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  publishedAt: string;
  postType: PostType;
  state: PostState;
  userId: string;
  authorId: string;
  author: Author;
  communityId: string;
  communityName: string;
  tags: TagResponse[];
  attachments: Attachment[];
  comments: CommentResponse[];
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
}