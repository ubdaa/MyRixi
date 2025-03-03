import React, { useRef, useEffect } from 'react';
import { FlatList, StyleSheet, View, Text } from 'react-native';
import { Message as MessageType } from '@/types/message';
import { Message } from './message';

type MessageListProps = {
  messages: MessageType[];
  loading: boolean;
  onLoadMore: () => void;
};

export function MessageList ({ 
  messages,
  loading,
  onLoadMore
}: MessageListProps) {
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (messages.length > 0 && flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: false });
    }
  }, [messages]);

  if (loading && messages.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Chargement des messages...</Text>
      </View>
    );
  }

  if (messages.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Pas encore de messages</Text>
        <Text style={styles.emptySubText}>Soyez le premier à envoyer un message !</Text>
      </View>
    );
  }

  return (
    <FlatList
      ref={flatListRef}
      style={styles.container}
      data={messages}
      keyExtractor={(item) => item.id}
      renderItem={({ item, index }) => (
        <Message 
          message={item} 
          showAvatar={true} 
        />
      )}
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.5}
      inverted={true}
      contentContainerStyle={styles.listContent}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5', 
  },
  listContent: {
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  emptyText: {
    color: '#424242',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptySubText: {
    color: '#757575',
    fontSize: 14,
    textAlign: 'center',
  },
});