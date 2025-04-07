import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ActionButtonsProps {
  onSave: () => void;
  onDelete: () => void;
  onPublish: () => void;
  saveColor: string;
  deleteColor: string;
  publishColor: string;
  isDisabled?: boolean;
}

export const ActionButtons = ({
  onSave,
  onDelete,
  onPublish,
  saveColor,
  deleteColor,
  publishColor,
  isDisabled = false
}: ActionButtonsProps) => {
  return (
    <View style={styles.actionsContainer}>
      <TouchableOpacity 
        style={[styles.actionButton, { backgroundColor: saveColor }]} 
        onPress={onSave}
        disabled={isDisabled}
      >
        <Ionicons name="save-outline" size={20} color="#fff" />
      </TouchableOpacity>
    
      <TouchableOpacity 
        style={[styles.actionButton, { backgroundColor: deleteColor }]} 
        onPress={onDelete}
        disabled={isDisabled}
      >
        <Ionicons name="trash-outline" size={20} color="#fff" />
      </TouchableOpacity>
    
      <TouchableOpacity 
        style={[styles.actionButton, { backgroundColor: publishColor }]} 
        onPress={onPublish}
        disabled={isDisabled}
      >
        <Ionicons name="send" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 100,
    flex: 1,
    marginHorizontal: 4,
  },
});
