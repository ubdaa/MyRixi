import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type MessageInputProps = {
  channelId: string;
  onSend: (content: string, channelId: string) => Promise<boolean>;
};

export function MessageInput({ channelId, onSend }: MessageInputProps) {
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
      console.error('Failed to send message:', error);
    } finally {
      setSending(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.iconButton}>
        <Ionicons name="add-circle-outline" size={24} color="#b9bbbe" />
      </TouchableOpacity>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Envoyer un message..."
          placeholderTextColor="#72767d"
          multiline
          maxLength={2000}
        />
      </View>
      
      <TouchableOpacity 
        style={[styles.sendButton, message.trim() === '' && styles.sendButtonDisabled]}
        onPress={handleSend}
        disabled={message.trim() === '' || sending}
      >
        <Ionicons 
          name="send" 
          size={20} 
          color={message.trim() === '' ? "#72767d" : "#fff"} 
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fafafa',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  iconButton: {
    padding: 8,
  },
  inputContainer: {
    flex: 1,
    backgroundColor: '#e0e0e0',
    borderRadius: 20,
    marginHorizontal: 8,
    paddingHorizontal: 12,
    paddingVertical: 0,
  },
  input: {
    color: '#424242',
    fontSize: 16,
    maxHeight: 60,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#5865f2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#cfd8dc',
  },
});
