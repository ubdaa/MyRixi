import React from 'react';
import { 
  StyleSheet, 
  TouchableOpacity, 
  View, 
  ViewStyle 
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/contexts/ThemeContext';

interface FloatingActionButtonProps {
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  accentColor?: string;
  position?: 'bottomRight' | 'bottomLeft' | 'topRight' | 'topLeft';
  style?: ViewStyle;
  size?: 'small' | 'medium' | 'large';
  withHaptics?: boolean;
}

export function FloatingActionButton ({
  onPress,
  icon = 'add',
  accentColor,
  position = 'bottomRight',
  style,
  size = 'medium',
  withHaptics = true,
}: FloatingActionButtonProps) {
  const { theme, colorMode } = useTheme();
  
  // Tailles du FAB
  const sizes = {
    small: { outer: 50, inner: 42, icon: 22 },
    medium: { outer: 60, inner: 50, icon: 28 },
    large: { outer: 70, inner: 60, icon: 32 },
  };
  
  const currentSize = sizes[size];
  const buttonColor = accentColor || theme.colors.cyberPink;
  
  const getPositionStyle = () => {
    switch (position) {
      case 'bottomRight':
        return { bottom: 20, right: 20 };
      case 'bottomLeft':
        return { bottom: 20, left: 20 };
      case 'topRight':
        return { top: 20, right: 20 };
      case 'topLeft':
        return { top: 20, left: 20 };
      default:
        return { bottom: 20, right: 20 };
    }
  };

  const handlePress = () => {
    if (withHaptics) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onPress();
  };

  return (
    <View style={[
      styles.container, 
      getPositionStyle(),
      { 
        width: currentSize.outer, 
        height: currentSize.outer,
        borderRadius: currentSize.outer / 2,
      },
      style
    ]}>
      <BlurView
        intensity={25}
        tint={colorMode === 'dark' ? 'dark' : 'light'}
        style={[
          styles.blurView,
          {
            backgroundColor: colorMode === 'dark' 
              ? 'rgba(20, 19, 22, 0.5)'
              : 'rgba(248, 248, 250, 0.5)',
          }
        ]}
      >
        <TouchableOpacity 
          style={[
            styles.button, 
            { 
              backgroundColor: buttonColor,
              width: currentSize.inner,
              height: currentSize.inner,
              borderRadius: currentSize.inner / 2,
            }
          ]}
          onPress={handlePress}
          activeOpacity={0.8}
        >
          <Ionicons name={icon} size={currentSize.icon} color="#FFF" />
        </TouchableOpacity>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    overflow: 'hidden',
  },
  blurView: {
    width: '100%',
    height: '100%',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});