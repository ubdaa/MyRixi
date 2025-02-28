import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

// Définition des props pour le composant ChannelItem
export interface ChannelItemProps {
  id: string;
  name: string;
  description: string;
  isPrivate: boolean;
  unreadCount: number;
  onPress: (channelId: string) => void;
}

// Composant pour afficher un canal dans la liste
export default function ChannelItem({ 
  id, 
  name, 
  description, 
  isPrivate, 
  unreadCount, 
  onPress 
}: ChannelItemProps) {
  return (
    <TouchableOpacity style={styles.channelItem} onPress={() => onPress(id)}>
      <View style={styles.channelInfo}>
        <Text style={styles.channelName}>
          {isPrivate ? '🔒 ' : '# '}{name}
        </Text>
        <Text style={styles.channelDescription} numberOfLines={1}>
          {description || 'Aucune description'}
        </Text>
      </View>
      {unreadCount > 0 && (
        <View style={styles.badgeContainer}>
          <Text style={styles.badge}>{unreadCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};


const styles = StyleSheet.create({
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
});
