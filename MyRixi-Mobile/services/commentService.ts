import {
  apiGetRequest,
  apiPostRequest,
  apiPutRequest,
  apiDeleteRequest,
} from "./api";
import { Comment } from "@/types/comment";

interface CommentResponse {
  items: Comment[];
  totalCount: number;
  page: number;
  size: number;
  totalPages: number;
}

/*
 * Fetch comments for a post
 */
export const getPostComments = async (
  postId: string,
  page: number = 1,
  size: number = 10
): Promise<CommentResponse> => {
  try {
    return await apiGetRequest<CommentResponse>(
      `/comment/post/${postId}?page=${page}&size=${size}`,
      {}
    );
  } catch (error) {
    console.error("Error fetching post comments:", error);
    throw error;
  }
};

/*
 * Fetch comments for a profile
 */
export const getProfileComments = async (
  profileId: string,
  page: number = 1,
  size: number = 10
): Promise<CommentResponse> => {
  try {
    return await apiGetRequest<CommentResponse>(
      `/comment/profile/${profileId}?page=${page}&size=${size}`,
      {}
    );
  } catch (error) {
    console.error("Error fetching profile comments:", error);
    throw error;
  }
};

/*
 * Fetch replies to a comment
 */
export const getCommentReplies = async (
  commentId: string,
  page: number = 1,
  size: number = 10
): Promise<CommentResponse> => {
  try {
    return await apiGetRequest<CommentResponse>(
      `/comment/${commentId}/replies?page=${page}&size=${size}`,
      {}
    );
  } catch (error) {
    console.error("Error fetching comment replies:", error);
    throw error;
  }
};

/*
 * Create a comment on a post
 */
export const createPostComment = async (
  postId: string,
  content: string,
  parentCommentId?: string
): Promise<Comment> => {
  try {
    const formData = new FormData();
    formData.append("content", content);
    if (parentCommentId) {
      formData.append("parentCommentId", parentCommentId);
    }

    return await apiPostRequest<Comment>(`/comment/post/${postId}`, formData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error creating post comment:", error);
    throw error;
  }
};

/*
 * Create a comment on a profile
 */
export const createProfileComment = async (
  profileId: string,
  content: string,
  parentCommentId?: string
): Promise<Comment> => {
  try {
    const formData = new FormData();
    formData.append("content", content);
    if (parentCommentId) {
      formData.append("parentCommentId", parentCommentId);
    }

    return await apiPostRequest<Comment>(
      `/comment/profile/${profileId}`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error creating profile comment:", error);
    throw error;
  }
};

/*
 * Update a comment
 */
export const updateComment = async (
  commentId: string,
  content: string
): Promise<Comment> => {
  try {
    const formData = new FormData();
    formData.append("content", content);

    return await apiPutRequest<Comment>(`/comment/${commentId}`, formData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error updating comment:", error);
    throw error;
  }
};

/*
 * Delete a comment
 */
export const deleteComment = async (commentId: string): Promise<void> => {
  try {
    return await apiDeleteRequest<void>(`/comment/${commentId}`, {});
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw error;
  }
};
