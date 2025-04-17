import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Keyboard, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { BlurView } from 'expo-blur';
import { GlassInput } from '@/components/ui/GlassInput';

type MessageInputProps = {
  channelId: string;
  onSend: (content: string, channelId: string) => Promise<boolean>;
  disabled?: boolean;
};

export function MessageInput({ channelId, onSend, disabled }: MessageInputProps) {
  const { theme, colorMode } = useTheme();
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (message.trim() === '' || sending) return;
    
    Keyboard.dismiss();
    setSending(true);
    
    try {
      const success = await onSend(message.trim(), channelId);
      if (success) {
        setMessage('');
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
    } finally {
      setSending(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background2 }]}>
      <BlurView
        intensity={theme.glassmorphism.blur / 2}
        tint={colorMode === 'dark' ? 'dark' : 'light'}
        style={styles.blurBackground}
      >
        <View style={styles.inputWrapper}>
          {/* Bouton pour les emojis */}
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons 
              name="add-circle-outline" 
              size={24} 
              color={theme.colors.textSecondary} 
            />
          </TouchableOpacity>

          <View style={[styles.inputContainer, { 
            backgroundColor: colorMode === 'dark' 
              ? 'rgba(40, 40, 45, 0.7)' 
              : 'rgba(240, 240, 245, 0.7)',
            borderColor: theme.colors.divider
          }]}>
            <TextInput
              style={[styles.input, { color: theme.colors.textPrimary }]}
              value={message}
              onChangeText={setMessage}
              placeholder="Envoyer un message..."
              placeholderTextColor={theme.colors.textSecondary}
              multiline
              maxLength={2000}
              editable={!disabled}
              underlineColorAndroid="transparent"
            />
          </View>
          
          <TouchableOpacity 
            style={[
              styles.sendButton, 
              (message.trim() === '' || sending || disabled) 
                ? { backgroundColor: theme.colors.divider } 
                : { backgroundColor: theme.colors.technoBlue }
            ]}
            onPress={handleSend}
            disabled={message.trim() === '' || sending || disabled}
          >
            <Ionicons 
              name="send" 
              size={18} 
              color={colorMode === 'dark' ? '#fff' : '#fff'} 
            />
          </TouchableOpacity>
        </View>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(80, 80, 80, 0.2)',
  },
  blurBackground: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  iconButton: {
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    flex: 1,
    borderRadius: 20,
    marginHorizontal: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 120,
    borderWidth: 1,
  },
  input: {
    fontSize: 16,
    lineHeight: 20,
    paddingTop: 0,
    paddingBottom: 0,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

