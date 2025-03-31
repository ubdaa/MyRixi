import { useLocalSearchParams, router } from 'expo-router';
import { View, Text, StyleSheet, Animated, ScrollView } from 'react-native';
import { useEffect, useState, useRef } from 'react';
import { fetchCommunityById } from '@/services/communityService';
import { Community } from '@/types/community';
import { FloatingActionButton } from '@/components/ui/FloatingActionButton';
import { useTheme } from '@/contexts/ThemeContext';
import { CommunityHeader } from '@/components/community/community-header';

export default function CommunityScreen() {
  const { id } = useLocalSearchParams();
  const [community, setCommunity] = useState<Community>();
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  const scrollY = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    if (id) {
      setLoading(true);
      fetchCommunityById(Array.isArray(id) ? id[0] : id)
        .then((community) => setCommunity(community))
        .finally(() => setLoading(false));
    }
  }, [id]);
  
  const navigateToDrafts = () => {
    router.push(`/post/${id}/drafts`);
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background1 }]}>
        <Text style={{ color: theme.colors.textPrimary }}>Chargement...</Text>
      </View>
    );
  }
  
  if (!community) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background1 }]}>
        <Text style={{ color: theme.colors.textPrimary }}>Communauté non trouvée</Text>
      </View>
    );
  }
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background1 }]}>
      {/* Community Header with animation */}
      <CommunityHeader community={community} scrollY={scrollY} />
      
      {/* Contenu principal - Fix: Move to full screen and add appropriate padding */}
      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollViewContent, 
          { paddingTop: 300 } // Increased padding to account for the header + quick actions
        ]}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false } // Changed to false to support all animation properties
        )}
        scrollEventThrottle={16}
      >
        {/* Content Placeholder */}
        <View style={[styles.feedContent, { backgroundColor: theme.colors.background1 }]}>
          <Text style={{ color: theme.colors.textSecondary, textAlign: 'center', padding: 20 }}>
            Contenu du feed de la communauté
          </Text>
        </View>
      </Animated.ScrollView>
      
      {/* Floating Action Button pour les brouillons */}
      <FloatingActionButton
        icon="pencil"
        onPress={navigateToDrafts}
        accentColor={theme.colors.cyberPink}
        position="bottomRight"
        style={{ marginBottom: 20 }}
        size="medium"
        withHaptics
      />
    </View>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    position: 'absolute', // Position absolute to allow scrolling behind the header
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  scrollViewContent: {
    paddingBottom: 20,
    // Top padding will be added dynamically in the component
  },
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  feedContent: {
    flex: 1,
    minHeight: 300,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: 8,
  },
});