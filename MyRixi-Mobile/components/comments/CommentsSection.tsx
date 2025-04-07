import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import CommentInput from './CommentInput';
import EmptyCommentsPlaceholder from './EmptyCommentsPlaceholder';

interface CommentsSectionProps {
  commentsCount: number;
  onSendComment: (text: string) => void;
}

export default function CommentsSection({ commentsCount, onSendComment }: CommentsSectionProps) {
  const { theme } = useTheme();
  const [commentText, setCommentText] = useState('');

  const handleSend = () => {
    if (commentText.trim()) {
      onSendComment(commentText);
      setCommentText('');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
      style={styles.keyboardAvoidingView}
    >
      <View style={[styles.commentsSection, { backgroundColor: theme.colors.background2 }]}>
        <Text style={[styles.commentsTitle, { color: theme.colors.textPrimary }]}>
          Commentaires ({commentsCount})
        </Text>
        
        <CommentInput
          value={commentText}
          onChangeText={setCommentText}
          onSend={handleSend}
        />
        
        {commentsCount === 0 && <EmptyCommentsPlaceholder />}
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
});
