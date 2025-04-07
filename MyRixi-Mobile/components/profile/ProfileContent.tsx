import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, FlatList } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { GlassCard } from '../ui/GlassCard';
import { ProfileDto } from '@/types/profile';

interface ProfileContentProps {
  profileType: 'user' | 'community';
  profile: ProfileDto;
  // You would include actual content data here
  posts?: any[];
  events?: any[];
  photos?: any[];
}

function ProfileContent ({ 
  profileType,
  profile,
  posts = [],
  events = [], 
  photos = [],
}: ProfileContentProps) {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('posts');

  const tabs = [
        { id: 'posts', label: 'Publications' },
        { id: 'comments', label: 'Commentaires' },
        { id: 'likes', label: 'J\'aime' },
      ]

  const renderPlaceholder = () => (
    <View style={styles.placeholderContainer}>
      <Text style={[styles.placeholderText, { color: theme.colors.textSecondary }]}>
        {activeTab === 'posts' && 'Aucun post trouvé'}
        {activeTab === 'comments' && 'Aucun commentaire trouvé'}
        {activeTab === 'likes' && 'Aucun j\'aime trouvé'}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
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
