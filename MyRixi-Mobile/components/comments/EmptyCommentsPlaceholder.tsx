import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';

export default function EmptyCommentsPlaceholder() {
  const { theme } = useTheme();
  
  return (
    <View style={styles.emptyCommentsContainer}>
      <Ionicons name="chatbubbles-outline" size={48} color={theme.colors.textSecondary} />
      <Text style={[styles.emptyCommentsText, { color: theme.colors.textSecondary }]}>
        Pas encore de commentaires
      </Text>
      <Text style={[styles.emptyCommentsSubText, { color: theme.colors.textSecondary }]}>
        Soyez le premier à commenter !
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  emptyCommentsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyCommentsText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
  },
  emptyCommentsSubText: {
    fontSize: 14,
    marginTop: 8,
  },
});
