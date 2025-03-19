import React from 'react';
import {
  StyleSheet,
  Animated,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';

interface AnimatedBackgroundProps {
  scrollY: Animated.Value;
}

export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ scrollY }) => {
  const { theme, colorMode } = useTheme();
  
  // Animation pour le background
  const bgScale = React.useRef(new Animated.Value(1.05)).current;
  const bgTranslateY = scrollY.interpolate({
    inputRange: [-100, 0, 100],
    outputRange: [10, 0, -30],
    extrapolate: 'clamp',
  });
  
  return (
    <Animated.View style={[
      styles.backgroundContainer,
      {
        transform: [
          { scale: bgScale },
          { translateY: bgTranslateY }
        ]
      }
    ]}>
      <LinearGradient
        colors={
          colorMode === 'dark'
            ? ['#141316', '#1E1C24', '#141316']
            : ['#F8F8FA', '#FFFFFF', '#F8F8FA']
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.backgroundGradient}
      >
        {colorMode === 'dark' && (
          <View style={styles.patternContainer}>
            {/* Motif de points à ajouter ici si désiré */}
          </View>
        )}
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
    height: '120%',
    width: '100%',
  },
  backgroundGradient: {
    flex: 1,
  },
  patternContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.05,
  },
});
