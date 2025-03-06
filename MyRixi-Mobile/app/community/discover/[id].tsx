import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import useDiscover from '@/hooks/useDiscover';
import { useCommunity } from '@/contexts/CommunityContext';

export default function CommunityDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { fetchCommunityDetails, selectedCommunity, loading, error } = useDiscover();
  const { joinCommunity, communities } = useCommunity();
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    if (id) {
      fetchCommunityDetails(id as string);
    }
  }, [id, fetchCommunityDetails]);

  const isUserMember = !!communities.find(c => c.id === id);

  const handleJoinCommunity = async () => {
    if (!selectedCommunity) return;
    
    setJoining(true);
    try {
      await joinCommunity(selectedCommunity.id);
      router.push(`/community/${selectedCommunity.id}/feed`);
    } catch (err) {
      console.error('Failed to join community:', err);
    } finally {
      setJoining(false);
    }
  };

  if (loading && !selectedCommunity) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4c669f" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  if (!selectedCommunity) {
    return (
      <View style={styles.centered}>
        <Text>Communauté introuvable</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: selectedCommunity.coverUrl }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title}>{selectedCommunity.name}</Text>
        <Text style={styles.description}>{selectedCommunity.description}</Text>
        <TouchableOpacity
          style={[styles.button, isUserMember ? styles.buttonDisabled : null]}
          onPress={handleJoinCommunity}
          disabled={isUserMember || joining}
        >
          <Text style={styles.buttonText}>
            {isUserMember ? 'Déjà membre' : joining ? 'Rejoindre...' : 'Rejoindre'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: 200,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#4c669f',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    color: 'red',
  },
});