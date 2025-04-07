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

export default function PostPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useTheme();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  
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
        <View style={[styles.commentsSection, { backgroundColor: theme.colors.background2 }]}>
          <Text style={[styles.commentsTitle, { color: theme.colors.textPrimary }]}>
            Commentaires ({post.commentsCount})
          </Text>
          
          {/* Comment input using GlassInput */}
          <GlassInput
            placeholder="Écrivez un commentaire..."
            value={commentText}
            onChangeText={setCommentText}
            multiline
            numberOfLines={2}
            accentColor={theme.colors.cyberPink}
            rightIcon={
              <TouchableOpacity 
                style={[styles.sendButton, { backgroundColor: commentText.trim() ? theme.colors.cyberPink : theme.colors.textSecondary + '60' }]} 
                disabled={!commentText.trim()}
              >
                <Ionicons name="send" size={18} color="#fff" />
              </TouchableOpacity>
            }
            containerStyle={styles.commentInputContainer}
          />
          
          {/* Empty comments placeholder */}
          {post.commentsCount === 0 && (
            <View style={styles.emptyCommentsContainer}>
              <Ionicons name="chatbubbles-outline" size={48} color={theme.colors.textSecondary} />
              <Text style={[styles.emptyCommentsText, { color: theme.colors.textSecondary }]}>
                Pas encore de commentaires
              </Text>
              <Text style={[styles.emptyCommentsSubText, { color: theme.colors.textSecondary }]}>
                Soyez le premier à commenter !
              </Text>
            </View>
          )}
        </View>
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
  communityContainer: {
    marginBottom: 16,
  },
  communityText: {
    fontSize: 14,
    fontWeight: '500',
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '600',
  },
  postDate: {
    fontSize: 12,
    marginTop: 2,
  },
  postTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
  },
  postContent: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  imagesContainer: {
    marginBottom: 16,
  },
  imagesContentContainer: {
    paddingRight: 12,
  },
  imageWrapper: {
    marginRight: 8,
  },
  image: {
    width: 280,
    height: 200,
    borderRadius: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 14,
    fontWeight: '500',
  },
  actionsContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingTop: 16,
    marginTop: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  actionText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  commentsSection: {
    padding: 16,
    marginBottom: 40,
    borderRadius: 12,
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  commentInputContainer: {
    marginBottom: 24,
  },
  sendButton: {
    borderRadius: 20,
    padding: 8,
    marginRight: 4,
  },
  emptyCommentsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyCommentsText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
  },
  emptyCommentsSubText: {
    fontSize: 14,
    marginTop: 8,
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
