import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { BlurView } from 'expo-blur';

interface SettingsSectionProps {
  title?: string;
  footer?: string;
  children: React.ReactNode;
}

export function SettingsSection({ title, footer, children }: SettingsSectionProps) {
  const { theme, colorMode } = useTheme();
  
  return (
    <View style={styles.container}>
      {title && (
        <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>
          {title}
        </Text>
      )}
      
      <BlurView
        intensity={5}
        tint={colorMode === 'dark' ? 'dark' : 'light'}
        style={[
          styles.sectionContent, 
          { 
            borderRadius: theme.roundness,
            overflow: 'hidden',
          }
        ]}
      >
        <View style={[
          styles.innerContainer, 
          { backgroundColor: colorMode === 'dark' ? 'rgba(26, 27, 31, 0.8)' : 'rgba(255, 255, 255, 0.8)' }
        ]}>
          {children}
        </View>
      </BlurView>
      
      {footer && (
        <Text style={[styles.sectionFooter, { color: theme.colors.textSecondary }]}>
          {footer}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 16,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  sectionContent: {
    marginHorizontal: 16,
  },
  innerContainer: {
    width: '100%',
  },
  sectionFooter: {
    fontSize: 13,
    marginTop: 8,
    marginHorizontal: 16,
    opacity: 0.7,
  },
});