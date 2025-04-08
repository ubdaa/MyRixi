import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { SearchBar } from '@/components/home/SearchBar';

type MembersHeaderProps = {
  searchQuery: string;
  onSearch: (text: string) => void;
  totalMembers: number;
  isLoading: boolean;
};

export const MembersHeader = ({ 
  searchQuery, 
  onSearch, 
  totalMembers, 
  isLoading 
}: MembersHeaderProps) => {
  const { theme } = useTheme();

  return (
    <View style={styles.headerContainer}>
      <SearchBar 
        value={searchQuery} 
        onChangeText={onSearch} 
        placeholder="Rechercher un membre..." 
      />
      {!isLoading && (
        <Text style={[styles.memberCount, { color: theme.colors.textSecondary }]}>
          {totalMembers} membre{totalMembers > 1 ? 's' : ''}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  memberCount: {
    marginTop: 8,
    marginBottom: 8,
    fontSize: 14,
    fontStyle: 'italic',
  },
});
