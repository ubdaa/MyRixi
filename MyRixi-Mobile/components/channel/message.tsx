import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Message as MessageType } from '@/types/message';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

type MessageProps = {
  message: MessageType;
  showAvatar: boolean;
};

export function Message({ message, showAvatar }: MessageProps) {
  const formattedTime = format(new Date(message.sentAt), 'HH:mm', { locale: fr });
  const formattedDate = format(new Date(message.sentAt), 'dd MMMM yyyy', { locale: fr });
  
  return (
    <View style={[styles.container, !showAvatar && styles.continuedMessage]}>
      {showAvatar && (
        <Image 
          source={{ uri: message.sender?.avatar || 'https://via.placeholder.com/40' }} 
          style={styles.avatar} 
        />
      )}
      
      <View style={[styles.messageContent, !showAvatar && styles.continuedMessageContent]}>
        {showAvatar && (
          <View style={styles.header}>
            <Text style={styles.username}>{message.sender?.userName}</Text>
            <Text style={styles.date}>{formattedDate}</Text>
          </View>
        )}
        
        <View style={styles.bubbleContainer}>
          <View style={styles.bubble}>
            <Text style={styles.messageText}>{message.content}</Text>
          </View>
          <Text style={styles.time}>{formattedTime}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  continuedMessage: {
    marginBottom: 4,
    marginLeft: 46, // To align with the first message that has an avatar
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  messageContent: {
    flex: 1,
  },
  continuedMessageContent: {
    marginTop: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#fff',
    marginRight: 8,
  },
  date: {
    fontSize: 12,
    color: '#a3a6aa',
  },
  bubbleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  bubble: {
    flex: 1,
  },
  messageText: {
    color: '#dcddde',
    fontSize: 15,
  },
  time: {
    fontSize: 10,
    color: '#a3a6aa',
    marginLeft: 6,
  },
});