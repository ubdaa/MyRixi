import React from 'react';
import { StyleSheet, View, Text, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NeoButton } from '@/components/ui/NeoButton';
import { useTheme } from '@/contexts/ThemeContext';

interface Action {
  title: string;
  onPress: () => void;
  accentColor?: string;
}

interface EmptyStateViewProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  message: string;
  primaryAction?: Action;
  secondaryAction?: Action;
  style?: ViewStyle;
}

export function EmptyStateView ({
  icon,
  title,
  message,
  primaryAction,
  secondaryAction,
  style
}: EmptyStateViewProps) {
  const { theme } = useTheme();
  
  return (
    <View style={[styles.container, style]}>
      <Ionicons
        name={icon}
        size={80}
        color={theme.colors.textSecondary}
        style={{ opacity: 0.7 }}
      />
      
      <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
        {title}
      </Text>
      
      <Text style={[styles.message, { color: theme.colors.textSecondary }]}>
        {message}
      </Text>
      
      {(primaryAction || secondaryAction) && (
        <View style={styles.actions}>
          {secondaryAction && (
            <NeoButton
              title={secondaryAction.title}
              onPress={secondaryAction.onPress}
              accentColor={secondaryAction.accentColor || theme.colors.technoBlue}
              style={{ marginRight: primaryAction ? 12 : 0 }}
            />
          )}
          
          {primaryAction && (
            <NeoButton
              title={primaryAction.title}
              onPress={primaryAction.onPress}
              accentColor={primaryAction.accentColor || theme.colors.cyberPink}
            />
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: 400,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});