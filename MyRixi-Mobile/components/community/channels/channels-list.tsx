import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useChannel } from '@/hooks/useChannel';
import ChannelItem from './channel-item';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function CommunityChannels() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  
  const { 
    loading, 
    error, 
    communityChannels, 
    loadCommunityChannels 
  } = useChannel();
  
  // Charger les canaux quand le composant est monté ou quand communityId change
  useEffect(() => {
    if (id) {
      loadCommunityChannels(id as string);
    }
  }, [id, loadCommunityChannels]);
  
  // Gérer l'appui sur un canal
  const handleChannelPress = (channelId: string) => {
    //router.push('/channel', { channelId });
  };
  
  // Gérer la création d'un nouveau canal
  const handleNewChannel = () => {
    //navigation.navigate('CreateChannel', { id });
  };
  
  if (loading && communityChannels.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  
  if (error && communityChannels.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Erreur lors du chargement des canaux</Text>
        <TouchableOpacity onPress={() => loadCommunityChannels(id as string)}>
          <Text style={styles.retryButton}>Réessayer</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Chats</Text>
        <Link href="/community/create" asChild>
          <TouchableOpacity style={styles.createButton}>
            <Ionicons name="add" size={24} color="#fff" />
            <Text style={styles.createButtonText}>Create</Text>
          </TouchableOpacity>
        </Link>
      </View>
      <FlatList
        data={communityChannels}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ChannelItem
            id={item.id}
            name={item.name}
            description={item.description}
            isPrivate={item.isPrivate}
            unreadCount={item.unreadCount}
            onPress={handleChannelPress}
          />
        )}
        refreshing={loading}
        onRefresh={() => loadCommunityChannels(id as string)}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Aucun canal disponible</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  headerText: {
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
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    color: 'blue',
    fontSize: 16,
    fontWeight: 'bold',
  },
  channelItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  channelInfo: {
    flex: 1,
  },
  channelName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  channelDescription: {
    fontSize: 14,
    color: '#666',
  },
  badgeContainer: {
    backgroundColor: '#ff3b30',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 6,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#007aff',
    padding: 16,
    alignItems: 'center',
    margin: 16,
    borderRadius: 8,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});