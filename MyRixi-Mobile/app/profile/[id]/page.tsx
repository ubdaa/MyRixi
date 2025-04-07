import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View, ActivityIndicator, RefreshControl } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useProfile } from '@/contexts/ProfileContext';
import {
  fetchUserProfileById,
  fetchCommunityProfileById,
  determineProfileType,
} from '@/services/profileService';
import { Profile } from '@/types/profile';

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
  
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileType, setProfileType] = useState<'user' | 'community'>('user');
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isMember, setIsMember] = useState(false);

  const fetchProfileData = async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Determine profile type based on ID
      const type = determineProfileType(id);
      setProfileType(type);
      
      // Fetch the appropriate profile
      const fetchedProfile = type === 'user'
        ? await fetchUserProfileById(id)
        : await fetchCommunityProfileById(id);
        
      setProfile(fetchedProfile);
      
      // Check if current user is the owner of this profile
      if (currentUserProfile && type === 'user') {
        setIsOwner(currentUserProfile.id === fetchedProfile.id);
      }
      
      // In a real app, you would also check if user is following/member
      // This is placeholder logic
      setIsFollowing(false);
      setIsMember(false);
      
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
    // Navigate to edit profile screen
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
    // Navigate to messaging screen
    //router.push(`/messages/${id}`);
  };
  
  const handleShare = () => {
    // Share profile functionality
    // This would use Share API from react-native
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
        isOwner={isOwner}
        profileType={profileType}
        onEditProfile={handleEditProfile}
      />
      
      <ProfileStats 
        profile={profile} 
        profileType={profileType} 
      />
      
      <ProfileActions
        isOwner={isOwner}
        profileType={profileType}
        isFollowing={isFollowing}
        isMember={isMember}
        onFollow={handleFollow}
        onMessage={handleMessage}
        onJoinCommunity={handleJoinCommunity}
        onShare={handleShare}
      />
      
      <ProfileContent 
        profileType={profileType} 
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
