import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '@/contexts/ThemeContext';

interface GlassCardProps extends ViewProps {
  intensity?: number;
  blurTint?: 'dark' | 'light' | 'default';
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  style,
  intensity,
  blurTint,
  ...props
}) => {
  const { theme, colorMode } = useTheme();
  
  // Déterminer l'intensité du flou et la couleur de fond en fonction du thème
  const blurIntensity = intensity || theme.glassmorphism.blur;
  
  // Couleurs ajustées pour meilleur contraste avec les backgrounds
  const backgroundColor = colorMode === 'dark' 
    ? `rgba(36, 37, 42, ${theme.glassmorphism.opacity})` 
    : `rgba(255, 255, 255, ${theme.glassmorphism.opacity})`;
    
  // Couleurs pour les bordures du glassmorphisme
  const borderTopColor = colorMode === 'dark' 
    ? 'rgba(255, 255, 255, 0.12)' 
    : 'rgba(255, 255, 255, 0.8)';
  
  const borderBottomColor = colorMode === 'dark' 
    ? 'rgba(0, 0, 0, 0.4)' 
    : 'rgba(0, 0, 0, 0.08)';
  
  // Type de flou basé sur le mode couleur
  const defaultBlurTint = colorMode === 'dark' ? 'dark' : 'light';

  return (
    <View style={[styles.container, { 
      borderRadius: theme.roundness,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: colorMode === 'dark' ? 0.3 : 0.12,
      shadowRadius: 12,
      elevation: 10,
    }, style]} {...props}>
      <BlurView
        style={styles.blurView}
        intensity={blurIntensity}
        tint={blurTint || defaultBlurTint}
        experimentalBlurMethod='dimezisBlurView'
      >
        <View 
          style={[
            styles.content, 
            { 
              backgroundColor,
              borderWidth: 1,
              borderColor: borderBottomColor,
              borderRadius: theme.roundness - 1,
            }
          ]}
        >
          {children}
        </View>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  blurView: {
    flex: 1,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    padding: 16,
  }
});