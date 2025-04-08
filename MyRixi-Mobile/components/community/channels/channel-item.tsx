import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

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
  const { theme } = useTheme();
  
  return (
    <TouchableOpacity 
      style={[
        styles.channelItem, 
        { 
          backgroundColor: theme.colors.background2
        }
      ]} 
      onPress={() => onPress(id)}
    >
      <View style={styles.iconContainer}>
        {isPrivate ? (
          <Ionicons name="lock-closed" size={18} color={theme.colors.solarGold} />
        ) : (
          <Text style={[styles.hashIcon, { color: theme.colors.textSecondary }]}>#</Text>
        )}
      </View>
      
      <View style={styles.channelInfo}>
        <Text style={[styles.channelName, { color: theme.colors.textPrimary }]}>
          {name}
        </Text>
        <Text 
          style={[styles.channelDescription, { color: theme.colors.textSecondary }]} 
          numberOfLines={1}
        >
          {description || 'Aucune description'}
        </Text>
      </View>
      
      {unreadCount > 0 && (
        <View style={[styles.badgeContainer, { backgroundColor: theme.colors.cyberPink }]}>
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
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginHorizontal: 8,
    marginVertical: 4,
    borderRadius: 8,
    marginTop: 10,
  },
  iconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  hashIcon: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  channelInfo: {
    flex: 1,
  },
  channelName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  channelDescription: {
    fontSize: 14,
  },
  badgeContainer: {
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badge: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 6,
  },
});
