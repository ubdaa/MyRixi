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

// Interface pour les fichiers en React Native
export interface ReactNativeFile {
  uri: string;
  name: string;
  type: string;
}

export const addAttachmentToDraft = async (draftId: string, file: ReactNativeFile): Promise<Post> => {
  const formData = new FormData();
  // @ts-ignore - Le typage de FormData dans React Native est différent
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
  Name: string;
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
  const formData = new FormData();
  formData.append('title', draft.title);
  formData.append('content', draft.content);
  if (draft.tags) {
    formData.append('tags', JSON.stringify(draft.tags));
  }
  return await apiPutRequest<Post>(`/post/draft/${draftId}`, formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
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
        'Content-Type': 'multipart/form-data',
      },
    },
  );
};

export const deleteDraft = async (draftId: string): Promise<void> => {
  return await apiDeleteRequest<void>(`/post/draft/${draftId}`, {});
}