import { apiDeleteRequest, apiGetRequest, apiPostRequest, apiPutRequest } from './api';
import { Post } from '@/types/post';

/*
  * Fetch drafts posts
 */
export const getDrafts = async (communityId: string): Promise<Post[]> => {
  return await apiGetRequest<Post[]>(`/post/community/${communityId}/drafts`, {});
};

/*
  * Create draft
 */
export const createDraft = async (communityId: string): Promise<Post> => {
  return await apiPostRequest<Post>(`/post/community/${communityId}/draft/create`, new FormData(), {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export const addAttachmentToDraft = async (draftId: string, file: File): Promise<Post> => {
  const formData = new FormData();
  formData.append('file', file);
  return await apiPostRequest<Post>(`/post/draft/${draftId}/attachment`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export const removeAttachmentFromDraft = async (draftId: string, attachmentId: string): Promise<Post> => {
  return await apiDeleteRequest<Post>(`/post/draft/${draftId}/attachment/${attachmentId}`, {});
};

export interface TagDto {
  name: string;
}

export interface UpdateDraft {
  title: string;
  content: string;
  tags?: TagDto[];
}

export const getDraft = async (draftId: string): Promise<Post> => {
  return await apiGetRequest<Post>(`/post/draft/${draftId}`, {});
}

export const updateDraft = async (draftId: string, draft: UpdateDraft): Promise<Post> => {
  // Create a FormData object to send the data as multipart/form-data
  const formData = new FormData();
  formData.append('title', draft.title);
  formData.append('content', draft.content);
  if (draft.tags) {
    formData.append('tags', JSON.stringify(draft.tags));
  }
  return await apiPutRequest<Post>(`/post/draft/${draftId}`, formData,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
};

export const publishDraft = async (draftId: string, draft: UpdateDraft): Promise<Post> => {
  const formData = new FormData();
  formData.append('title', draft.title);
  formData.append('content', draft.content);
  if (draft.tags) {
    formData.append('tags', JSON.stringify(draft.tags));
  }
  return await apiPostRequest<Post>(`/post/draft/${draftId}`, formData,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
};