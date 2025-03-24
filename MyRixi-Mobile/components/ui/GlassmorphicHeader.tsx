import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  Animated, 
  ViewStyle 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';

interface GlassmorphicHeaderProps {
  title: string;
  scrollY: Animated.Value;
  onActionPress?: () => void;
  actionIcon?: keyof typeof Ionicons.glyphMap;
  actionColor?: string;
  style?: ViewStyle;
}

export function GlassmorphicHeader ({
  title,
  scrollY,
  onActionPress,
  actionIcon = 'add',
  actionColor,
  style
}: GlassmorphicHeaderProps) {
  const { theme, colorMode } = useTheme();

  // Animations basées sur le scroll
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 1],
    extrapolate: 'clamp'
  });
  
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [120, 60],
    extrapolate: 'clamp'
  });
  
  const titleSize = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [32, 24],
    extrapolate: 'clamp'
  });

  // Couleur d'action par défaut
  const buttonColor = actionColor || theme.colors.cyberPink;

  return (
    <Animated.View style={[
      styles.headerContainer,
      {
        height: headerHeight,
        opacity: headerOpacity,
      },
      style
    ]}>
      <BlurView 
        intensity={theme.glassmorphism.blur} 
        tint={colorMode === "dark" ? "dark" : "light"}
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: colorMode === "dark" 
              ? "rgba(20, 19, 22, 0.7)" 
              : "rgba(248, 248, 250, 0.7)"
          }
        ]}
        experimentalBlurMethod='dimezisBlurView'
      />
      
      <SafeAreaView edges={["top"]} style={styles.headerContent}>
        <Animated.Text style={[
          styles.headerTitle,
          { 
            fontSize: titleSize,
            color: theme.colors.textPrimary
          }
        ]}>
          {title}
        </Animated.Text>
        
        {onActionPress && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={onActionPress}
            activeOpacity={0.8}
          >
            <BlurView 
              intensity={theme.glassmorphism.blur}
              tint={colorMode === "dark" ? "dark" : "light"}
              style={[
                styles.actionButtonBlur,
                {
                  backgroundColor: buttonColor + "30",
                }
              ]}
              experimentalBlurMethod='dimezisBlurView'
            >
              <Ionicons name={actionIcon} size={24} color={buttonColor} />
            </BlurView>
          </TouchableOpacity>
        )}
      </SafeAreaView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontWeight: 'bold',
  },
  actionButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
  },
  actionButtonBlur: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});