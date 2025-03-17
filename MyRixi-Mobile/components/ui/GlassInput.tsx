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
  Pressable
} from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '@/contexts/ThemeContext';

interface GlassInputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  inputStyle?: TextStyle;
  accentColor?: string;
  rightIcon?: React.ReactNode;
}

export const GlassInput: React.FC<GlassInputProps> = ({
  label,
  error,
  containerStyle,
  labelStyle,
  inputStyle,
  accentColor,
  rightIcon,
  onFocus,
  onBlur,
  ...restProps
}) => {
  const { theme, colorMode } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  
  // Animation pour l'effet de focus
  const focusAnim = React.useRef(new Animated.Value(0)).current;
  const inputRef = React.useRef<TextInput>(null);

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
  
  const borderWidth = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 2]
  });
  
  const borderColor = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [
      colorMode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
      actualAccentColor,
    ],
  });
  
  const glowOpacity = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.15]
  });

  return (
    <Pressable 
      style={[styles.container, containerStyle]} 
      onPress={() => inputRef.current?.focus()}
    >
      {label && (
        <Animated.Text 
          style={[
            styles.label, 
            { 
              color: error 
                ? theme.colors.cyberPink 
                : focusAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [theme.colors.textSecondary, actualAccentColor]
                  }) 
            },
            labelStyle
          ]}
        >
          {label}
        </Animated.Text>
      )}
      
      <View style={styles.inputWrapper}>
        <BlurView
          intensity={isFocused ? 20 : 10}
          tint={colorMode === 'dark' ? 'dark' : 'light'}
          style={[styles.blurContainer, { borderRadius: theme.roundness }]}
          experimentalBlurMethod='dimezisBlurView'
        >
          <Animated.View
            style={[
              styles.inputContainer,
              {
                backgroundColor,
                borderColor,
                borderRadius: theme.roundness,
                borderWidth,
              },
            ]}
          >
            <TextInput
              ref={inputRef}
              style={[
                styles.input,
                { 
                  color: theme.colors.textPrimary,
                  flex: rightIcon ? 1 : undefined,
                },
                inputStyle
              ]}
              placeholderTextColor={theme.colors.textSecondary + '99'}
              onFocus={handleFocus}
              onBlur={handleBlur}
              selectionColor={actualAccentColor}
              {...restProps}
            />
            
            {rightIcon && (
              <View style={styles.rightIconContainer}>
                {rightIcon}
              </View>
            )}
          </Animated.View>
        </BlurView>
        
        {/* Effet de lueur sous le champ lorsqu'il est focus */}
        {isFocused && (
          <Animated.View
            style={[
              styles.glow,
              {
                backgroundColor: actualAccentColor,
                opacity: glowOpacity,
                borderRadius: theme.roundness,
              }
            ]}
          />
        )}
      </View>
      
      {error && (
        <Text style={[styles.error, { color: theme.colors.cyberPink }]}>
          {error}
        </Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    width: '100%',
  },
  label: {
    marginBottom: 6,
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  inputWrapper: {
    position: 'relative',
    width: '100%',
  },
  blurContainer: {
    overflow: 'hidden',
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  input: {
    padding: 12,
    fontSize: 16,
    width: '100%',
  },
  rightIconContainer: {
    paddingRight: 12,
  },
  error: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  glow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
    transform: [{ translateY: 4 }],
  }
});