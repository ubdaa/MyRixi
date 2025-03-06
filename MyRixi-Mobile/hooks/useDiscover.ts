import { useState, useCallback } from 'react';
import { getDiscoverCommunities, getCommunityById } from '@/services/discoverService';
import { Community } from '@/types/community';

export const useDiscover = () => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const fetchCommunities = useCallback(async (refresh: boolean = false) => {
    if (refresh) {
      setPage(1);
      setHasMore(true);
    }
    
    if (!hasMore && !refresh) return;
    
    const currentPage = refresh ? 1 : page;
    setLoading(true);
    setError(null);

    try {
      const newCommunities = await getDiscoverCommunities(currentPage);
      
      if (newCommunities.length === 0) {
        setHasMore(false);
      } else {
        if (refresh) {
          setCommunities(newCommunities);
        } else {
          setCommunities(prev => [...prev, ...newCommunities]);
        }
        setPage(currentPage + 1);
      }
    } catch (err) {
      setError('Failed to fetch communities');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, hasMore]);

  const fetchCommunityDetails = useCallback(async (communityId: string) => {
    setLoading(true);
    setError(null);

    try {
      const community = await getCommunityById(communityId);
      setSelectedCommunity(community);
      return community;
    } catch (err) {
      setError('Failed to fetch community details');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    communities,
    selectedCommunity,
    loading,
    error,
    hasMore,
    fetchCommunities,
    fetchCommunityDetails
  };
};

export default useDiscover;
