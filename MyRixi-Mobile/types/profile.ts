import { Media } from "./media";

export interface UserChannel {
  id: string;
  userName: string;
  avatar: string;
}

export interface UserProfile {
  id: string;
  displayName: string;
  bio: string;
  profilePicture: Media;
  coverPicture: Media;
}