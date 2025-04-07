import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Author {
  id: string;
  displayName: string;
  profileImageUrl: string;
}

interface PostHeaderProps {
  author: Author;
  publishedAt: string;
  onAuthorPress?: () => void;
  onOptionsPress?: () => void;
  showOptions?: boolean;
  compact?: boolean;
}

export function PostHeader({ 
  author, 
  publishedAt, 
  onAuthorPress,
  onOptionsPress = () => {},
  showOptions = true,
  compact = false
}: PostHeaderProps) {
  const { theme } = useTheme();

  const formatPublishedDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(
        date, 
        compact ? 'dd MMM · HH:mm' : 'dd MMMM yyyy · HH:mm', 
        { locale: fr }
      );
    } catch (error) {
      return "Date inconnue";
    }
  };

  return (
    <View style={styles.postHeader}>
      <TouchableOpacity 
        style={styles.authorContainer} 
        onPress={onAuthorPress}
      >
        <Image 
          source={{ uri: author.profileImageUrl }} 
          style={[styles.avatar, compact ? styles.avatarCompact : {}]}
          defaultSource={require('@/assets/images/default-avatar.jpg')}
        />
        <View>
          <Text style={[
            styles.authorName, 
            { color: theme.colors.textPrimary },
            compact ? styles.authorNameCompact : {}
          ]}>
            {author.displayName}
          </Text>
          <Text style={[
            styles.postDate, 
            { color: theme.colors.textSecondary },
            compact ? styles.postDateCompact : {}
          ]}>
            {formatPublishedDate(publishedAt)}
          </Text>
        </View>
      </TouchableOpacity>
      
      {showOptions && (
        <TouchableOpacity onPress={onOptionsPress}>
          <Ionicons
            name="ellipsis-horizontal"
            size={compact ? 20 : 24}
            color={theme.colors.textSecondary}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
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
  avatarCompact: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '600',
  },
  authorNameCompact: {
    fontSize: 15,
  },
  postDate: {
    fontSize: 12,
    marginTop: 2,
  },
  postDateCompact: {
    marginTop: 0,
  },
});
