import React, { useEffect, useRef, useState } from 'react';
import { 
  StyleSheet, 
  View, 
  FlatList, 
  RefreshControl,
  Animated, 
  StatusBar,
  Dimensions
} from 'react-native';
import { Community } from '@/types/community';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { NeoButton } from '@/components/ui/NeoButton';
import { Header } from '@/components/ui/Header';
import { CommunityCard } from '@/components/community/main/community-card';
import { EmptyStateView } from '@/components/ui/EmptyStateView';
import { FloatingActionButton } from '@/components/ui/FloatingActionButton';
import { useCommunity } from '@/contexts/CommunityContext';
import { useTheme } from '@/contexts/ThemeContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_MARGIN = 16;
const CARD_WIDTH = SCREEN_WIDTH - CARD_MARGIN * 2;

export default function CommunitiesScreen() {
  const { theme, colorMode } = useTheme();
  const { communities, loading, fetchCommunities } = useCommunity();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [refreshing, setRefreshing] = useState(false);
  
  useEffect(() => {
    fetchCommunities();
  }, [fetchCommunities]);
  
  // Gestionnaires d'événements
  const handleRefresh = async () => {
    setRefreshing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await fetchCommunities();
    setRefreshing(false);
  };
  
  const handleCreateCommunity = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/community/create');
  };

  const handleDiscoverCommunities = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/discovery');
  };
  
  const handleCommunityPress = (communityId: string | number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push(`/community/${communityId}/feed`);
  };
  
  const renderCommunityItem = ({ item, index }: { item: Community; index: number }) => (
    <CommunityCard 
      key={index}
      community={item} 
      onPress={handleCommunityPress}
    />
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background1 }]}>
      <StatusBar
        translucent 
        backgroundColor="transparent"
        barStyle={colorMode === 'dark' ? 'light-content' : 'dark-content'}
      />

      {/* Fond avec dégradé */}
      <LinearGradient
        colors={
          colorMode === 'dark'
            ? ['#141316', '#1A1B1F', '#141316']
            : ['#F8F8FA', '#FFFFFF', '#F8F8FA']
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      
      {/* Header fixe */}
      <Header
        title="Communautés"
        scrollY={scrollY}
      />
      
      {/* Liste des communautés */}
      <FlatList
        data={communities}
        renderItem={renderCommunityItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        ListEmptyComponent={
          loading ? null : (
            <EmptyStateView
              icon="people-circle-outline"
              title="Aucune communauté"
              message="Rejoignez ou créez votre première communauté"
              primaryAction={{
                title: "Créer",
                onPress: handleCreateCommunity,
                accentColor: theme.colors.cyberPink
              }}
              secondaryAction={{
                title: "Découvrir",
                onPress: handleDiscoverCommunities,
                accentColor: theme.colors.technoBlue
              }}
            />
          )
        }
        ListFooterComponent={
          communities.length > 0 ? (
            <View style={styles.footer}>
              <NeoButton
                title="Découvrir plus de communautés"
                onPress={handleDiscoverCommunities}
                variant="secondary"
                accentColor={theme.colors.technoBlue}
                size="medium"
              />
            </View>
          ) : null
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={theme.colors.textSecondary}
            colors={[theme.colors.cyberPink, theme.colors.technoBlue]}
            progressBackgroundColor={
              colorMode === 'dark' ? '#1A1B1F' : '#FFFFFF'
            }
          />
        }
      />
      
      {/* Bouton flottant pour créer (visible uniquement s'il y a des communautés) */}
      {communities.length > 0 && (
        <FloatingActionButton
          onPress={handleCreateCommunity}
          icon="add"
          accentColor={theme.colors.cyberPink}
          position="bottomRight"
          size="medium"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingTop: 140,
    paddingBottom: 20,
  },
  footer: {
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 48,
    alignItems: 'center',
  },
});