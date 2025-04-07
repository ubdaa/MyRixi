import React from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Profile, ProfileDto } from '@/types/profile';
import { GlassCard } from '../ui/GlassCard';
import { Ionicons } from '@expo/vector-icons';

interface ProfileHeaderProps {
  profile: ProfileDto;
  isOwner: boolean;
  profileType: 'user' | 'community';
  onEditProfile?: () => void;
}

function ProfileHeader ({
  profile,
  isOwner,
  profileType,
  onEditProfile,
}: ProfileHeaderProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.coverContainer}>
        {profile.coverPicture.url ? (
          <Image source={{ uri: profile.coverPicture.url }} style={styles.coverImage} />
        ) : (
          <View 
            style={[
              styles.coverPlaceholder, 
              { backgroundColor: profileType === 'user' ? theme.colors.technoBlue : theme.colors.neoPurple }
            ]} 
          />
        )}
      </View>
      
      <View style={styles.profileImageContainer}>
        <Image 
          source={{ uri: profile.profilePicture.url || 'https://via.placeholder.com/100' }} 
          style={[styles.profileImage, { borderColor: theme.colors.background1 }]} 
        />
      </View>

      <GlassCard style={styles.infoContainer}>
        <View style={styles.nameContainer}>
          <Text style={[styles.name, { color: theme.colors.textPrimary }]}>
            {profileType === 'user' ? profile.displayName : profile.pseudonym}
          </Text>
          
          {profileType === 'user' && profile.isVerified && (
            <Ionicons name="checkmark-circle" size={18} color={theme.colors.technoBlue} style={styles.verifiedIcon} />
          )}
        </View>
        
        <Text style={[styles.username, { color: theme.colors.textSecondary }]}>
          {`@${profile.username}`}
        </Text>
        
        {profile.bio && (
          <Text style={[styles.bio, { color: theme.colors.textPrimary }]}>
            {profile.bio}
          </Text>
        )}
        
        {isOwner && (
          <TouchableOpacity 
            style={[styles.editButton, { backgroundColor: theme.colors.solarGold }]} 
            onPress={onEditProfile}
          >
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        )}
      </GlassCard>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  coverContainer: {
    height: 180,
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  coverPlaceholder: {
    width: '100%',
    height: '100%',
  },
  profileImageContainer: {
    position: 'absolute',
    top: 120,
    left: 20,
    zIndex: 10,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
  },
  infoContainer: {
    marginTop: -10,
    paddingTop: 60,
    marginHorizontal: 10,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  verifiedIcon: {
    marginLeft: 5,
  },
  username: {
    fontSize: 16,
    marginBottom: 8,
  },
  bio: {
    fontSize: 16,
    marginTop: 10,
    lineHeight: 22,
  },
  editButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  editButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});

export default ProfileHeader;
