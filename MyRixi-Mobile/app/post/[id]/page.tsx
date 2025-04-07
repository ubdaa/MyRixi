import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { GlassInput } from '@/components/ui/GlassInput';
import { fetchPostById } from '@/services/postService';
import { Post } from '@/types/post';
import { PostHeader } from '@/components/post/PostHeader';
import { PostContent } from '@/components/post/PostContent';
import { PostActions } from '@/components/post/PostActions';
import CommentsSection from '@/components/comments/CommentsSection';

export default function PostPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useTheme();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadPost = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const postData = await fetchPostById(id);
        setPost(postData);
      } catch (err) {
        console.error('Failed to load post:', err);
        setError('Failed to load the post. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [id]);

  const navigateToProfile = (authorId: string) => {
    router.push(`/profile/${authorId}/page`);
  };

  const navigateToCommunity = (communityId: string) => {
    router.push(`/community/${communityId}/feed`);
  };

  const handleSendComment = (text: string) => {
    // Ici, vous pouvez implémenter la logique d'envoi de commentaire
    console.log('Sending comment:', text);
    // Exemple: postComment(id, text);
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background1 }]}>
        <ActivityIndicator size="large" color={theme.colors.cyberPink} />
      </SafeAreaView>
    );
  }

  if (error || !post) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background1 }]}>
        <View style={[styles.errorContainer, { backgroundColor: theme.colors.background2 }]}>
          <Ionicons name="alert-circle-outline" size={48} color={theme.colors.neoRed} />
          <Text style={[styles.errorText, { color: theme.colors.textPrimary }]}>
            {error || "Post not found"}
          </Text>
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: theme.colors.technoBlue }]}
            onPress={() => router.back()}
          >
            <Text style={styles.buttonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background1 }]}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={[styles.postContainer, { backgroundColor: theme.colors.background2 }]}>
          {/* Post Header */}
          <PostHeader 
            author={post.author}
            publishedAt={post.publishedAt}
            onAuthorPress={() => navigateToProfile(post.author.id)}
          />

          {/* Post Content */}
          <PostContent
            title={post.title}
            content={post.content}
            attachments={post.attachments}
            tags={post.tags}
          />

          {/* Action Buttons */}
          <PostActions
            initialLikesCount={post.likesCount}
            initialLikedState={post.isLiked}
            commentsCount={post.commentsCount}
            showShareLabel={true}
          />
        </View>

        {/* Comments Section */}
        <CommentsSection 
          commentsCount={post.commentsCount}
          onSendComment={handleSendComment}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 12,
  },
  postContainer: {
    marginTop: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderRadius: 12,
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    margin: 16,
    borderRadius: 12,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 16,
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
});
