import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Message as MessageType } from '@/types/message';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useTheme } from '@/contexts/ThemeContext';

type MessageProps = {
  message: MessageType;
  showAvatar: boolean;
};

export function Message({ message, showAvatar }: MessageProps) {
  const { theme } = useTheme();
  const formattedTime = format(new Date(message.sentAt), 'HH:mm', { locale: fr });
  const formattedDate = format(new Date(message.sentAt), 'dd MMMM yyyy', { locale: fr });
  
  // Define styles with theme colors
  const themedStyles = StyleSheet.create({
    username: {
      fontWeight: 'bold',
      fontSize: 16,
      color: theme.colors.textPrimary,
      marginRight: 8,
    },
    date: {
      fontSize: 12,
      color: theme.colors.textSecondary,
    },
    messageText: {
      color: theme.colors.textPrimary,
      fontSize: 15,
    },
    time: {
      fontSize: 10,
      color: theme.colors.textSecondary,
      marginLeft: 6,
    },
    bubble: {
      flex: 1,
    },
  });
  
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
            <Text style={themedStyles.username}>{message.sender?.userName}</Text>
            <Text style={themedStyles.date}>{formattedDate}</Text>
          </View>
        )}
        
        <View style={styles.bubbleContainer}>
          <View style={themedStyles.bubble}>
            <Text style={themedStyles.messageText}>{message.content}</Text>
          </View>
          <Text style={themedStyles.time}>{formattedTime}</Text>
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
    marginLeft: 46,
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
  bubbleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
});
