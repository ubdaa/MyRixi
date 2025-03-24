import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  StatusBar,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import useChannel from '@/hooks/useChannel';
import { DEMO_POSTS } from '@/data/demo';

// Components
import { AnimatedBackground } from '@/components/home/AnimatedBackground';
import { Header } from '@/components/home/Header';
import { SearchBar } from '@/components/home/SearchBar';
import { WelcomeCard } from '@/components/home/WelcomeCard';
import { CommunitiesSection } from '@/components/home/CommunitiesSection';
import { PostsSection } from '@/components/home/PostsSection';
import { FloatingActionButton } from '@/components/home/FloatingActionButton';
import { useCommunity } from '@/contexts/CommunityContext';
import { useProfile } from '@/contexts/ProfileContext';

export default function HomePage() {
  const channel = useChannel();
  channel.connectSignalR();

  const { theme, colorMode, toggleColorMode } = useTheme();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [searchQuery, setSearchQuery] = useState('');
  
  const { communities, loading, fetchCommunities } = useCommunity();

  useEffect(() => {
    fetchCommunities();
  }, [fetchCommunities]);
  
  const { fetchProfile, profile } = useProfile();

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return (
    <View style={[
      styles.container,
      { backgroundColor: theme.colors.background1 }
    ]}>
      <StatusBar
        barStyle={colorMode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      
      {/* Fond animé avec effet parallaxe */}
      <AnimatedBackground scrollY={scrollY} />
      
      {/* Header flottant avec effet parallaxe */}
      <Header 
        scrollY={scrollY} 
        username={profile?.displayName ?? "John Doe"}
        avatarUrl={profile?.profilePicture.url ?? "https://i.pravatar.cc/150?img=1"}
        onProfilePress={toggleColorMode}
      />
      
      {/* Contenu principal */}
      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        {/* Zone de recherche */}
        <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
        
        {/* Carte de bienvenue */}
        <WelcomeCard />
        
        {/* Section Communautés */}
        <CommunitiesSection communities={communities} />
        
        {/* Section Posts */}
        <PostsSection posts={DEMO_POSTS} />
      </Animated.ScrollView>
      
      {/* Bouton flottant pour nouveau post */}
      <FloatingActionButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingTop: 120, // Pour compenser le header
    paddingBottom: 20,
  },
});