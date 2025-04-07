import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { GlassCard } from '../ui/GlassCard';
import { Profile } from '@/types/profile';

interface ProfileStatsProps {
  profile: Profile;
  profileType: 'user' | 'community';
}

const ProfileStats: React.FC<ProfileStatsProps> = ({ profile, profileType }) => {
  const { theme } = useTheme();
  
  const stats = profileType === 'user' 
    ? [
        { label: 'Posts', value: 0 },
        { label: 'Followers', value: 0 },
        { label: 'Following', value: 0 },
      ]
    : [
        { label: 'Posts', value: 0 },
        { label: 'Members', value: 0 },
        { label: 'Events', value: 0 },
      ];

  return (
    <GlassCard style={styles.container}>
      <View style={styles.statsContainer}>
        {stats.map((stat, index) => (
          <View 
            key={index} 
            style={[
              styles.statItem, 
              index < stats.length - 1 && { 
                borderRightWidth: 1,
                borderRightColor: theme.colors.divider,
              }
            ]}
          >
            <Text style={[styles.statValue, { color: theme.colors.textPrimary }]}>
              {stat.value.toLocaleString()}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
              {stat.label}
            </Text>
          </View>
        ))}
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
  },
});

export default ProfileStats;
