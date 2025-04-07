import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GlassInput } from '@/components/ui/GlassInput';
import { useTheme } from '@/contexts/ThemeContext';

interface CommentInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
}

export default function CommentInput({ value, onChangeText, onSend }: CommentInputProps) {
  const { theme } = useTheme();
  
  return (
    <GlassInput
      placeholder="Écrivez un commentaire..."
      value={value}
      onChangeText={onChangeText}
      multiline
      numberOfLines={2}
      accentColor={theme.colors.cyberPink}
      rightIcon={
        <TouchableOpacity 
          style={[
            styles.sendButton, 
            { backgroundColor: value.trim() ? theme.colors.cyberPink : theme.colors.textSecondary + '60' }
          ]} 
          disabled={!value.trim()}
          onPress={onSend}
        >
          <Ionicons name="send" size={18} color="#fff" />
        </TouchableOpacity>
      }
      containerStyle={styles.commentInputContainer}
    />
  );
}

const styles = StyleSheet.create({
  commentInputContainer: {
    marginBottom: 24,
  },
  sendButton: {
    borderRadius: 20,
    padding: 8,
    marginRight: 4,
  },
});
