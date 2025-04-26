import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Switch } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

interface SettingsItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  tint?: string;
  showChevron?: boolean;
}

export function SettingsItem({
  icon,
  title,
  subtitle,
  onPress,
  rightElement,
  tint,
  showChevron = true,
}: SettingsItemProps) {
  const { theme } = useTheme();
  
  return (
    <TouchableOpacity
      style={[
        styles.container,
        { 
          backgroundColor: theme.colors.background2,
          borderBottomColor: theme.colors.divider,
        }
      ]}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      {/* Icon container with tint color */}
      <View style={[styles.iconContainer, { backgroundColor: tint || theme.colors.technoBlue }]}>
        {icon}
      </View>
      
      {/* Text content */}
      <View style={styles.textContainer}>
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
          {title}
        </Text>
        {subtitle && (
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            {subtitle}
          </Text>
        )}
      </View>
      
      {/* Right element (switch, value, etc.) */}
      <View style={styles.rightContainer}>
        {rightElement}
        
        {/* Show chevron only if onPress exists and showChevron is true */}
        {onPress && showChevron && (
          <Ionicons
            name="chevron-forward"
            size={20}
            color={theme.colors.textSecondary}
            style={styles.chevron}
          />
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    marginLeft: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chevron: {
    marginLeft: 8,
  },
});