import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';

interface SectionHeaderProps {
  title: string;
  onPress?: () => void;
  showSeeAll?: boolean;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  onPress,
  showSeeAll = true,
}) => {
  const { theme } = useTheme();
  
  return (
    <View style={styles.sectionHeader}>
      <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
        {title}
      </Text>
      
      {showSeeAll && (
        <TouchableOpacity 
          onPress={onPress}
          style={styles.seeAllButton}
        >
          <Text style={[styles.seeAllText, { color: theme.colors.technoBlue }]}>
            Voir tout
          </Text>
          <Ionicons name="chevron-forward" size={16} color={theme.colors.technoBlue} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '500',
    marginRight: 4,
  },
});
