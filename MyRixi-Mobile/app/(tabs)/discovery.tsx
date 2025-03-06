import React, { useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import useDiscover from '@/hooks/useDiscover';
import { CommunitiesList } from '@/components/discovery/communities-list';

export default function DiscoveryScreen() {
  const router = useRouter();
  const {
    communities,
    loading,
    error,
    fetchCommunities,
    hasMore
  } = useDiscover();

  useEffect(() => {
    fetchCommunities(true);
  }, []);

  const handleCommunityPress = (communityId: string) => {
    router.push(`/community/discover/${communityId}`);
  };

  const handleLoadMore = () => {
    if (!loading && communities.length % 10 == 0) fetchCommunities();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Découvrir des communautés</Text>
      </View>
      
      <CommunitiesList
        communities={communities}
        onCommunityPress={handleCommunityPress}
        loading={loading}
        refreshing={loading && communities.length === 0}
        onRefresh={() => fetchCommunities(true)}
        onEndReached={handleLoadMore}
        hasMore={hasMore}
        error={error}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});