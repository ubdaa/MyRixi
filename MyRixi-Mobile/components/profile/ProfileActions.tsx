import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard } from '../ui/GlassCard';

interface ProfileActionsProps {
  isOwner: boolean;
  profileType: 'user' | 'community';
  isFollowing?: boolean;
  isMember?: boolean;
  onFollow?: () => void;
  onMessage?: () => void;
  onJoinCommunity?: () => void;
  onShare?: () => void;
}

function ProfileActions ({
  isOwner,
  profileType,
  isFollowing = false,
  isMember = false,
  onFollow,
  onMessage,
  onJoinCommunity,
  onShare,
}: ProfileActionsProps) {
  const { theme } = useTheme();

  // Different action buttons based on profile type and ownership
  if (isOwner) {
    return null; // Owner actions are shown in the header
  }

  return (
    <GlassCard style={styles.container}>
      <View style={styles.actionsContainer}>
        {profileType === 'user' ? (
          // User profile actions
          <>
            <TouchableOpacity
              style={[
                styles.actionButton,
                {
                  backgroundColor: isFollowing ? 'transparent' : theme.colors.technoBlue,
                  borderColor: theme.colors.technoBlue,
                  borderWidth: isFollowing ? 1 : 0,
                },
              ]}
              onPress={onFollow}
            >
              <Text
                style={[
                  styles.actionText,
                  { color: isFollowing ? theme.colors.technoBlue : 'white' },
                ]}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.iconButton, { borderColor: theme.colors.divider }]}
              onPress={onMessage}
            >
              <Ionicons name="mail-outline" size={20} color={theme.colors.textPrimary} />
            </TouchableOpacity>
          </>
        ) : (
          // Community profile actions
          <>
            <TouchableOpacity
              style={[
                styles.actionButton,
                {
                  backgroundColor: isMember ? 'transparent' : theme.colors.neoPurple,
                  borderColor: theme.colors.neoPurple,
                  borderWidth: isMember ? 1 : 0,
                },
              ]}
              onPress={onJoinCommunity}
            >
              <Text
                style={[
                  styles.actionText,
                  { color: isMember ? theme.colors.neoPurple : 'white' },
                ]}
              >
                {isMember ? 'Joined' : 'Join Community'}
              </Text>
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity
          style={[styles.iconButton, { borderColor: theme.colors.divider }]}
          onPress={onShare}
        >
          <Ionicons name="share-outline" size={20} color={theme.colors.textPrimary} />
        </TouchableOpacity>
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
    marginRight: 10,
  },
  actionText: {
    fontWeight: '600',
  },
  iconButton: {
    padding: 10,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 44,
  },
});

export default ProfileActions;
