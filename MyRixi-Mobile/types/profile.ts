import { Media } from "./media";

export interface ProfileDto {
  id: string;
  displayName: string;
  bio: string;
  createdAt: string;
  profilePicture: Media;
  coverPicture: Media;
  backgroundColor: string;
  accentColor: string;
  isPublic: boolean;
  allowDirectMessages: boolean;
  
  // User profile specific
  personalWebsite?: string;
  twitterHandle?: string;
  linkedInProfile?: string;
  
  // Community profile specific
  communityId?: string;
  communityName?: string;
  pseudonym?: string;
  joinStatus?: string;
  joinedAt?: string;
  isSuspended?: boolean;
  suspendedUntil?: string;
  roles?: string[];
  
  // Statistics
  followersCount: number;
  followingCount: number;
  totalLikes: number;
  postsCount: number;
  commentsCount: number;
  
  // Profile type
  profileType: 'user' | 'community';
  
  // User info
  userId: string;
  username: string;
  isVerified: boolean;
  
  // Relationship flags
  isOwner: boolean;
  isFollowing: boolean;
  isMember: boolean;
}

// Keep old interfaces for backward compatibility if needed
export interface Profile {
  id: string;
  displayName: string;
  bio: string;
  joinedAt: Date;
  profilePicture: Media;
  coverPicture: Media;
  user: UserChannel;
  verified: boolean;
}

export interface UserChannel {
  id: string;
  userName: string;
  avatar: string;
}

export interface CommunityProfile extends Profile {
  communityId: string;
}