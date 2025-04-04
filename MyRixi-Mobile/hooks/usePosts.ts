import { getDrafts, createDraft, addAttachmentToDraft, removeAttachmentFromDraft, getDraft, updateDraft, publishDraft, UpdateDraft, ReactNativeFile } from "@/services/postService";
import { useEffect, useState } from "react";
import { Post } from "@/types/post";
import { useLocalSearchParams } from "expo-router";

export function usePosts() {
  const [drafts, setDrafts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { communityId } = useLocalSearchParams<{ communityId: string }>();

  // Fonction pour charger les brouillons
  const loadDrafts = async () => {
    if (!communityId) return;
    
    try {
      setLoading(true);
      setError(null);
      const draftPosts = await getDrafts(communityId);
      setDrafts(draftPosts);
    } catch (err) {
      setError('Error loading drafts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadDraft = async (draftId: string) => {
    try {
      setLoading(true);
      setError(null);
      const draftPost = await getDraft(draftId);
      return draftPost;
    } catch (err) {
      setError('Error loading draft');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }

  // Fonction pour créer un nouveau brouillon
  const handleCreateDraft = async () => {
    if (!communityId) return null;
    
    try {
      setLoading(true);
      setError(null);
      const newDraft = await createDraft(communityId);
      setDrafts(prev => [...prev, newDraft]);
      return newDraft;
    } catch (err) {
      setError('Error creating draft');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour ajouter une pièce jointe à un brouillon
  const handleAddAttachment = async (draftId: string, file: ReactNativeFile) => {
    try {
      setLoading(true);
      setError(null);
      const updatedDraft = await addAttachmentToDraft(draftId, file);
      setDrafts(prev => prev.map(draft => draft.id === draftId ? updatedDraft : draft));
      return updatedDraft;
    } catch (err) {
      setError('Error adding attachment');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour supprimer une pièce jointe d'un brouillon
  const handleRemoveAttachment = async (draftId: string, attachmentId: string) => {
    try {
      setLoading(true);
      setError(null);
      const updatedDraft = await removeAttachmentFromDraft(draftId, attachmentId);
      setDrafts(prev => prev.map(draft => draft.id === draftId ? updatedDraft : draft));
      return updatedDraft;
    } catch (err) {
      setError('Error removing attachment');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour mettre à jour un brouillon
  const handleUpdateDraft = async (draftId: string, draftData: UpdateDraft) => {
    try {
      setLoading(true);
      setError(null);
      const updatedDraft = await updateDraft(draftId, draftData);
      setDrafts(prev => prev.map(draft => draft.id === draftId ? updatedDraft : draft));
      return updatedDraft;
    } catch (err) {
      setError('Error updating draft');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour publier un brouillon
  const handlePublishDraft = async (draftId: string, draftData: UpdateDraft) => {
    try {
      setLoading(true);
      setError(null);
      const publishedDraft = await publishDraft(draftId, draftData);
      setDrafts(prev => prev.filter(draft => draft.id !== draftId));
      return publishedDraft;
    } catch (err) {
      setError('Error publishing draft');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Chargement initial des brouillons
  useEffect(() => {
    if (communityId) {
      loadDrafts();
    }
  }, [communityId]);

  return {
    drafts,
    loading,
    error,
    refreshDrafts: loadDrafts,
    loadDraftById: loadDraft,
    createDraft: handleCreateDraft,
    addAttachment: handleAddAttachment,
    removeAttachment: handleRemoveAttachment,
    updateDraft: handleUpdateDraft,
    publishDraft: handlePublishDraft
  };
}

