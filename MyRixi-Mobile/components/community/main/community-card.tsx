import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Community } from '@/types/community';
import { CommunityAvatar } from './community-avatar';
import { CommunityCover } from './community-cover';

type CommunityCardProps = {
  community: Community;
};

export function CommunityCard ({ community }: CommunityCardProps) {
  return (
    <Link push href={`/community/${community.id}/feed`} asChild>
      <TouchableOpacity style={styles.card}>
        <CommunityCover coverUrl={community.coverUrl} />
        
        <View style={styles.cardContent}>
          <CommunityAvatar 
            iconUrl={community.iconUrl} 
            style={styles.avatarPosition}
          />
          
          <View style={styles.cardInfo}>
            <Text style={styles.communityName}>{community.name}</Text>
            <Text style={styles.description} numberOfLines={2}>
              {community.description}
            </Text>
            
            <View style={styles.metaInfo}>
              {community.isPrivate && (
                <View style={styles.privateTag}>
                  <Ionicons name="lock-closed" size={12} color="#FFF" />
                  <Text style={styles.privateText}>Private</Text>
                </View>
              )}
              
              <Text style={styles.roleTag}>
                {community.profile.role}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardContent: {
    flexDirection: 'row',
    padding: 16,
  },
  avatarPosition: {
    marginTop: -30,
    marginRight: 16,
  },
  cardInfo: {
    flex: 1,
  },
  communityName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  description: {
    color: '#666',
    marginBottom: 8,
  },
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  privateTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ff6b6b',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginRight: 8,
  },
  privateText: {
    color: '#FFF',
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '500',
  },
  roleTag: {
    backgroundColor: '#4c669f',
    color: 'white',
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    overflow: 'hidden',
  },
});