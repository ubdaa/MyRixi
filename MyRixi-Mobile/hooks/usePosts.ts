import { getDrafts, createDraft } from "@/services/postService";
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
    createDraft: handleCreateDraft
  };
}

