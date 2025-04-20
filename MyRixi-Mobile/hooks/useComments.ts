import { useState, useCallback, useEffect } from 'react';
import { 
  getPostComments, 
  getProfileComments, 
  getCommentReplies, 
  createPostComment, 
  createProfileComment, 
  updateComment, 
  deleteComment 
} from '@/services/commentService';
import { Comment } from '@/types/comment';

interface CommentsState {
  comments: Comment[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  page: number;
  totalCount: number;
}

interface UseCommentsOptions {
  postId?: string;
  profileId?: string;
  commentId?: string; // For replies
  initialPage?: number;
  pageSize?: number;
  autoLoad?: boolean;
}

export function useComments({
  postId,
  profileId,
  commentId,
  initialPage = 1,
  pageSize = 10,
  autoLoad = true
}: UseCommentsOptions) {
  const [state, setState] = useState<CommentsState>({
    comments: [],
    loading: false,
    error: null,
    hasMore: true,
    page: initialPage,
    totalCount: 0
  });

  const fetchComments = useCallback(async (page: number = initialPage, refresh: boolean = false) => {
    if (!postId && !profileId && !commentId) {
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      let response;
      if (postId) {
        response = await getPostComments(postId, page, pageSize);
      } else if (profileId) {
        response = await getProfileComments(profileId, page, pageSize);
      } else if (commentId) {
        response = await getCommentReplies(commentId, page, pageSize);
      } else {
        throw new Error("Either postId, profileId, or commentId must be provided");
      }

      setState(prev => ({
        comments: refresh ? response.items : [...prev.comments, ...response.items],
        loading: false,
        error: null,
        hasMore: response.page < response.totalPages,
        page: response.page,
        totalCount: response.totalCount
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : "An unknown error occurred"
      }));
    }
  }, [postId, profileId, commentId, pageSize, initialPage]);

  const refresh = useCallback(() => {
    fetchComments(1, true);
  }, [fetchComments]);

  const loadMore = useCallback(() => {
    if (!state.loading && state.hasMore) {
      fetchComments(state.page + 1);
    }
  }, [fetchComments, state.loading, state.hasMore, state.page]);

  const addComment = useCallback(async (content: string, parentCommentId?: string) => {
    if (!content.trim()) {
      throw new Error("Comment cannot be empty");
    }
    
    try {
      if (postId) {
        await createPostComment(postId, content, parentCommentId);
      } else if (profileId) {
        await createProfileComment(profileId, content, parentCommentId);
      } else {
        throw new Error("Either postId or profileId must be provided to add a comment");
      }
      refresh();

      return;
    } catch (error) {
      throw error;
    }
  }, [postId, profileId]);

  const editComment = useCallback(async (commentId: string, content: string) => {
    if (!content.trim()) {
      throw new Error("Comment cannot be empty");
    }
    
    try {
      const updatedComment = await updateComment(commentId, content);
      setState(prev => ({
        ...prev,
        comments: prev.comments.map(comment => 
          comment.id === commentId ? { ...comment, content } : comment
        )
      }));
      return updatedComment;
    } catch (error) {
      throw error;
    }
  }, []);

  const removeComment = useCallback(async (commentId: string) => {
    try {
      await deleteComment(commentId);
      setState(prev => ({
        ...prev,
        comments: prev.comments.filter(comment => comment.id !== commentId),
        totalCount: prev.totalCount - 1
      }));
    } catch (error) {
      throw error;
    }
  }, []);

  useEffect(() => {
    if (autoLoad) {
      fetchComments(initialPage, true);
    }
  }, [fetchComments, autoLoad, initialPage]);

  return {
    comments: state.comments,
    loading: state.loading,
    error: state.error,
    hasMore: state.hasMore,
    totalCount: state.totalCount,
    refresh,
    loadMore,
    addComment,
    editComment,
    removeComment
  };
}