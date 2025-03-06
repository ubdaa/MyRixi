import { apiGetRequest } from './api';
import { Community } from '@/types/community';

/**
 * Fetch discoverable communities with pagination
 */
export const getDiscoverCommunities = async (page: number = 1, size: number = 10): Promise<Community[]> => {
  return await apiGetRequest<Community[]>(`/discover/communities?page=${page}&size=${size}`, {});
};

/**
 * Get details of a specific community
 */
export const getCommunityById = async (communityId: string): Promise<Community> => {
  return await apiGetRequest<Community>(`/community/${communityId}`, {});
};
