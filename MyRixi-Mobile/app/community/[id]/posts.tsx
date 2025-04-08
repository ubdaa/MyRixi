import { useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet, RefreshControl, ScrollView } from 'react-native';
import { useEffect, useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Post } from '@/types/post';
import { fetchCommunityPosts } from '@/services/postService';
import { PostsSection } from '@/components/home/PostsSection';
import { FloatingActionButton } from '@/components/ui/FloatingActionButton';
import { router } from 'expo-router';

export default function CommunityPostsScreen() {
  const { id } = useLocalSearchParams();
  const communityId = Array.isArray(id) ? id[0] : id;
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const pageSize = 10;
  const { theme } = useTheme();

  useEffect(() => {
    if (communityId) {
      loadPosts();
    }
  }, [communityId]);
  
  const loadPosts = async (refresh = false) => {
    try {
      const currentPage = refresh ? 1 : page;
      if (refresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      
      const fetchedPosts = await fetchCommunityPosts(communityId, currentPage, pageSize);
      
      if (refresh) {
        setPosts(fetchedPosts);
      } else {
        setPosts(prev => [...prev, ...fetchedPosts]);
      }
      
      setHasMore(fetchedPosts.length === pageSize);
      
      if (refresh) {
        setPage(2);
      } else {
        setPage(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };
  
  const handleRefresh = () => {
    loadPosts(true);
  };
  
  const loadMorePosts = () => {
    if (hasMore && !loading && !refreshing) {
      loadPosts();
    }
  };

  const navigateToDrafts = () => {
    router.push(`/post/${communityId}/drafts`);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background1 }]}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[theme.colors.cyberPink]}
            tintColor={theme.colors.cyberPink}
          />
        }
      >
        <View style={styles.content}>
          <PostsSection 
            posts={posts} 
            loading={loading} 
            loadMore={loadMorePosts}
            refreshing={refreshing}
            onRefresh={handleRefresh}
            title="Publications récentes"
            emptyMessage="Aucun post dans cette communauté"
            nestedScroll={true}
          />
        </View>
      </ScrollView>

      <FloatingActionButton
        icon="pencil"
        onPress={navigateToDrafts}
        accentColor={theme.colors.cyberPink}
        position="bottomRight"
        style={{ marginBottom: 20 }}
        size="medium"
        withHaptics
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
    paddingBottom: 100,
  },
});