import React from 'react';
import { FlatList, StyleSheet, ActivityIndicator, Text, View } from 'react-native';
import { Community } from '@/types/community';
import { CommunityCard } from './community-card';

interface CommunitiesListProps {
  communities: Community[];
  onCommunityPress: (communityId: string) => void;
  loading: boolean;
  refreshing: boolean;
  onRefresh: () => void;
  onEndReached: () => void;
  hasMore: boolean;
  error: string | null;
}

export function CommunitiesList({
  communities,
  onCommunityPress,
  loading,
  refreshing,
  onRefresh,
  onEndReached,
  hasMore,
  error
}: CommunitiesListProps) {
  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#4c669f" />
      </View>
    );
  };

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  if (communities.length === 0 && !loading) {
    return (
      <View style={styles.centered}>
        <Text>Aucune communauté trouvée</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={communities}
      renderItem={({ item }) => (
        <CommunityCard
          community={item}
          onPress={() => onCommunityPress(item.id)}
        />
      )}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
      refreshing={refreshing}
      onRefresh={onRefresh}
      onEndReached={hasMore ? onEndReached : null}
      onEndReachedThreshold={0.5}
      ListFooterComponent={renderFooter}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 16,
    paddingBottom: 50,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  error: {
    color: 'red',
    textAlign: 'center',
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});
