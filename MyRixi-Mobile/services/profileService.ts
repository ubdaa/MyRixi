import { Profile, ProfileDto } from "@/types/profile";
import { apiGetRequest } from "./api";

export const fetchProfileById = async (id: string): Promise<ProfileDto> => {
  try {
    return await apiGetRequest<ProfileDto>(`/profile/${id}`, {});
  } catch (error) {
    console.error('Failed to fetch profile:', error);
    throw error;
  }
}

export const fetchUserProfile = async (): Promise<Profile> => {
  try {
    return await apiGetRequest<Profile>(`/profile/user`, {});
  } catch (error) {
    console.error('Failed to fetch user profile:', error);
    throw error;
  }
};

export const fetchUserProfileById = async (userId: string): Promise<Profile> => {
  try {
    return await apiGetRequest<Profile>(`/profile/user/${userId}`, {});
  } catch (error) {
    console.error(`Failed to fetch user profile with ID ${userId}:`, error);
    throw error;
  }
};

export const fetchCommunityProfileById = async (communityId: string): Promise<Profile> => {
  try {
    return await apiGetRequest<Profile>(`/profile/community/${communityId}`, {});
  } catch (error) {
    console.error(`Failed to fetch community profile with ID ${communityId}:`, error);
    throw error;
  }
};

export const determineProfileType = (id: string): 'user' | 'community' => {
  // This is a placeholder implementation. In a real app, you might:
  // - Check the ID format (UUIDs for users vs another format for communities)
  // - Make a lightweight API call to determine the type
  // - Use a prefix in the ID to distinguish types
  
  // For example purposes, we'll assume IDs starting with 'c-' are community profiles
  return id.startsWith('c-') ? 'community' : 'user';
};