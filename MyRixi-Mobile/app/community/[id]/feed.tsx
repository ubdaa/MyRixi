import { useLocalSearchParams, router } from 'expo-router';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useEffect, useState } from 'react';
import { CommunityCover } from '@/components/community/main/community-cover';
import { fetchCommunityById } from '@/services/communityService';
import { Community } from '@/types/community';
import { CommunityAvatar } from '@/components/community/main/community-avatar';
import { FloatingActionButton } from '@/components/ui/FloatingActionButton';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';

export default function CommunityScreen() {
  const { id } = useLocalSearchParams();
  const [community, setCommunity] = useState<Community>();
  const [loading, setLoading] = useState(true);
  const { theme, colorMode } = useTheme();

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
      <ScrollView>
        {/* Header Section */}
        <View style={styles.headerContainer}>
          <CommunityCover coverUrl={community.coverUrl} height={180} />
          
          <View style={styles.avatarContainer}>
            <CommunityAvatar 
              iconUrl={community.iconUrl} 
              size={90} 
              style={[styles.avatar, { borderRadius: 16, borderColor: theme.colors.background1 }]} 
            />
          </View>
          
          <BlurView
            intensity={colorMode === 'dark' ? 15 : 60}
            tint={colorMode}
            style={styles.headerContentContainer}
          >
            <View style={styles.communityInfoContainer}>
              <View style={styles.nameContainer}>
                <Text style={[styles.name, { color: theme.colors.textPrimary }]}>
                  {community.name}
                </Text>
                
                {community.isPrivate && (
                  <View style={[styles.privateContainer, { backgroundColor: 'rgba(0, 0, 0, 0.1)' }]}>
                    <Ionicons name="lock-closed" size={14} color={theme.colors.textSecondary} />
                    <Text style={[styles.privateText, { color: theme.colors.textSecondary }]}>Privée</Text>
                  </View>
                )}
              </View>
              
              <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
                {community.description}
              </Text>

              {community.profile && (
                <View style={styles.profileStats}>
                  <Text style={[styles.stat, { color: theme.colors.textSecondary }]}>
                    Votre rôle: <Text style={{ fontWeight: 'bold', color: theme.colors.cyberPink }}>{community.profile.role}</Text>
                  </Text>
                </View>
              )}
            </View>
          </BlurView>
        </View>

        <View style={[styles.quickActions, { backgroundColor: theme.colors.background2 }]}>
          <Pressable 
            style={[styles.actionButton, { borderColor: theme.colors.divider }]}
            android_ripple={{ color: 'rgba(0, 0, 0, 0.1)' }}
            onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
          >
            <Ionicons name="document-text-outline" size={22} color={theme.colors.technoBlue} />
            <Text style={[styles.actionText, { color: theme.colors.textPrimary }]}>Règles</Text>
          </Pressable>
          
          <Pressable 
            style={[styles.actionButton, { borderColor: theme.colors.divider }]}
            android_ripple={{ color: 'rgba(0, 0, 0, 0.1)' }}
            onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
          >
            <Ionicons name="people-outline" size={22} color={theme.colors.synthGreen} />
            <Text style={[styles.actionText, { color: theme.colors.textPrimary }]}>Membres</Text>
          </Pressable>
          
          <Pressable 
            style={[styles.actionButton, { borderRightWidth: 0, borderColor: theme.colors.divider }]}
            android_ripple={{ color: 'rgba(0, 0, 0, 0.1)' }}
            onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
          >
            <Ionicons name="bookmark-outline" size={22} color={theme.colors.solarGold} />
            <Text style={[styles.actionText, { color: theme.colors.textPrimary }]}>Enregistrés</Text>
          </Pressable>
        </View>
        
        <View style={[styles.feedContent, { backgroundColor: theme.colors.background1 }]}>
          <Text style={{ color: theme.colors.textSecondary, textAlign: 'center', padding: 20 }}>
            Contenu du feed de la communauté
          </Text>
        </View>
      </ScrollView>
      
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
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    position: 'relative',
  },
  headerContentContainer: {
    padding: 16,
    paddingTop: 60, 
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden',
  },
  communityInfoContainer: {
    width: '100%', 
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'absolute',
    top: 130,
    left: 0,
    width: '100%',
    alignItems: 'center',
    zIndex: 10,
  },
  avatar: {
    width: 90,
    height: 90,
    borderWidth: 3,
    borderColor: 'white',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginRight: 8,
  },
  privateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  privateText: {
    fontSize: 12,
    marginLeft: 4,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
    marginHorizontal: 16,
  },
  profileStats: {
    flexDirection: 'row',
    marginTop: 12,
    padding: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 16,
  },
  stat: {
    fontSize: 14,
  },
  quickActions: {
    flexDirection: 'row',
    marginHorizontal: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    borderRightWidth: 1,
  },
  actionText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '500',
  },
  feedContent: {
    flex: 1,
    minHeight: 300,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: 8,
  },
});