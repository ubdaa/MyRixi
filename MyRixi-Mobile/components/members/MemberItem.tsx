import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { ProfileDto } from '@/types/profile';
import { useRouter } from 'expo-router';

type MemberItemProps = {
  member: ProfileDto;
  isLast: boolean;
};

export const MemberItem = ({ member, isLast }: MemberItemProps) => {
  const { theme } = useTheme();
  const router = useRouter();

  return (
    <View>
      <TouchableOpacity 
        style={styles.memberItem}
        onPress={() => router.push(`/profile/${member.id}/page`)}
      >
        <Image 
          source={{ uri: member.profilePicture?.url || 'https://via.placeholder.com/50' }} 
          style={styles.profileImage}
        />
        <View style={styles.memberInfo}>
          <Text style={[styles.memberName, { color: theme.colors.textPrimary }]}>
            {member.displayName}
          </Text>
          <Text style={[styles.memberHandle, { color: theme.colors.textSecondary }]}>
            @{member.username}
          </Text>
        </View>
        <Ionicons 
          name="chevron-forward" 
          size={24} 
          color={theme.colors.textSecondary} 
        />
      </TouchableOpacity>
      {!isLast && (
        <View style={[styles.divider, { backgroundColor: theme.colors.divider }]} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
  },
  memberHandle: {
    fontSize: 14,
    marginTop: 4,
  },
  divider: {
    height: 1,
    marginHorizontal: 16,
  },
});
