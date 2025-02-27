import { Profile } from "@/types/profile";
import { apiGetRequest } from "./api";

export const fetchUserProfile = async (): Promise<Profile> => {
  try {
    return await apiGetRequest<Profile>(`/profile/user`, {});
  } catch (error) {
    console.error('Failed to fetch user profile:', error);
    throw error;
  }
};