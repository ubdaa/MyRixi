import { Community } from '@/types/community';
import { apiGetRequest, apiPostRequest, apiDeleteRequest } from './api';
import { ProfileDto } from '@/types/profile';

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

export const fetchCommunityMembers = async (
  communityId: string, 
  page: number = 1, 
  size: number = 10,
  searchQuery?: string
): Promise<{
  members: ProfileDto[],
  hasMore: boolean,
  totalCount: number
}> => {
  try {
    let url = `/profile/community/${communityId}/members?page=${page}&size=${size}`;
    if (searchQuery && searchQuery.trim() !== '') {
      url += `&search=${encodeURIComponent(searchQuery.trim())}`;
    }
    
    const response = await apiGetRequest<{
      items: ProfileDto[],
      totalCount: number,
      page: number,
      size: number,
      totalPages: number
    }>(url, {});
    
    return {
      members: response.items,
      hasMore: response.page < response.totalPages,
      totalCount: response.totalCount
    };
  } catch (error) {
    console.error('Failed to fetch community members:', error);
    throw error;
  }
};