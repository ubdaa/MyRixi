import React, { useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CommunitiesList } from '@/components/community/community-list';
import { useCommunity } from '@/contexts/CommunityContext';

export default function CommunitiesScreen() {
  const { communities, loading, fetchCommunities } = useCommunity();

  useEffect(() => {
    fetchCommunities();
  }, [fetchCommunities]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Communities</Text>
        <Link href="/community/create" asChild>
          <TouchableOpacity style={styles.createButton}>
            <Ionicons name="add" size={24} color="#fff" />
            <Text style={styles.createButtonText}>Create</Text>
          </TouchableOpacity>
        </Link>
      </View>

      <CommunitiesList
        communities={communities}
        refreshing={loading}
        onRefresh={fetchCommunities}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4c669f',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  createButtonText: {
    color: '#fff',
    marginLeft: 4,
    fontWeight: 'bold',
  },
});