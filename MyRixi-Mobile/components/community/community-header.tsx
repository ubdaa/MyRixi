import React from 'react';
import { View, Text, StyleSheet, Animated, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CommunityCover } from '@/components/community/main/community-cover';
import { CommunityAvatar } from '@/components/community/main/community-avatar';
import { useTheme } from '@/contexts/ThemeContext';
import * as Haptics from 'expo-haptics';
import { Community } from '@/types/community';

interface QuickActionButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  color: string;
  borderColor: string;
  textColor: string;
  onPress: () => void;
  noBorder?: boolean;
}

function QuickActionButton({ 
  icon, 
  label, 
  color, 
  borderColor, 
  textColor, 
  onPress, 
  noBorder = false 
}: QuickActionButtonProps) {
  return (
    <Pressable 
      style={[
        styles.actionButton, 
        { 
          borderColor,
          borderRightWidth: noBorder ? 0 : 1,
        }
      ]}
      android_ripple={{ color: 'rgba(0, 0, 0, 0.1)' }}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
    >
      <Ionicons name={icon} size={22} color={color} />
      <Text style={[styles.actionText, { color: textColor }]}>{label}</Text>
    </Pressable>
  );
}

interface CommunityHeaderProps {
  community: Community;
  scrollY: Animated.Value;
}

