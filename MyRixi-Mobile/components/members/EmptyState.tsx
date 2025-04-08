import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

type EmptyStateProps = {
  searchQuery: string;
};

export const EmptyState = ({ searchQuery }: EmptyStateProps) => {
  const { theme } = useTheme();
  
  return (
    <View style={styles.emptyContainer}>
      <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
        {searchQuery.trim() !== '' 
          ? "Aucun membre ne correspond à cette recherche" 
          : "Aucun membre trouvé"}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
});
