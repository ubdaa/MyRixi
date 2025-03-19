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

interface PostCardProps {
  post: {
    id: string;
    author: string;
    avatar: string;
    time: string;
    content: string;
    likes: number;
    comments: number;
  };
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { theme, colorMode } = useTheme();
  const [liked, setLiked] = useState(false);
  
  // Animation pour le cœur
  const heartScale = useRef(new Animated.Value(1)).current;
  
  const handleLike = () => {
    setLiked(!liked);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    if (!liked) {
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

  return (
    <GlassCard style={styles.postCard}>
      <View style={styles.postHeader}>
        <View style={styles.postAuthor}>
          <Image source={{ uri: post.avatar }} style={styles.avatar} />
          <View>
            <Text style={[styles.authorName, { color: theme.colors.textPrimary }]}>
              {post.author}
            </Text>
            <Text style={[styles.postTime, { color: theme.colors.textSecondary }]}>
              {post.time}
            </Text>
          </View>
        </View>
        
        <TouchableOpacity>
          <Ionicons
            name="ellipsis-horizontal"
            size={20}
            color={theme.colors.textSecondary}
          />
        </TouchableOpacity>
      </View>
      
      <Text style={[styles.postContent, { color: theme.colors.textPrimary }]}>
        {post.content}
      </Text>
      
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
            {post.likes + (liked ? 1 : 0)}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons
            name="chatbubble-outline"
            size={20}
            color={theme.colors.textSecondary}
          />
          <Text style={[styles.actionText, { color: theme.colors.textSecondary }]}>
            {post.comments}
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
