import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, Image, Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

// Components
import { SettingsHeader } from '@/components/settings/SettingsHeader';
import { SettingsSection } from '@/components/settings/SettingsSection';
import { SettingsItem } from '@/components/settings/SettingsItem';

// Mock community data (replace with real data fetching)
const fetchCommunityData = async (id: string) => {
  return {
    id,
    name: 'Communauté Neo-Tokyo',
    description: 'Une communauté de passionnés de culture cyberpunk et futuriste',
    imageSrc: 'https://placehold.co/400x400/8A2EFF/FFFFFF?text=NT',
    memberCount: 1248,
    createdAt: '2025-01-15',
    isAdmin: true
  };
};

export default function CommunitySettingsScreen() {
  const { communityId } = useLocalSearchParams();
  const router = useRouter();
  const { theme, colorMode } = useTheme();
  const [community, setCommunity] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCommunity = async () => {
      if (typeof communityId === 'string') {
        const data = await fetchCommunityData(communityId);
        setCommunity(data);
        setLoading(false);
      }
    };

    loadCommunity();
  }, [communityId]);

  if (loading || !community) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background1 }]}>
        <SettingsHeader title="Chargement..." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background1 }]}>
      <SettingsHeader title="Paramètres" />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Community Header */}
        <BlurView
          intensity={10}
          tint={colorMode === 'dark' ? 'dark' : 'light'}
          style={[
            styles.communityHeader, 
            { borderRadius: theme.roundness }
          ]}
        >
          <View style={[
            styles.headerContent,
            { backgroundColor: colorMode === 'dark' ? 'rgba(26, 27, 31, 0.5)' : 'rgba(255, 255, 255, 0.5)' }
          ]}>
            <Image 
              source={{ uri: community.imageSrc }}
              style={styles.communityImage}
            />
            <View style={styles.communityInfo}>
              <Text style={[styles.communityName, { color: theme.colors.textPrimary }]}>
                {community.name}
              </Text>
              <Text style={[styles.communityStats, { color: theme.colors.textSecondary }]}>
                {community.memberCount} membres • Créée le {new Date(community.createdAt).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </BlurView>

        {/* General Settings Section */}
        <SettingsSection 
          title="Paramètres généraux"
          footer="Modifiez les informations de base de votre communauté"
        >
          <SettingsItem
            icon={<Ionicons name="information-circle-outline" size={20} color="white" />}
            title="Informations générales"
            subtitle="Nom, description et image"
            tint={theme.colors.technoBlue}
            onPress={() => router.push(`/settings/${communityId}/general`)}
          />
          <SettingsItem
            icon={<Ionicons name="shield-checkmark-outline" size={20} color="white" />}
            title="Règles de la communauté"
            subtitle="Définir ou modifier les règles"
            tint={theme.colors.synthGreen}
            onPress={() => router.push(`/settings/${communityId}/rules`)}
          />
        </SettingsSection>

        {/* Management Section */}
        <SettingsSection 
          title="Gestion"
          footer="Gérez les membres et les rôles de la communauté"
        >
          <SettingsItem
            icon={<Ionicons name="people-outline" size={20} color="white" />}
            title="Membres"
            subtitle="Gérer les membres de la communauté"
            tint={theme.colors.cyberPink}
            onPress={() => console.log("Navigate to members management")}
          />
          <SettingsItem
            icon={<Ionicons name="ribbon-outline" size={20} color="white" />}
            title="Rôles et permissions"
            subtitle="Configurer les rôles des membres"
            tint={theme.colors.solarGold}
            onPress={() => router.push(`/settings/${communityId}/roles`)}
          />
        </SettingsSection>

        {/* Advanced Section */}
        <SettingsSection title="Avancé">
          <SettingsItem
            icon={<Ionicons name="lock-closed-outline" size={20} color="white" />}
            title="Confidentialité"
            subtitle="Communauté publique ou privée"
            tint={theme.colors.neoPurple}
            onPress={() => console.log("Navigate to privacy settings")}
          />
          <SettingsItem
            icon={<Ionicons name="notifications-outline" size={20} color="white" />}
            title="Notifications"
            subtitle="Paramètres de notification"
            tint={theme.colors.holoTurquoise}
            onPress={() => console.log("Navigate to notification settings")}
          />
        </SettingsSection>

        {/* Danger Zone */}
        <SettingsSection 
          title="Zone de danger"
          footer="Les actions dans cette section sont irréversibles"
        >
          <SettingsItem
            icon={<Ionicons name="alert-circle-outline" size={20} color="white" />}
            title="Actions dangereuses"
            subtitle="Supprimer la communauté"
            tint={theme.colors.neoRed}
            onPress={() => router.push(`/settings/${communityId}/danger`)}
          />
        </SettingsSection>

        <View style={styles.footer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  communityHeader: {
    marginHorizontal: 16,
    marginBottom: 24,
    marginTop: 8,
    overflow: 'hidden',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    width: '100%',
  },
  communityImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  communityInfo: {
    marginLeft: 16,
    flex: 1,
  },
  communityName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  communityStats: {
    fontSize: 14,
  },
  footer: {
    height: 40,
  }
});