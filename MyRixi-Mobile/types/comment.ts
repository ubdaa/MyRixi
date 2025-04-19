export interface Comment {
  id: string;
  content: string;
  postedAt: string;
  parentCommentId?: string;
  postId?: string;
  profileId: string;
  profileDisplayName: string;
  profilePictureUrl: string;
  repliesCount: number;
  isOwner: boolean;
}