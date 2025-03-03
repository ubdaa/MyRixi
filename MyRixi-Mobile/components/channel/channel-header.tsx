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
        <Ionicons name="chevron-back" size={24} color="#424242" />
      </TouchableOpacity>
      
      <View style={styles.headerInfo}>
        <Text style={styles.channelName}>#{channel?.name || 'Loading...'}</Text>
        <Text style={styles.channelDescription} numberOfLines={1}>
          {channel?.description || ''}
        </Text>
      </View>
      
      <View style={styles.headerActions}>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="people" size={22} color="#424242" />
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
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
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
    color: '#424242',
  },
  channelDescription: {
    fontSize: 12,
    color: '#757575',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 6,
  },
  memberCount: {
    color: '#424242',
    fontSize: 14,
    marginLeft: 2,
  },
});