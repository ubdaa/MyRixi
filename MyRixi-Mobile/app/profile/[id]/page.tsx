import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View, ActivityIndicator, RefreshControl } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useProfile } from '@/contexts/ProfileContext';
import { fetchProfileById } from '@/services/profileService';
import { ProfileDto } from '@/types/profile';

// Components
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileStats from '@/components/profile/ProfileStats';
import ProfileActions from '@/components/profile/ProfileActions';
import ProfileContent from '@/components/profile/ProfileContent';
import ErrorDisplay from '@/components/shared/ErrorDisplay';

export default function ProfilePage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { theme } = useTheme();
  const { profile: currentUserProfile } = useProfile();
  
  const [profile, setProfile] = useState<ProfileDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isMember, setIsMember] = useState(false);

  const fetchProfileData = async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Fetch profile using the unified endpoint
      const fetchedProfile = await fetchProfileById(id);
      setProfile(fetchedProfile);
      
      // Use the relationship flags from the DTO
      setIsFollowing(fetchedProfile.isFollowing);
      setIsMember(fetchedProfile.isMember);
      
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [id, currentUserProfile]);

  const handleEditProfile = () => {
    router.push('/profile/edit');
  };
  
  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    // API call to follow/unfollow would go here
  };
  
  const handleJoinCommunity = () => {
    setIsMember(!isMember);
    // API call to join/leave community would go here
  };
  
  const handleMessage = () => {
    // router.push(`/messages/${id}`);
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

  if (error || !profile) {
    return (
      <ErrorDisplay 
        message={error || "Profile not found"}
        onRetry={fetchProfileData}
      />
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background1 }]}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={fetchProfileData} />
      }
    >
      <ProfileHeader
        profile={profile}
        isOwner={profile.isOwner}
        profileType={profile.profileType}
        onEditProfile={handleEditProfile}
      />
      
      <ProfileStats 
        profile={profile} 
        profileType={profile.profileType} 
      />
      
      <ProfileActions
        isOwner={profile.isOwner}
        profileType={profile.profileType}
        isFollowing={isFollowing}
        isMember={isMember}
        onFollow={handleFollow}
        onMessage={handleMessage}
        onJoinCommunity={handleJoinCommunity}
        onShare={handleShare}
      />
      
      <ProfileContent 
        profileType={profile.profileType}
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