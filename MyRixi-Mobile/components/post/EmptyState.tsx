import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface EmptyStateProps {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  message: string;
  color: string;
  borderColor: string;
}

export const EmptyState = ({ icon, message, color, borderColor }: EmptyStateProps) => {
  return (
    <View style={[styles.emptyState, { borderColor }]}>
      <MaterialCommunityIcons 
        name={icon} 
        size={36} 
        color={color} 
      />
      <Text style={[styles.emptyText, { color }]}>
        {message}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  emptyState: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    marginTop: 8,
  },
});
