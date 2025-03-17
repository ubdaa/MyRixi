import React, { useState } from 'react';
import { 
  StyleSheet, 
  TextInput, 
  View, 
  Text,
  ViewStyle,
  TextStyle,
  TextInputProps,
  Animated,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface GlassInputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  inputStyle?: TextStyle;
  accentColor?: string;
}

export const GlassInput: React.FC<GlassInputProps> = ({
  label,
  error,
  containerStyle,
  labelStyle,
  inputStyle,
  accentColor,
  onFocus,
  onBlur,
  ...restProps
}) => {
  const { theme, colorMode } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  
  const focusAnim = React.useRef(new Animated.Value(0)).current;

  const handleFocus = (e: any) => {
    setIsFocused(true);
    Animated.timing(focusAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
    onFocus && onFocus(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    Animated.timing(focusAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
    onBlur && onBlur(e);
  };

  // Couleur d'accent prédéfinie ou personnalisée
  const actualAccentColor = accentColor || theme.colors.technoBlue;
  
  // Couleurs dynamiques basées sur l'état et le thème
  const backgroundColor = colorMode === 'dark' 
    ? 'rgba(26, 27, 31, 0.5)'
    : 'rgba(255, 255, 255, 0.7)';
  
  const borderColor = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [
      colorMode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
      actualAccentColor,
    ],
  });
  
  const shadowOpacity = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.3],
  });

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text 
          style={[
            styles.label, 
            { 
              color: error 
                ? theme.colors.cyberPink 
                : isFocused 
                  ? actualAccentColor 
                  : theme.colors.textSecondary 
            },
            labelStyle
          ]}
        >
          {label}
        </Text>
      )}
      
      <Animated.View
        style={[
          styles.inputContainer,
          {
            backgroundColor,
            borderColor,
            borderRadius: theme.roundness,
            borderWidth: 1,
            shadowColor: actualAccentColor,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity,
            shadowRadius: 8,
            elevation: isFocused ? 4 : 0,
          },
        ]}
      >
        <TextInput
          style={[
            styles.input,
            { 
              color: theme.colors.textPrimary,
            },
            inputStyle
          ]}
          placeholderTextColor={theme.colors.textSecondary + '99'}
          onFocus={handleFocus}
          onBlur={handleBlur}
          selectionColor={actualAccentColor}
          {...restProps}
        />
      </Animated.View>
      
      {error && (
        <Text style={[styles.error, { color: theme.colors.cyberPink }]}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  label: {
    marginBottom: 6,
    fontSize: 14,
    fontWeight: '500',
  },
  inputContainer: {
    overflow: 'hidden',
  },
  input: {
    padding: 12,
    fontSize: 16,
  },
  error: {
    fontSize: 12,
    marginTop: 4,
  },
});