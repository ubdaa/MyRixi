import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard } from '../ui/GlassCard';
import { NeoButton } from '../ui/NeoButton';

interface ProfileActionsProps {
  isOwner: boolean;
  profileType: 'user' | 'community';
  isFollowing?: boolean;
  isMember?: boolean;
  onFollow: () => void;
  onMessage: () => void;
  onShare: () => void;
}

function ProfileActions ({
  isOwner,
  profileType,
  isFollowing = false,
  onFollow,
  onMessage,
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
        <NeoButton
          title={isFollowing ? 'Ne plus suivre' : 'Suivre'}
          onPress={onFollow}
          variant={isFollowing ? 'secondary' : 'primary'}
          size='small'
        />

        <TouchableOpacity
          style={[styles.iconButton, { borderColor: theme.colors.divider }]}
          onPress={onMessage}
        >
          <Ionicons name="mail-outline" size={20} color={theme.colors.textPrimary} />
        </TouchableOpacity>

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
    marginHorizontal: 10,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 100,
    alignItems: 'center',
    marginRight: 10,
  },
  actionText: {
    fontWeight: '600',
  },
  iconButton: {
    padding: 6,
    borderRadius: 100,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
  },
});

export default ProfileActions;
