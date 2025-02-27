import { Media } from "./media";

export interface UserChannel {
  id: string;
  userName: string;
  avatar: string;
}

export interface Profile {
  id: string;
  displayName: string;
  bio: string;
  joinedAt: Date;
  profilePicture: Media;
  coverPicture: Media;
  user: UserChannel;
}

export interface CommunityProfile extends Profile {
  communityId: string;
}