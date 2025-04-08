import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { GlassInput } from '@/components/ui/GlassInput';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export function SearchBar ({ value, onChangeText, placeholder = "Rechercher..." }: SearchBarProps) {
  const { theme } = useTheme();
  
  return (
    <View style={styles.searchContainer}>
      <GlassInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        containerStyle={{ marginBottom: 0 }}
        rightIcon={
          <Ionicons
            name="search"
            size={22}
            color={theme.colors.textSecondary}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
});
