import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Animated,
} from 'react-native';
import { router } from 'expo-router';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/contexts/ThemeContext';
import { Community } from '@/types/community';
import { fetchCommunityMembers } from '@/services/communityService';

interface CommunityCardProps {
  community: Community;
  index: number;
}

export function CommunityCard ({ community, index }: CommunityCardProps) {
  const { theme } = useTheme();
  const animatedValue = useRef(new Animated.Value(0)).current;
  const [totalMembers, setTotalMembers] = useState(0);
  
    const loadMembers = useCallback(
      async () => {
        if (!community.id || Array.isArray(community.id)) return;
  
        try {
          const response = await fetchCommunityMembers(community.id, 1, 1, "");
  
          setTotalMembers(response.totalCount);
        } catch (error) {
          console.error("Failed to load community members:", error);
        } finally {
        }
      },
      [community.id]
    );
  
    useEffect(() => {
      loadMembers();
    }, []);
  
  // Animation d'entrée échelonnée
  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 500,
      delay: index * 100,
      useNativeDriver: true,
    }).start();
  }, []);
  
  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 0],
  });
  
  const opacity = animatedValue;
  
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/community/${community.id}/feed`);
  };
  
  return (
    <Animated.View style={[
      styles.communityCardContainer,
      { 
        opacity, 
        transform: [{ translateY }] 
      }
    ]}>
      <TouchableOpacity onPress={handlePress} activeOpacity={0.9}>
        <ImageBackground
          source={{ uri: community.coverUrl }}
          style={styles.communityImage}
          imageStyle={{ borderRadius: theme.roundness }}
        >
          <BlurView
            intensity={60}
            tint="dark"
            style={styles.communityOverlay}
            experimentalBlurMethod='dimezisBlurView'
          >
            <Text style={styles.communityName}>{community.name}</Text>
            <Text style={styles.communityMembers}>
              {totalMembers} membres
            </Text>
          </BlurView>
        </ImageBackground>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  communityCardContainer: {
    marginRight: 12,
  },
  communityImage: {
    width: 160,
    height: 100,
    justifyContent: 'flex-end',
  },
  communityOverlay: {
    padding: 10,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  communityName: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  communityMembers: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
  },
});
