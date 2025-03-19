import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/contexts/ThemeContext';

interface FloatingActionButtonProps {
  onPress?: () => void;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ 
  onPress 
}) => {
  const { theme, colorMode } = useTheme();
  
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (onPress) onPress();
  };
  
  return (
    <View style={styles.fabContainer}>
      <BlurView
        intensity={40}
        tint={colorMode === 'dark' ? 'dark' : 'light'}
        style={[
          styles.fabBlur,
          {
            backgroundColor: colorMode === 'dark' 
              ? 'rgba(20, 19, 22, 0.5)'
              : 'rgba(248, 248, 250, 0.5)',
          }
        ]}
        experimentalBlurMethod='dimezisBlurView'
      >
        <TouchableOpacity 
          style={[styles.fab, { backgroundColor: theme.colors.cyberPink }]}
          onPress={handlePress}
        >
          <Ionicons name="add" size={28} color="#FFF" />
        </TouchableOpacity>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  fabContainer: {
    position: 'absolute',
    right: 20,
    bottom: 80,
    borderRadius: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    overflow: 'hidden',
  },
  fabBlur: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fab: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
