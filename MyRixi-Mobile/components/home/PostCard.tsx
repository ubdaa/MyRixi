import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/contexts/ThemeContext';
import { GlassCard } from '@/components/ui/GlassCard';
import { Post } from '@/types/post';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { router } from 'expo-router';

interface PostCardProps {
  post: Post;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { theme } = useTheme();
  const [liked, setLiked] = useState(post.isLiked);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  
  // Animation pour le cœur
  const heartScale = useRef(new Animated.Value(1)).current;
  
  const handleLike = () => {
    const newLikedState = !liked;
    setLiked(newLikedState);
    setLikesCount(likesCount + (newLikedState ? 1 : -1));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    if (newLikedState) {
      Animated.sequence([
        Animated.timing(heartScale, {
          toValue: 1.3,
          duration: 200,
          useNativeDriver: true
        }),
        Animated.timing(heartScale, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true
        })
      ]).start();
    }
  };

  const navigateToPost = () => {
    router.push(`/post/${post.id}/page`);
  };
  
  const navigateToProfile = () => {
    router.push(`/profile/${post.author.id}/page`);
  };

  const formatPublishedDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'dd MMM · HH:mm', { locale: fr });
    } catch (error) {
      return "Date inconnue";
    }
  };

  return (
    <GlassCard style={styles.postCard}>
      <TouchableOpacity activeOpacity={0.9} onPress={navigateToPost}>
        <View style={styles.postHeader}>
          <TouchableOpacity style={styles.postAuthor} onPress={navigateToProfile}>
            <Image 
              source={{ uri: post.author.profileImageUrl }} 
              style={styles.avatar}
              defaultSource={require('@/assets/images/default-avatar.png')}
            />
            <View>
              <Text style={[styles.authorName, { color: theme.colors.textPrimary }]}>
                {post.author.displayName}
              </Text>
              <Text style={[styles.postTime, { color: theme.colors.textSecondary }]}>
                {formatPublishedDate(post.publishedAt)}
              </Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity>
            <Ionicons
              name="ellipsis-horizontal"
              size={20}
              color={theme.colors.textSecondary}
            />
          </TouchableOpacity>
        </View>
        
        {post.title && (
          <Text style={[styles.postTitle, { color: theme.colors.textPrimary }]}>
            {post.title}
          </Text>
        )}
        
        <Text style={[styles.postContent, { color: theme.colors.textPrimary }]}>
          {post.content}
        </Text>
      </TouchableOpacity>
      
      <View style={[styles.postActions, { borderTopColor: theme.colors.divider }]}>
        <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
          <Animated.View style={{ transform: [{ scale: heartScale }] }}>
            <Ionicons
              name={liked ? "heart" : "heart-outline"}
              size={22}
              color={liked ? theme.colors.cyberPink : theme.colors.textSecondary}
            />
          </Animated.View>
          <Text style={[styles.actionText, { 
            color: liked ? theme.colors.cyberPink : theme.colors.textSecondary
          }]}>
            {likesCount}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={navigateToPost}>
          <Ionicons
            name="chatbubble-outline"
            size={20}
            color={theme.colors.textSecondary}
          />
          <Text style={[styles.actionText, { color: theme.colors.textSecondary }]}>
            {post.commentsCount}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons
            name="share-social-outline"
            size={20}
            color={theme.colors.textSecondary}
          />
        </TouchableOpacity>
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  postCard: {
    marginBottom: 16,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  postAuthor: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  authorName: {
    fontWeight: '600',
    fontSize: 15,
  },
  postTime: {
    fontSize: 12,
  },
  postTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 8,
  },
  postContent: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 12,
  },
  postActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  actionText: {
    marginLeft: 6,
    fontSize: 13,
    fontWeight: '500',
  },
});