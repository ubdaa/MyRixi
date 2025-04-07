import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, FlatList } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { GlassCard } from '../ui/GlassCard';

interface ProfileContentProps {
  profileType: 'user' | 'community';
  // You would include actual content data here
  posts?: any[];
  events?: any[];
  photos?: any[];
}

const ProfileContent: React.FC<ProfileContentProps> = ({ 
  profileType,
  posts = [],
  events = [], 
  photos = [],
}) => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('posts');

  const tabs = profileType === 'user'
    ? [
        { id: 'posts', label: 'Posts' },
        { id: 'media', label: 'Media' },
        { id: 'likes', label: 'Likes' },
      ]
    : [
        { id: 'posts', label: 'Posts' },
        { id: 'events', label: 'Events' },
        { id: 'photos', label: 'Photos' },
      ];

  const renderPlaceholder = () => (
    <View style={styles.placeholderContainer}>
      <Text style={[styles.placeholderText, { color: theme.colors.textSecondary }]}>
        {activeTab === 'posts' && 'No posts yet'}
        {activeTab === 'media' && 'No media yet'}
        {activeTab === 'likes' && 'No likes yet'}
        {activeTab === 'events' && 'No events yet'}
        {activeTab === 'photos' && 'No photos yet'}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <GlassCard style={styles.tabContainer}>
        <View style={styles.tabsRow}>
          {tabs.map(tab => (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tab,
                activeTab === tab.id && {
                  borderBottomWidth: 2,
                  borderBottomColor: theme.colors.cyberPink,
                },
              ]}
              onPress={() => setActiveTab(tab.id)}
            >
              <Text
                style={[
                  styles.tabText,
                  {
                    color:
                      activeTab === tab.id
                        ? theme.colors.textPrimary
                        : theme.colors.textSecondary,
                    fontWeight: activeTab === tab.id ? '600' : 'normal',
                  },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </GlassCard>

      <View style={styles.contentContainer}>
        {/* This is a placeholder. In a real app, you would render different content based on the activeTab */}
        {renderPlaceholder()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContainer: {
    marginBottom: 15,
  },
  tabsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 15,
  },
  tabText: {
    fontSize: 16,
  },
  contentContainer: {
    flex: 1,
    minHeight: 200,
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  placeholderText: {
    fontSize: 16,
  },
});

export default ProfileContent;
