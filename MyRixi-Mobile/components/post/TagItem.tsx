import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface TagItemProps {
  id: string;
  name: string;
  color: string;
  onRemove: (id: string) => void;
}

export const TagItem = ({ id, name, color, onRemove }: TagItemProps) => {
  return (
    <View 
      style={[styles.tag, { backgroundColor: color + '20', borderColor: color }]}
    >
      <Text style={[styles.tagText, { color }]}>
        {name}
      </Text>
      <TouchableOpacity 
        style={styles.removeTagButton} 
        onPress={() => onRemove(id)}
      >
        <Ionicons name="close" size={16} color={color} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
  },
  tagText: {
    fontWeight: '500',
    marginRight: 4,
  },
  removeTagButton: {
    padding: 2,
  },
});
