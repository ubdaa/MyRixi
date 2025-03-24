import { useTheme } from '@/contexts/ThemeContext';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export interface BadgeProps {
  text: string;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
}

export function Badge({ text, color = 'primary' }: BadgeProps) {
  const { theme } = useTheme();

  let badgeColor = theme.colors.cyberPink;
  let badgeTextColor = "#fff";

  switch (color) {
    case 'primary':
      badgeColor = theme.colors.holoTurquoise;
      badgeTextColor = "#000";
      break;
    case 'secondary':
      badgeColor = theme.colors.technoBlue;
      break;
    case 'success':
      badgeColor = theme.colors.synthGreen;
      break;
    case 'warning':
      badgeColor = theme.colors.solarGold;
      break;
    case 'danger':
      badgeColor = theme.colors.neoRed;
      break;
  }

  return (
    <View style={[styles.badge, { backgroundColor: badgeColor }]}>
      <Text style={[styles.badgeText, { color: badgeTextColor }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
});