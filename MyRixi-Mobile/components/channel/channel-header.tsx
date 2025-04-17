import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Channel } from '@/types/channel';
import { useTheme } from '@/contexts/ThemeContext';
import { BlurView } from 'expo-blur';

type ChannelHeaderProps = {
  channel: Channel | null;
  onBackPress?: () => void;
};

export function ChannelHeader ({ channel, onBackPress }: ChannelHeaderProps) {
  const { theme, colorMode } = useTheme();

  return (
    <BlurView 
      intensity={theme.glassmorphism.blur / 2}
      tint={colorMode === 'dark' ? 'dark' : 'light'}
      style={styles.blurContainer}
    >
      <View style={[styles.header, { 
        backgroundColor: colorMode === 'dark' 
          ? 'rgba(26, 27, 31, 0.7)'
          : 'rgba(250, 250, 250, 0.7)',
        borderBottomColor: theme.colors.divider 
      }]}>
        <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        
        <View style={styles.headerInfo}>
          <Text style={[styles.channelName, { color: theme.colors.textPrimary }]}>
            #{channel?.name || 'Loading...'}
          </Text>
          <Text style={[styles.channelDescription, { color: theme.colors.textSecondary }]} numberOfLines={1}>
            {channel?.description || ''}
          </Text>
        </View>
        
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={[styles.iconButton, { backgroundColor: theme.colors.technoBlue + '20' }]}
          >
            <Ionicons name="people" size={20} color={theme.colors.technoBlue} />
          </TouchableOpacity>
          <Text style={[styles.memberCount, { color: theme.colors.textSecondary }]}>
            {channel?.participantCount || 0}
          </Text>
        </View>
      </View>
    </BlurView>
  );
};

const styles = StyleSheet.create({
  blurContainer: {
    borderBottomWidth: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  backButton: {
    padding: 4,
    marginRight: 8,
    borderRadius: 20,
  },
  headerInfo: {
    flex: 1,
  },
  channelName: {
    fontSize: 17,
    fontWeight: '600',
  },
  channelDescription: {
    fontSize: 13,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
    borderRadius: 18,
  },
  memberCount: {
    fontSize: 14,
    marginLeft: 4,
    fontWeight: '500',
  },
});