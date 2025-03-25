export interface CommentResponse {
  id: string;
  content: string;
  postedAt: string;
  parentCommentId?: string;
  postId?: string;
  profileId?: string;
  profileName?: string; 
  replies: CommentResponse[];
}