import React, { useRef, useEffect } from 'react';
import { FlatList, StyleSheet, View, Text } from 'react-native';
import { Message as MessageType } from '@/types/message';
import { Message } from './message';
import { useTheme } from '@/contexts/ThemeContext';

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
  const { theme } = useTheme();
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (messages.length > 0 && flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: false });
    }
  }, [messages]);

  if (loading && messages.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: theme.colors.background1 }]}>
        <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
          Chargement des messages...
        </Text>
      </View>
    );
  }

  if (messages.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: theme.colors.background1 }]}>
        <Text style={[styles.emptyText, { color: theme.colors.textPrimary }]}>
          Pas encore de messages
        </Text>
        <Text style={[styles.emptySubText, { color: theme.colors.textSecondary }]}>
          Soyez le premier à envoyer un message !
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      ref={flatListRef}
      style={[styles.container, { backgroundColor: theme.colors.background1 }]}
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
  },
  listContent: {
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    textAlign: 'center',
  },
});