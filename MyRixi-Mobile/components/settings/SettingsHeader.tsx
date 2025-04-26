import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { NeoButton } from '@/components/ui/NeoButton';
import { useRouter } from 'expo-router';

interface SettingsHeaderProps {
  title: string;
}

export function SettingsHeader({ title }: SettingsHeaderProps) {
  const { theme } = useTheme();
  const router = useRouter();
  
  return (
    <View style={[
      styles.container,
      { backgroundColor: theme.colors.background1 }
    ]}>
      <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
        {title}
      </Text>
      
      <NeoButton
        title="Retour"
        onPress={() => router.back()}
        variant="secondary"
        size="small"
        accentColor={theme.colors.technoBlue}
        style={styles.backButton}
        textStyle={styles.backButtonText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  backButton: {
    minWidth: 80,
  },
  backButtonText: {
    fontSize: 14,
  },
});