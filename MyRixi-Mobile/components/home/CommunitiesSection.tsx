import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { SectionHeader } from './SectionHeader';
import { CommunityCard } from './CommunityCard';
import { CreateCommunityCard } from './CreateCommunityCard';
import { Community } from '@/types/community';

interface CommunitiesSectionProps {
  communities: Array<Community>;
}

export function CommunitiesSection ({ communities }: CommunitiesSectionProps) {
  return (
    <View style={styles.sectionContainer}>
      <SectionHeader 
        title="Vos Communautés" 
        onPress={() => router.push('/communities')}
      />
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.communitiesContainer}
      >
        {communities.map((community, index) => (
          <CommunityCard key={community.id} community={community} index={index} />
        ))}
        
        <CreateCommunityCard />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  communitiesContainer: {
    paddingBottom: 10,
    paddingRight: 20,
  },
});
