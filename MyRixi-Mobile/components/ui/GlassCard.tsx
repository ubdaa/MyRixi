import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import { useTheme } from '@/contexts/ThemeContext';

interface GlassCardProps extends ViewProps {
  intensity?: number;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  style,
  intensity,
  ...props
}) => {
  const { theme, colorMode } = useTheme();
  
  // Déterminer l'intensité du flou et la couleur de fond en fonction du thème
  const blurIntensity = intensity || theme.glassmorphism.blur;
  const backgroundColor = colorMode === 'dark' 
    ? `rgba(26, 27, 31, ${theme.glassmorphism.opacity})` 
    : `rgba(255, 255, 255, ${theme.glassmorphism.opacity})`;
  
  // Type de flou basé sur le mode couleur
  const blurType = colorMode === 'dark' ? 'dark' : 'light';

  return (
    <View style={[styles.container, { 
      borderRadius: theme.roundness,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: colorMode === 'dark' ? 0.25 : 0.08,
      shadowRadius: 8,
      elevation: 8,
    }, style]} {...props}>
      <BlurView
        style={styles.blurView}
        blurType={blurType}
        blurAmount={blurIntensity}
        reducedTransparencyFallbackColor={backgroundColor}
      >
        <View style={[styles.content, { backgroundColor }]}>
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