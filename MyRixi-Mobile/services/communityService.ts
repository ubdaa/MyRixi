import { Community } from '@/types/community';
import { apiGetRequest, apiPostRequest, apiDeleteRequest } from './api';

export const fetchUserCommunities = async (): Promise<Community[]> => {
  try {
    return await apiGetRequest<Community[]>('/feed/communities', {});
  } catch (error) {
    console.error('Failed to fetch communities:', error);
    throw error;
  }
};

export const fetchCommunityById = async (communityId: string): Promise<Community> => {
  try {
    return await apiGetRequest<Community>(`/community/${communityId}`, {});
  } catch (error) {
    console.error('Failed to fetch community:', error);
    throw error;
  }
}

export const createCommunity = async (communityData: FormData): Promise<Community> => {
  try {
    return await apiPostRequest<Community>('/community', communityData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  } catch (error) {
    console.error('Failed to create community:', error);
    throw error;
  }
};

export const joinCommunity = async (communityId: string): Promise<void> => {
  try {
    await apiPostRequest(`/community/${communityId}/join`, new FormData(), {});
  } catch (error) {
    console.error('Failed to join community:', error);
    throw error;
  }
};

export const leaveCommunity = async (communityId: string): Promise<void> => {
  try {
    await apiDeleteRequest(`/community/${communityId}/leave`, {});
  } catch (error) {
    console.error('Failed to leave community:', error);
    throw error;
  }
};