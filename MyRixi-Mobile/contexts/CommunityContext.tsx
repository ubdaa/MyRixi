// /contexts/CommunityContext.tsx

import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { Community } from '@/types/community';
import * as communityService from '@/services/communityService';

export interface CommunityContextType {
  communities: Community[];
  loading: boolean;
  error: string | null;
  fetchCommunities: () => Promise<void>;
  createCommunity: (communityData: FormData) => Promise<void>;
  joinCommunity: (communityId: string) => Promise<void>;
  leaveCommunity: (communityId: string) => Promise<void>;
}

const CommunityContext = createContext<CommunityContextType | undefined>(undefined);

export const CommunityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCommunities = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await communityService.fetchUserCommunities();
      setCommunities(response);
    } catch (err) {
      setError('Failed to fetch communities');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createCommunity = useCallback(async (communityData: FormData) => {
    setLoading(true);
    setError(null);
    try {
      const newCommunity = await communityService.createCommunity(communityData);
      setCommunities((prev) => [...prev, newCommunity]);
    } catch (err) {
      setError('Failed to create community');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const joinCommunity = useCallback(async (communityId: string) => {
    setLoading(true);
    setError(null);
    try {
      await communityService.joinCommunity(communityId);
      // Après avoir rejoint, rafraîchir la liste
      fetchCommunities();
    } catch (err) {
      setError('Failed to join community');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchCommunities]);

  const leaveCommunity = useCallback(async (communityId: string) => {
    setLoading(true);
    setError(null);
    try {
      await communityService.leaveCommunity(communityId);
      setCommunities((prev) => prev.filter((community) => community.id !== communityId));
    } catch (err) {
      setError('Failed to leave community');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    communities,
    loading,
    error,
    fetchCommunities,
    createCommunity,
    joinCommunity,
    leaveCommunity,
  };

  return <CommunityContext.Provider value={value}>{children}</CommunityContext.Provider>;
};

export const useCommunity = (): CommunityContextType => {
  const context = useContext(CommunityContext);
  if (context === undefined) {
    throw new Error('useCommunity must be used within a CommunityProvider');
  }
  return context;
};