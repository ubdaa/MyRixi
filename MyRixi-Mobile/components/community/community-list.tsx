import React from 'react';
import { FlatList, RefreshControl, StyleSheet, View, Text } from 'react-native';
import { CommunityCard } from './community-card';
import { Community } from '@/types/community';
import { EmptyCommunitiesList } from './empty-communities-list';

type CommunitiesListProps = {
  communities: Community[];
  refreshing: boolean;
  onRefresh: () => void;
};

export function CommunitiesList({
  communities,
  refreshing,
  onRefresh,
} : CommunitiesListProps) {
  if (communities.length === 0 && !refreshing) {
    return <EmptyCommunitiesList onRefresh={onRefresh} />;
  }

  return (
    <FlatList
      data={communities}
      renderItem={({ item }) => <CommunityCard community={item} />}
      keyExtractor={(item) => item.id}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      contentContainerStyle={styles.content}
      ListEmptyComponent={refreshing ? null : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No communities found</Text>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  content: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});