import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  StatusBar,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

import { AnimatedBackground } from '@/components/home/AnimatedBackground';
import { Header } from '@/components/home/Header';
import { SearchBar } from '@/components/home/SearchBar';
import { WelcomeCard } from '@/components/home/WelcomeCard';
import { CommunitiesSection } from '@/components/home/CommunitiesSection';
import { PostsSection } from '@/components/home/PostsSection';
import { FloatingActionButton } from '@/components/ui/FloatingActionButton';
import { useCommunity } from '@/contexts/CommunityContext';
import { useProfile } from '@/contexts/ProfileContext';
import { fetchRecentPosts } from '@/services/postService';
import { Post } from '@/types/post';

export default function HomePage() {
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

  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPosts = async () => {
    setLoadingPosts(true);
    try {
      const fetchedPosts = await fetchRecentPosts();
      setPosts(fetchedPosts);
    } catch (error) {
      console.error('Erreur lors de la récupération des posts:', error);
    } finally {
      setLoadingPosts(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

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
        avatarUrl={profile?.profilePicture.url ?? require('@/assets/images/default-avatar.jpg')}
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
        <PostsSection
          posts={posts}
          loading={loadingPosts}
          loadMore={fetchPosts}
          refreshing={refreshing}
          onRefresh={fetchPosts}
          title="Fil d'actualité"
          emptyMessage="Aucun post à afficher"
          showCommunity={true}
          nestedScroll={true}
          style={{marginTop: 20}}
        />
      </Animated.ScrollView>
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
    paddingBottom: 80, // Augmenter le padding pour éviter le débordement // Augmenté pour éviter que le contenu passe sous la tab bar
  },
});