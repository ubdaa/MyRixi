import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useChannel } from '@/hooks/useChannel';
import ChannelItem from './channel-item';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { GlassCard } from '@/components/ui/GlassCard';
import { NeoButton } from '@/components/ui/NeoButton';

export default function CommunityChannels() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { theme, colorMode } = useTheme();

  const { 
    loading, 
    error, 
    communityChannels, 
    loadCommunityChannels 
  } = useChannel();
  
  // Charger les canaux quand le composant est monté ou quand communityId change
  useEffect(() => {
    if (id) {
      loadCommunityChannels(Array.isArray(id) ? id[0] : id);
    }
  }, [id]);
  
  // Gérer l'appui sur un canal
  const handleChannelPress = (channelId: string) => {
    router.push(`/channel/${channelId}`);
  };
  
  if (loading && communityChannels.length === 0) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.colors.background1 }]}>
        <ActivityIndicator size="large" color={theme.colors.technoBlue} />
      </View>
    );
  }
  
  if (error && communityChannels.length === 0) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.colors.background1 }]}>
        <Text style={[styles.errorText, { color: theme.colors.neoRed }]}>Erreur lors du chargement des canaux</Text>
        <TouchableOpacity onPress={() => loadCommunityChannels(Array.isArray(id) ? id[0] : id)}>
          <Text style={[styles.retryButton, { color: theme.colors.technoBlue }]}>Réessayer</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background1 }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.background1, borderBottomColor: theme.colors.divider }]}>
        <Text style={[styles.headerText, { color: theme.colors.textPrimary }]}>Chats</Text>
        <Link href={{ 
          pathname: "/channel/create",
          params: { communityId: Array.isArray(id) ? id[0] : id }
        }}>
          <NeoButton 
            title='Créer un canal'
            size='small'
            onPress={() => {}}
            style={{flex: 1}}
          />
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
        onRefresh={() => loadCommunityChannels(Array.isArray(id) ? id[0] : id)}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <GlassCard style={styles.emptyGlassCard}>
              <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
                Aucun canal disponible
              </Text>
            </GlassCard>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    borderBottomWidth: 1,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
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
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyGlassCard: {
    padding: 24,
    width: '90%',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
});