import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

type LoadingIndicatorProps = {
  size?: 'small' | 'large';
};

export const LoadingIndicator = ({ size = 'large' }: LoadingIndicatorProps) => {
  const { theme } = useTheme();
  
  return (
    <View style={styles.loaderContainer}>
      <ActivityIndicator size={size} color={theme.colors.cyberPink} />
    </View>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    padding: 20,
    alignItems: 'center',
  },
});
