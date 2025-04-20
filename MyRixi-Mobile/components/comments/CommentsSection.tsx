import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, FlatList, TouchableOpacity } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import CommentInput from './CommentInput';
import EmptyCommentsPlaceholder from './EmptyCommentsPlaceholder';
import { useComments } from '@/hooks/useComments';
import CommentItem from './CommentItem';

interface CommentsSectionProps {
  postId?: string;
  profileId?: string;
  nestedScrollEnabled?: boolean; // New prop to indicate if nested in ScrollView
}

export default function CommentsSection({ postId, profileId, nestedScrollEnabled = false }: CommentsSectionProps) {
  const { theme } = useTheme();
  const [commentText, setCommentText] = useState('');
  
  const {
    comments,
    loading,
    error,
    hasMore,
    totalCount,
    loadMore,
    addComment
  } = useComments({
    postId,
    profileId,
    autoLoad: true
  });

  const handleSend = async () => {
    if (commentText.trim()) {
      try {
        await addComment(commentText);
        setCommentText('');
      } catch (error) {
        console.error('Error sending comment:', error);
        // You could show an error message to the user here
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={'height'}
      keyboardVerticalOffset={0}
      style={styles.keyboardAvoidingView}
    >
      <View style={[styles.commentsSection, { backgroundColor: theme.colors.background2 }]}>
        <Text style={[styles.commentsTitle, { color: theme.colors.textPrimary }]}>
          Commentaires ({totalCount})
        </Text>
        
        <CommentInput
          value={commentText}
          onChangeText={setCommentText}
          onSend={handleSend}
        />
        
        {loading && comments.length === 0 ? (
          <Text style={{ color: theme.colors.textSecondary, textAlign: 'center' }}>Chargement...</Text>
        ) : error ? (
          <Text style={{ color: theme.colors.neoRed, textAlign: 'center' }}>Erreur: {error}</Text>
        ) : comments.length === 0 ? (
          <EmptyCommentsPlaceholder />
        ) : nestedScrollEnabled ? (
          // Use regular View instead of FlatList when nested in ScrollView
          <View>
            {comments.map(item => (
              <CommentItem key={item.id} comment={item} />
            ))}
            {hasMore && (
              <TouchableOpacity onPress={loadMore} style={styles.loadMoreButton}>
                <Text style={{ color: theme.colors.technoBlue, textAlign: 'center' }}>
                  Charger plus de commentaires
                </Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <FlatList
            data={comments}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <CommentItem comment={item} />
            )}
            onEndReached={hasMore ? loadMore : undefined}
            onEndReachedThreshold={0.5}
          />
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
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
  loadMoreButton: {
    padding: 10,
    marginVertical: 8,
  }
});