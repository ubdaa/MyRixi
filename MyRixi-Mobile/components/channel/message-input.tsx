import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Keyboard, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type MessageInputProps = {
  channelId: string;
  onSend: (content: string, channelId: string) => Promise<boolean>;
  disabled?: boolean;
};

export function MessageInput({ channelId, onSend, disabled }: MessageInputProps) {
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
    <View style={styles.container}>
      {/* Bouton pour les emojis */}
      <TouchableOpacity style={styles.iconButton}>
        <Ionicons name="ellipsis-horizontal-circle-outline" size={28} color="#72767d" />
      </TouchableOpacity>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Envoyer un message..."
          placeholderTextColor="#99aab5"
          multiline
          maxLength={2000}
          editable={!disabled}
          underlineColorAndroid="transparent"
        />
      </View>
      
      <TouchableOpacity 
        style={[styles.sendButton, (message.trim() === '' || sending) && styles.sendButtonDisabled]}
        onPress={handleSend}
        disabled={message.trim() === '' || sending}
      >
        <Ionicons 
          name="send" 
          size={20} 
          color="#fff" 
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#fafafa',
  },
  iconButton: {
    padding: 6,
  },
  inputContainer: {
    flex: 1,
    backgroundColor: '#e0e0e0',
    borderRadius: 20,
    marginHorizontal: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    maxHeight: 120,
  },
  input: {
    color: '#424242',
    fontSize: 16,
    lineHeight: 20,
    paddingTop: 0,
    paddingBottom: 0,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#7289da',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#cfd8dc',
  },
});

