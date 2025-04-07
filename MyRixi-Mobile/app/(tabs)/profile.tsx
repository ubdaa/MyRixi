import React, { useEffect } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View, Text, RefreshControl } from "react-native";
import { useTheme } from '@/contexts/ThemeContext';
import { useProfile } from "@/contexts/ProfileContext";
import { useRouter } from "expo-router";

// Import the components used in the new profile presentation
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileStats from "@/components/profile/ProfileStats";
import ProfileActions from "@/components/profile/ProfileActions";
import ProfileContent from "@/components/profile/ProfileContent";
import ErrorDisplay from '@/components/shared/ErrorDisplay';

export default function ProfileScreen() {
  const { fetchProfile, profile, loading } = useProfile();
  const { theme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleEditProfile = () => {
    router.push('/profile/edit');
  };
  
  const handleFollow = () => {
    // This would typically be handled differently for your own profile
    // But included for consistency with the profile/[id] page
  };
  
  const handleMessage = () => {
    // Not applicable for own profile, but included for consistency
  };
  
  const handleShare = () => {
    // Share profile functionality
  };

  if (loading) {
    return (
      <View style={[styles.centeredContainer, { backgroundColor: theme.colors.background1 }]}>
        <ActivityIndicator size="large" color={theme.colors.cyberPink} />
      </View>
    );
  }

  if (!profile) {
    return (
      <ErrorDisplay 
        message="Failed to load profile"
        onRetry={fetchProfile}
      />
    );
  }

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background1 }]}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={fetchProfile} />
      }
    >
      <ProfileHeader
        profile={profile}
        isOwner={true}
        profileType="user"
        onEditProfile={handleEditProfile}
      />
      
      <ProfileStats 
        profile={profile} 
        profileType="user" 
      />
      
      <ProfileContent 
        profileType="user"
        profile={profile}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
