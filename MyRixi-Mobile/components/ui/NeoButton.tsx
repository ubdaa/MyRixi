import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  ViewStyle, 
  TextStyle, 
  Animated, 
  View,
  ActivityIndicator 
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/contexts/ThemeContext';

interface NeoButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  accentColor?: string;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  size?: 'small' | 'medium' | 'large';
}

export function NeoButton ({
  title,
  onPress,
  variant = 'primary',
  accentColor,
  disabled = false,
  loading = false,
  style,
  textStyle,
  size = 'medium',
}: NeoButtonProps) {
  const { theme, colorMode } = useTheme();
  const [isPressed, setIsPressed] = useState(false);
  const glowAnim = React.useRef(new Animated.Value(0)).current;

  // Détermine la couleur d'accent par défaut
  const defaultAccentColor = theme.colors.cyberPink;
  const buttonAccentColor = accentColor || defaultAccentColor;

  // Animation de lueur cybernétique
  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.5,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [glowAnim]);

  // Fonction pour gérer le retour haptique
  const handlePress = () => {
    if (!disabled && !loading) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onPress();
    }
  };

  // Styles en fonction du mode et de la variante
  const getButtonStyles = () => {
    const sizeStyles = {
      small: { paddingVertical: 8, paddingHorizontal: 16 },
      medium: { paddingVertical: 12, paddingHorizontal: 24 },
      large: { paddingVertical: 16, paddingHorizontal: 32 },
    };

    let backgroundColor;
    let textColor;
    let borderColor;

    switch (variant) {
      case 'primary':
        backgroundColor = buttonAccentColor;
        textColor = '#FFFFFF';
        borderColor = 'transparent';
        break;
      case 'secondary':
        backgroundColor = colorMode === 'dark' ? theme.colors.background2 : theme.colors.background1;
        textColor = buttonAccentColor;
        borderColor = 'transparent';
        break;
      case 'outline':
        backgroundColor = 'transparent';
        textColor = buttonAccentColor;
        borderColor = buttonAccentColor;
        break;
    }

    return {
      container: {
        ...sizeStyles[size],
        backgroundColor,
        borderColor,
        borderWidth: variant === 'outline' ? 1 : 0,
        borderRadius: theme.roundness,
        opacity: disabled ? 0.6 : 1,
      },
      text: {
        color: textColor,
        fontWeight: '600' as '600',
        fontSize: size === 'small' ? 14 : size === 'medium' ? 16 : 18,
      },
    };
  };

  const buttonStyles = getButtonStyles();

  // Glow effect for cybernetic touch
  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.2, 0.4],
  });

  return (
    <View style={[styles.buttonWrapper, style]}>
      {variant === 'primary' && !disabled && (
        <Animated.View 
          style={[
            styles.glow,
            {
              backgroundColor: buttonAccentColor,
              opacity: glowOpacity,
              borderRadius: theme.roundness + 4,
            },
          ]} 
        />
      )}
      
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handlePress}
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
        style={[
          styles.button,
          buttonStyles.container,
          isPressed && styles.buttonPressed
        ]}
      >
        {loading ? (
          <ActivityIndicator color={buttonStyles.text.color} />
        ) : (
          <Text style={[buttonStyles.text, textStyle]}>
            {title}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonWrapper: {
    position: 'relative',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: {
    transform: [{ scale: 0.98 }],
  },
  glow: {
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    zIndex: -1,
  },
});