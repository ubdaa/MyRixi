import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GlassInput } from '@/components/ui/GlassInput';
import { EmptyState } from './EmptyState';
import { TagItem } from './TagItem';

interface Tag {
  id: string;
  name: string;
  color: string;
}

interface TagsSectionProps {
  tags: Tag[];
  newTag: string;
  onChangeNewTag: (text: string) => void;
  onAddTag: () => void;
  onRemoveTag: (id: string) => void;
  textColor: string;
  accentColor: string;
  textSecondary: string;
  dividerColor: string;
}

export const TagsSection = ({
  tags,
  newTag,
  onChangeNewTag,
  onAddTag,
  onRemoveTag,
  textColor,
  accentColor,
  textSecondary,
  dividerColor,
}: TagsSectionProps) => {
  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>Tags</Text>
        <View style={styles.tagInputContainer}>
          <GlassInput
            placeholder="Ajouter un tag"
            value={newTag}
            onChangeText={onChangeNewTag}
            containerStyle={{ flex: 1, marginRight: 10, marginVertical: 0 }}
            accentColor={accentColor}
            onSubmitEditing={onAddTag}
            returnKeyType="done"
          />
          <TouchableOpacity 
            style={[styles.tagAddButton, { backgroundColor: accentColor }]} 
            onPress={onAddTag}
            disabled={!newTag.trim()}
          >
            <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.tagsContainer}>
        {tags.length > 0 ? (
          <View style={styles.tagsList}>
            {tags.map(tag => (
              <TagItem 
                key={tag.id}
                id={tag.id}
                name={tag.name}
                color={tag.color}
                onRemove={onRemoveTag}
              />
            ))}
          </View>
        ) : (
          <EmptyState 
            icon="tag-outline" 
            message="Aucun tag ajouté" 
            color={textSecondary}
            borderColor={dividerColor}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  tagInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 10,
  },
  tagAddButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagsContainer: {
    marginTop: 5,
  },
  tagsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
