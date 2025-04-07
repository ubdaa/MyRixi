import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { GlassCard } from '@/components/ui/GlassCard';
import { Post } from '@/types/post';
import { router } from 'expo-router';
import { PostHeader } from '@/components/post/PostHeader';
import { PostContent } from '@/components/post/PostContent';
import { PostActions } from '@/components/post/PostActions';

interface PostCardProps {
  post: Post;
  showCommunityText?: boolean;
}

export function PostCard({ post, showCommunityText = false }: PostCardProps) {
  const { theme } = useTheme();
  
  const navigateToPost = () => {
    router.push(`/post/${post.id}/page`);
  };
  
  const navigateToProfile = () => {
    router.push(`/profile/${post.author.id}/page`);
  };

  const navigateToCommunity = () => {
    router.push(`/community/${post.communityId}/feed`);
  };

  return (
    <GlassCard style={styles.postCard}>
      <TouchableOpacity activeOpacity={0.9} onPress={navigateToPost}>
        {showCommunityText && (
          <TouchableOpacity onPress={navigateToCommunity}>
            <Text style={[styles.communityTitle, { color: theme.colors.textSecondary }]}>
              <Ionicons name="chevron-forward" size={10} color={theme.colors.textSecondary} /> Posté dans {post.communityName}
            </Text>
          </TouchableOpacity>
        )}

        <PostHeader
          author={post.author}
          publishedAt={post.publishedAt}
          onAuthorPress={navigateToProfile}
          compact={true}
        />

        <PostContent
          title={post.title}
          content={post.content}
          attachments={post.attachments}
          tags={post.tags}
          compact={true}
        />
      </TouchableOpacity>
      
      <PostActions
        initialLikesCount={post.likesCount}
        initialLikedState={post.isLiked}
        commentsCount={post.commentsCount}
        onCommentPress={navigateToPost}
      />
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  postCard: {
    marginBottom: 16,
  },
  communityTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
});