import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '@/contexts/ThemeContext';

interface HeaderProps {
  scrollY: Animated.Value;
  username: string;
  avatarUrl: string;
  onProfilePress: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  scrollY, 
  username,
  avatarUrl,
  onProfilePress
}) => {
  const { theme, colorMode } = useTheme();
  
  // Animation pour l'effet de parallaxe
  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -50],
    extrapolate: 'clamp',
  });

  // Animation pour l'effet de fondu du header
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 60, 90],
    outputRange: [1, 0.8, 0],
    extrapolate: 'clamp',
  });
  
  return (
    <Animated.View
      style={[
        styles.header,
        {
          transform: [{ translateY: headerTranslateY }],
          opacity: headerOpacity,
        }
      ]}
    >
      <BlurView
        intensity={20}
        tint={colorMode === 'dark' ? 'dark' : 'light'}
        style={[
          styles.headerBlur,
          {
            backgroundColor: 
              colorMode === 'dark' 
                ? 'rgba(20, 19, 22, 0.7)' 
                : 'rgba(248, 248, 250, 0.7)',
          }
        ]}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={[
              styles.headerGreeting,
              { color: theme.colors.textSecondary }
            ]}>
              Bonjour,
            </Text>
            <Text style={[
              styles.headerName,
              { color: theme.colors.textPrimary }
            ]}>
              {username}
            </Text>
          </View>
          
          <TouchableOpacity
            onPress={onProfilePress}
            style={styles.profileButton}
          >
            <BlurView
              intensity={30}
              tint={colorMode === 'dark' ? 'dark' : 'light'}
              style={styles.profileBlur}
              experimentalBlurMethod='dimezisBlurView'
            >
              <Image 
                source={{ uri: avatarUrl }} 
                style={styles.profileImage}
              />
              <View style={[
                styles.statusIndicator, 
                { backgroundColor: theme.colors.synthGreen }
              ]} />
            </BlurView>
          </TouchableOpacity>
        </View>
      </BlurView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  headerBlur: {
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60, // Pour compenser la StatusBar
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  headerGreeting: {
    fontSize: 16,
    fontWeight: '400',
  },
  headerName: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  profileButton: {
    height: 42,
    width: 42,
    overflow: 'hidden',
  },
  profileBlur: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    height: 36,
    width: 36,
    borderRadius: 18,
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
});
