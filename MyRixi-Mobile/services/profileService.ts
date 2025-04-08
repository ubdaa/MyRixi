import { Profile, ProfileDto } from "@/types/profile";
import { apiGetRequest, apiPutRequest } from "./api";
import { ReactNativeFile } from "./postService";

export const fetchProfileById = async (id: string): Promise<ProfileDto> => {
  try {
    return await apiGetRequest<ProfileDto>(`/profile/${id}`, {});
  } catch (error) {
    console.error('Failed to fetch profile:', error);
    throw error;
  }
}

export const fetchUserProfile = async (): Promise<ProfileDto> => {
  try {
    return await apiGetRequest<ProfileDto>(`/profile/user`, {});
  } catch (error) {
    console.error('Failed to fetch user profile:', error);
    throw error;
  }
};

export const fetchCommunityProfile = async (id: string): Promise<ProfileDto> => {
  try {
    return await apiGetRequest<ProfileDto>(`/profile/community/${id}`, {});
  } catch (error) {
    console.error('Failed to fetch community profile:', error);
    throw error;
  }
}

export const fetchUserProfileById = async (userId: string): Promise<ProfileDto> => {
  try {
    return await apiGetRequest<ProfileDto>(`/profile/user/${userId}`, {});
  } catch (error) {
    console.error(`Failed to fetch user profile with ID ${userId}:`, error);
    throw error;
  }
};

export interface UpdateProfile {
  name: string;
  bio?: string;
  profileFile?: ReactNativeFile;
  coverFile?: ReactNativeFile;
}

export const updateProfile = async (profileId: string, profileData: UpdateProfile): Promise<ProfileDto> => {
  try {
    const formData = new FormData();
    formData.append('name', profileData.name);
    if (profileData.bio) {
      formData.append('bio', profileData.bio);
    }
    if (profileData.profileFile) {
      // @ts-ignore - Le typage de FormData dans React Native est différent
      formData.append('profileFile', profileData.profileFile);
    }
    if (profileData.coverFile) {
      // @ts-ignore - Le typage de FormData dans React Native est différent
      formData.append('coverFile', profileData.coverFile);
    }

    return await apiPutRequest<ProfileDto>(`/profile/${profileId}/edit`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  } catch (error) {
    console.error(`Failed to update user profile with ID ${profileId}:`, error);
    throw error;
  }
}

export const determineProfileType = (id: string): 'user' | 'community' => {
  // This is a placeholder implementation. In a real app, you might:
  // - Check the ID format (UUIDs for users vs another format for communities)
  // - Make a lightweight API call to determine the type
  // - Use a prefix in the ID to distinguish types
  
  // For example purposes, we'll assume IDs starting with 'c-' are community profiles
  return id.startsWith('c-') ? 'community' : 'user';
};