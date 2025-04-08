import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useLocalSearchParams } from 'expo-router';
import { fetchCommunityMembers } from '@/services/communityService';
import { ProfileDto } from '@/types/profile';
import { MembersList } from '@/components/members/MembersList';
import { LoadingIndicator } from '@/components/members/LoadingIndicator';

export default function CommunityMembersScreen() {
  const { theme } = useTheme();
  const { id } = useLocalSearchParams();
  
  const [members, setMembers] = useState<ProfileDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [totalMembers, setTotalMembers] = useState(0);

  const loadMembers = useCallback(async (reset: boolean = false) => {
    if (!id || Array.isArray(id)) return;
    
    if (reset && !isSearching) {
      setLoading(true);
      setPage(1);
      setMembers([]);
    } else {
      setLoadingMore(true);
    }
    
    try {
      const currentPage = reset ? 1 : page;
      const response = await fetchCommunityMembers(id, currentPage, 15, searchQuery);

      console.log('Community Members:', response.members);
      
      if (reset) {
        setMembers(response.members);
      } else {
        setMembers(prev => [...prev, ...response.members]);
      }
      
      setHasMore(response.hasMore);
      setTotalMembers(response.totalCount);
      if (!reset) {
        setPage(prev => prev + 1);
      }
    } catch (error) {
      console.error('Failed to load community members:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  }, [id, page, searchQuery]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadMembers(true);
    setIsSearching(false);
  }, [loadMembers]);

  const handleSearch = useCallback((text: string) => {
    setSearchQuery(text);
    setIsSearching(true);
    setPage(1);
    setMembers([]);
  }, []);

  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      loadMembers();
    }
  }, [loadingMore, hasMore, loadMembers]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadMembers(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchQuery, loadMembers]);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background1 }]}>
      <View style={[styles.container, { backgroundColor: theme.colors.background1 }]}>
        {loading && members.length === 0 ? (
          <LoadingIndicator />
        ) : (
          <MembersList
            members={members}
            searchQuery={searchQuery}
            onSearch={handleSearch}
            totalMembers={totalMembers}
            isLoading={loading}
            loadingMore={loadingMore}
            refreshing={refreshing}
            onRefresh={handleRefresh}
            onLoadMore={loadMore}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
});