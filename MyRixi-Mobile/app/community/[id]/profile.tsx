import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View, RefreshControl } from "react-native";
import { useTheme } from '@/contexts/ThemeContext';
import { useLocalSearchParams, useRouter } from "expo-router";
import { ProfileDto } from "@/types/profile";

// Import the components used in the profile presentation
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileStats from "@/components/profile/ProfileStats";
import ProfileContent from "@/components/profile/ProfileContent";
import ErrorDisplay from '@/components/shared/ErrorDisplay';
import { fetchCommunityProfile } from "@/services/profileService";

export default function CommunityProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [profile, setProfile] = useState<ProfileDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();
  const router = useRouter();

  const lFetchCommunityProfile = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      const profileData = await fetchCommunityProfile(id);
      setProfile(profileData);
    } catch (err) {
      console.error("Error fetching community profile:", err);
      setError("Failed to load community profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    lFetchCommunityProfile();
  }, [id]);

  const handleEditProfile = () => {
    if (profile?.isOwner) {
      router.push(`/profile/${profile.id}/edit`);
    }
  };
  
  const handleFollow = () => {
    // Handle follow/unfollow community logic
    console.log("Follow/unfollow community");
  };
  
  const handleMessage = () => {
    // Handle messaging community moderators
    console.log("Message community");
  };
  
  const handleShare = () => {
    // Share community profile functionality
    console.log("Share community profile");
  };

  if (loading) {
    return (
      <View style={[styles.centeredContainer, { backgroundColor: theme.colors.background1 }]}>
        <ActivityIndicator size="large" color={theme.colors.cyberPink} />
      </View>
    );
  }

  if (error || !profile) {
    return (
      <ErrorDisplay 
        message={error || "Failed to load community profile"}
        onRetry={lFetchCommunityProfile}
      />
    );
  }

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background1 }]}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={lFetchCommunityProfile} />
      }
    >
      <ProfileHeader
        profile={profile}
        isOwner={profile.isOwner}
        profileType="community"
        onEditProfile={handleEditProfile}
      />
      
      <ProfileStats 
        profile={profile} 
        profileType="community" 
      />
      
      <ProfileContent 
        profileType="community"
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