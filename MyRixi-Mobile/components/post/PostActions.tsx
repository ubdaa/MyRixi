import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/contexts/ThemeContext';

interface PostActionsProps {
  initialLikesCount: number;
  initialLikedState: boolean;
  commentsCount: number;
  onCommentPress?: () => void;
  onLikePress?: (isLiked: boolean) => void;
  onSharePress?: () => void;
  showShareLabel?: boolean;
  showDivider?: boolean;
}

export function PostActions({
  initialLikesCount,
  initialLikedState,
  commentsCount,
  onCommentPress,
  onLikePress,
  onSharePress,
  showShareLabel = false,
  showDivider = true,
}: PostActionsProps) {
  const { theme } = useTheme();
  const [liked, setLiked] = useState(initialLikedState);
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  
  // Animation for heart icon
  const heartScale = useRef(new Animated.Value(1)).current;

  const handleLike = () => {
    const newLikedState = !liked;
    setLiked(newLikedState);
    setLikesCount(likesCount + (newLikedState ? 1 : -1));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    if (onLikePress) {
      onLikePress(newLikedState);
    }
    
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

  return (
    <View 
      style={[
        styles.actionsContainer, 
        showDivider && { borderTopWidth: 1, borderTopColor: theme.colors.divider }
      ]}
    >
      <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
        <Animated.View style={{ transform: [{ scale: heartScale }] }}>
          <Ionicons
            name={liked ? "heart" : "heart-outline"}
            size={22}
            color={liked ? theme.colors.cyberPink : theme.colors.textSecondary}
          />
        </Animated.View>
        <Text style={[
          styles.actionText, 
          { color: liked ? theme.colors.cyberPink : theme.colors.textSecondary }
        ]}>
          {likesCount}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.actionButton} 
        onPress={onCommentPress}
      >
        <Ionicons
          name="chatbubble-outline"
          size={20}
          color={theme.colors.textSecondary}
        />
        <Text style={[styles.actionText, { color: theme.colors.textSecondary }]}>
          {commentsCount}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.actionButton} onPress={onSharePress}>
        <Ionicons
          name="share-social-outline"
          size={20}
          color={theme.colors.textSecondary}
        />
        {showShareLabel && (
          <Text style={[styles.actionText, { color: theme.colors.textSecondary }]}>
            Partager
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  actionsContainer: {
    flexDirection: 'row',
    paddingTop: 12,
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
});
