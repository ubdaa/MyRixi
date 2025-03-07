import React from 'react';
import { 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  ActivityIndicator,
  View,
  StyleProp,
  ViewStyle,
  TextStyle, 
  DimensionValue
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

type ButtonSize = 'sm' | 'md' | 'lg';
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
}) => {
  const getButtonStyles = () => {
    const sizeStyles = {
      sm: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
      md: { paddingVertical: 12, paddingHorizontal: 16, borderRadius: 10 },
      lg: { paddingVertical: 16, paddingHorizontal: 20, borderRadius: 12 }
    };
    
    const textSizeStyles = {
      sm: { fontSize: 14 },
      md: { fontSize: 16 },
      lg: { fontSize: 18 }
    };
    
    let variantStyles = {};
    let textVariantStyles = {};
    
    switch (variant) {
      case 'primary':
        variantStyles = { backgroundColor: '#007AFF' };
        textVariantStyles = { color: 'white' };
        break;
      case 'secondary':
        variantStyles = { backgroundColor: '#5e8fe2' };
        textVariantStyles = { color: 'white' };
        break;
      case 'outline':
        variantStyles = { 
          backgroundColor: 'transparent', 
          borderWidth: 1, 
          borderColor: '#007AFF' 
        };
        textVariantStyles = { color: '#007AFF' };
        break;
      case 'ghost':
        variantStyles = { backgroundColor: 'transparent' };
        textVariantStyles = { color: '#007AFF' };
        break;
      case 'danger':
        variantStyles = { backgroundColor: '#FF3B30' };
        textVariantStyles = { color: 'white' };
        break;
    }
    
    return {
      button: {
        ...sizeStyles[size],
        ...variantStyles,
        ...(fullWidth && { width: '100%' as DimensionValue }),
        ...(disabled && { opacity: 0.6 })
      },
      text: {
        ...textSizeStyles[size],
        ...textVariantStyles,
        fontWeight: '600' as '600'
      }
    };
  };
  
  const buttonStyles = getButtonStyles();
  
  const renderContent = () => (
    <View style={styles.contentContainer}>
      {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
      {loading ? (
        <ActivityIndicator 
          color={variant === 'outline' || variant === 'ghost' ? '#007AFF' : 'white'} 
          size={size === 'sm' ? 'small' : 'small'} 
        />
      ) : (
        <Text style={[buttonStyles.text, textStyle]}>
          {title}
        </Text>
      )}
      {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
    </View>
  );

  if (variant === 'primary' || variant === 'secondary') {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        disabled={disabled || loading}
        style={[styles.baseButton, style]}
      >
        <LinearGradient
          colors={
            variant === 'primary' 
              ? ['#0A84FF', '#007AFF'] 
              : ['#5e8fe2', '#4a7fe0']
          }
          style={[styles.gradient, buttonStyles.button]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          {renderContent()}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      disabled={disabled || loading}
      style={[styles.baseButton, buttonStyles.button, style]}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  baseButton: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  gradient: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
});