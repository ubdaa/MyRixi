import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { Comment } from '@/types/comment';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface CommentItemProps {
  comment: Comment;
  onReply?: (comment: Comment) => void;
  onEdit?: (comment: Comment) => void;
  onDelete?: (comment: Comment) => void;
}

export default function CommentItem({ comment, onReply, onEdit, onDelete }: CommentItemProps) {
  const { theme } = useTheme();
  
  return (
    <View style={styles.container}>
      <Image 
        source={{ uri: comment.profilePictureUrl || 'https://via.placeholder.com/50' }} 
        style={styles.avatar} 
      />
      
      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={[styles.name, { color: theme.colors.textPrimary }]}>
            {comment.profileDisplayName}
          </Text>
          <Text style={[styles.time, { color: theme.colors.textSecondary }]}>
            {formatDistanceToNow(new Date(comment.postedAt), { locale: fr, addSuffix: true })}
          </Text>
        </View>
        
        <Text style={[styles.content, { color: theme.colors.textPrimary }]}>
          {comment.content}
        </Text>
        
        <View style={styles.actions}>
          {onReply && (
            <TouchableOpacity 
              style={styles.action}
              onPress={() => onReply(comment)}
            >
              <Ionicons name="return-down-forward" size={18} color={theme.colors.textSecondary} />
              <Text style={[styles.actionText, { color: theme.colors.textSecondary }]}>
                Répondre
              </Text>
            </TouchableOpacity>
          )}
          
          {comment.repliesCount > 0 && (
            <TouchableOpacity style={styles.action}>
              <Text style={[styles.actionText, { color: theme.colors.textSecondary }]}>
                Voir les réponses ({comment.repliesCount})
              </Text>
            </TouchableOpacity>
          )}
          
          {comment.isOwner && onEdit && (
            <TouchableOpacity 
              style={styles.action}
              onPress={() => onEdit(comment)}
            >
              <Ionicons name="pencil" size={16} color={theme.colors.textSecondary} />
              <Text style={[styles.actionText, { color: theme.colors.textSecondary }]}>
                Modifier
              </Text>
            </TouchableOpacity>
          )}
          
          {comment.isOwner && onDelete && (
            <TouchableOpacity 
              style={styles.action}
              onPress={() => onDelete(comment)}
            >
              <Ionicons name="trash" size={16} color={theme.colors.neoRed} />
              <Text style={[styles.actionText, { color: theme.colors.neoRed }]}>
                Supprimer
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontWeight: '600',
    fontSize: 14,
    marginRight: 8,
  },
  time: {
    fontSize: 12,
  },
  content: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    paddingVertical: 4,
  },
  actionText: {
    fontSize: 12,
    marginLeft: 4,
  },
});