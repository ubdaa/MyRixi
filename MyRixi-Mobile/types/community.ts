export interface CommunityRule {
  id: string;
  title: string;
  description: string;
  order: number;
}

export interface CommunityProfile {
  id: string;
  pseudonym: string;
  role: string;
  description: string;
  isSuspended: boolean;
  isBanned: boolean;
  joinStatus: string;
  profilePictureUrl: string;
  coverPictureUrl: string;
  userId: string;
  userName: string;
  communityId: string;
  communityName: string;
  commentsCount: number;
}

export interface Community {
  id: string;
  name: string;
  description: string;
  isPrivate: boolean;
  iconUrl: string;
  coverUrl: string;
  rules: CommunityRule[];
  profile: CommunityProfile;
}