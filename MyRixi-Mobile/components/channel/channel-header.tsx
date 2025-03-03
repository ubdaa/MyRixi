import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Channel } from '@/types/channel';

type ChannelHeaderProps = {
  channel: Channel | null;
  onBackPress?: () => void;
};

export function ChannelHeader ({ channel, onBackPress }: ChannelHeaderProps) {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
        <Ionicons name="chevron-back" size={24} color="#fff" />
      </TouchableOpacity>
      
      <View style={styles.headerInfo}>
        <Text style={styles.channelName}>#{channel?.name || 'Loading...'}</Text>
        <Text style={styles.channelDescription} numberOfLines={1}>
          {channel?.description || ''}
        </Text>
      </View>
      
      <View style={styles.headerActions}>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="people" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.memberCount}>{channel?.participantCount || 0}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#2f3136',
    borderBottomWidth: 1,
    borderBottomColor: '#1e1f22',
  },
  backButton: {
    padding: 4,
    marginRight: 8,
  },
  headerInfo: {
    flex: 1,
  },
  channelName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  channelDescription: {
    fontSize: 12,
    color: '#a3a6aa',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 6,
  },
  memberCount: {
    color: '#a3a6aa',
    fontSize: 14,
    marginLeft: 2,
  },
});