export function CommunityHeader({ community, scrollY }: CommunityHeaderProps) {
  const { theme, colorMode } = useTheme();

  // Animation values based on scroll position - using values compatible with native driver
  const headerScale = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [1, 100/180], // Scale from original to target size
    extrapolate: 'clamp',
  });
  
  const avatarScale = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [1, 60/90], // Scale from original to target size
    extrapolate: 'clamp',
  });

  const avatarTranslateY = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [130, 20], // Move avatar vertically
    extrapolate: 'clamp',
  });

  const avatarTranslateX = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [0, -30], // Move avatar horizontally (from center to left)
    extrapolate: 'clamp',
  });

  const infoOpacity = scrollY.interpolate({
    inputRange: [0, 80, 120],
    outputRange: [1, 0.3, 0],
    extrapolate: 'clamp',
  });

  const compactHeaderOpacity = scrollY.interpolate({
    inputRange: [80, 120],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  
  // Add animation for quick actions
  const quickActionsOpacity = scrollY.interpolate({
    inputRange: [0, 50, 100],
    outputRange: [1, 0.5, 0],
    extrapolate: 'clamp',
  });
  
  const quickActionsTranslateY = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 20],
    extrapolate: 'clamp',
  });
  
  // Background opacity animation
  const backgroundOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0.3, 0.8],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Animated.View 
          style={{ 
            height: 180, 
            transform: [
              { scaleY: headerScale }
            ],
            zIndex: 1 
          }}
        >
          <CommunityCover coverUrl={community.coverUrl} height={180} />
        </Animated.View>
        
        <Animated.View 
          style={[
            styles.avatarContainer, 
            { 
              transform: [
                { translateY: avatarTranslateY },
                { translateX: avatarTranslateX },
                { scale: avatarScale }
              ],
              zIndex: 10 
            }
          ]}
        >
          <View style={{ width: 90, height: 90 }}>
            <CommunityAvatar 
              iconUrl={community.iconUrl} 
              size={90} 
              style={[styles.avatar, { borderRadius: 16 }]} 
            />
          </View>
        </Animated.View>
        
        <Animated.View 
          style={[
            styles.compactHeader, 
            { 
              opacity: compactHeaderOpacity,
              backgroundColor: theme.colors.background1 + 'F5',
              zIndex: 5
            }
          ]}
        >
          <Text 
            style={[styles.compactTitle, { color: theme.colors.textPrimary }]}
            numberOfLines={1}
          >
            {community.name}
          </Text>
          {community.isPrivate && (
            <Ionicons name="lock-closed" size={16} color={theme.colors.textSecondary} style={{ marginLeft: 8 }} />
          )}
        </Animated.View>
        
        <Animated.View 
          style={[
            styles.headerContentWrapper,
            { opacity: infoOpacity, zIndex: 3 }
          ]}
        >
          <View style={styles.headerContentContainer}>
            {/* Background with animated opacity */}
            <Animated.View
              style={[
                StyleSheet.absoluteFill, 
                { 
                  backgroundColor: colorMode === 'dark' 
                    ? `rgba(20, 20, 20, ${backgroundOpacity})` 
                    : `rgba(255, 255, 255, ${backgroundOpacity})`
                }
              ]}
            />
            <View style={styles.communityInfoContainer}>
              <View style={styles.nameContainer}>
                <Text style={[styles.name, { color: theme.colors.textPrimary }]}>
                  {community.name}
                </Text>
                
                {community.isPrivate && (
                  <View style={[styles.privateContainer, { backgroundColor: 'rgba(0, 0, 0, 0.1)' }]}>
                    <Ionicons name="lock-closed" size={14} color={theme.colors.textSecondary} />
                    <Text style={[styles.privateText, { color: theme.colors.textSecondary }]}>Privée</Text>
                  </View>
                )}
              </View>
              
              <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
                {community.description}
              </Text>

              {community.profile && (
                <View style={styles.profileStats}>
                  <Text style={[styles.stat, { color: theme.colors.textSecondary }]}>
                    Votre rôle: <Text style={{ fontWeight: 'bold', color: theme.colors.cyberPink }}>{community.profile.role}</Text>
                  </Text>
                </View>
              )}
            </View>
          </View>
        </Animated.View>
      </View>

      {/* Quick Actions with animation compatible with native driver */}
      <Animated.View style={[
        styles.quickActionsWrapper, 
        { 
          opacity: quickActionsOpacity,
          transform: [{ translateY: quickActionsTranslateY }],
          zIndex: 2
        }
      ]}>
        <View style={[styles.quickActions, { backgroundColor: theme.colors.background2 }]}>
          <QuickActionButton 
            icon="document-text-outline" 
            label="Règles"
            color={theme.colors.technoBlue}
            borderColor={theme.colors.divider}
            textColor={theme.colors.textPrimary}
            onPress={() => {}}
          />
          
          <QuickActionButton 
            icon="people-outline" 
            label="Membres"
            color={theme.colors.synthGreen}
            borderColor={theme.colors.divider}
            textColor={theme.colors.textPrimary}
            onPress={() => {}}
          />
          
          <QuickActionButton 
            icon="bookmark-outline" 
            label="Enregistrés"
            color={theme.colors.solarGold}
            borderColor={theme.colors.divider}
            textColor={theme.colors.textPrimary}
            onPress={() => {}}
            noBorder
          />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    zIndex: 10,
    height: 280, // Fixed height for the header container
  },
  headerContainer: {
    position: 'relative',
  },
  headerContentWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  headerContentContainer: {
    padding: 16,
    paddingTop: 60, 
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden',
  },
  communityInfoContainer: {
    width: '100%', 
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'absolute',
    alignItems: 'center',
    width: 90,
    height: 90,
    left: '50%',
    marginLeft: -45, // Half of avatar width to center it
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderWidth: 3,
    borderColor: 'white',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginRight: 8,
  },
  privateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  privateText: {
    fontSize: 12,
    marginLeft: 4,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
    marginHorizontal: 16,
  },
  profileStats: {
    flexDirection: 'row',
    marginTop: 12,
    padding: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 16,
  },
  stat: {
    fontSize: 14,
  },
  quickActionsWrapper: {
    position: 'relative',
    zIndex: 2,
  },
  quickActions: {
    flexDirection: 'row',
    marginHorizontal: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  actionText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '500',
  },
  compactHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  compactTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 70, // Space for avatar
  },
});