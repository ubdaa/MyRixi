import { apiGetRequest, apiPostRequest } from './api';
import { Post } from '@/types/post';

/*
  * Fetch drafts posts
 */
export const getDrafts = async (communityId: string): Promise<Post[]> => {
  return await apiGetRequest<Post[]>(`/community/${communityId}/drafts`, {});
};

/*
  * Create draft
 */
export const createDraft = async (communityId: string): Promise<Post> => {
  return await apiPostRequest<Post>(`/community/${communityId}/draft/create`, new FormData(), {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}