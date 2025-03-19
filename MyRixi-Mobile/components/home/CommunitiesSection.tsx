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

interface CommunitiesSectionProps {
  communities: Array<{
    id: string;
    name: string;
    members: number;
    image: string;
  }>;
}

export const CommunitiesSection: React.FC<CommunitiesSectionProps> = ({ communities }) => {
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
