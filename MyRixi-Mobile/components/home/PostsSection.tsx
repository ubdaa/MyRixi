import React from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, Text } from 'react-native';
import { SectionHeader } from './SectionHeader';
import { PostCard } from './PostCard';
import { Post } from '@/types/post';
import { useTheme } from '@/contexts/ThemeContext';

interface PostsSectionProps {
  posts: Post[];
  loading: boolean;
  title?: string;
  loadMore?: () => void;
  refreshing?: boolean;
  onRefresh?: () => void;
  emptyMessage?: string;
}

export const PostsSection: React.FC<PostsSectionProps> = ({
  posts,
  loading,
  title = "Fil d'actualité",
  loadMore,
  refreshing = false,
  onRefresh,
  emptyMessage = "Aucun post à afficher"
}) => {
  const { theme } = useTheme();
  
  if (loading && posts.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.cyberPink} />
      </View>
    );
  }

  return (
    <View style={styles.sectionContainer}>
      <SectionHeader title={title} />
      
      {posts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={{ color: theme.colors.textSecondary }}>{emptyMessage}</Text>
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <PostCard post={item} />}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          refreshing={refreshing}
          onRefresh={onRefresh}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  }
});