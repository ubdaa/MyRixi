import { useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useEffect, useState } from 'react';
import { CommunityCover } from '@/components/community/main/community-cover'; // Adaptez selon votre structure
import { fetchCommunityById } from '@/services/communityService';
import { Community } from '@/types/community';
import { CommunityAvatar } from '@/components/community/main/community-avatar';

export default function CommunityScreen() {
  const { id } = useLocalSearchParams();
  const [community, setCommunity] = useState<Community>();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (id) {
      setLoading(true);
      fetchCommunityById(Array.isArray(id) ? id[0] : id)
        .then((community) => setCommunity(community))
        .finally(() => setLoading(false));
    }
  }, [id]);
  
  if (loading) {
    return <View style={styles.container}><Text>Chargement...</Text></View>;
  }
  
  if (!community) {
    return <View style={styles.container}><Text>Communauté non trouvée</Text></View>;
  }
  
  return (
    <ScrollView style={styles.container}>
      <CommunityCover coverUrl={community.coverUrl} height={200} />
      <View style={styles.header}>
        <CommunityAvatar iconUrl={community.iconUrl} style={styles.avatar} />
        <Text style={styles.name}>{community.name}</Text>
        <Text style={styles.description}>{community.description}</Text>
      </View>
      
      {/* Ajoutez ici d'autres informations générales sur la communauté */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    marginTop: -40,
    borderWidth: 3,
    borderColor: 'white',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
});