import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { EmptyState } from './EmptyState';
import { ImagePicker } from '../ui/ImagePicker';
import * as ExpoImagePicker from 'expo-image-picker';

interface Media {
  uri: string;
  id: string;
}

interface ImageSectionProps {
  images: Media[];
  onAddImages: (result: any) => void;
  onRemoveImage: (id: string) => void;
  textColor: string;
  accentColor: string;
  textSecondary: string;
  dividerColor: string;
  isSubmitting?: boolean;
}

export const ImageSection = ({
  images,
  onAddImages,
  onRemoveImage,
  textColor,
  accentColor,
  textSecondary,
  dividerColor,
  isSubmitting
}: ImageSectionProps) => {
  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>Images</Text>
        <ImagePicker 
          onImageSelected={(result) => {
            onAddImages(result);
          }}
          style={[styles.addButton, { backgroundColor: accentColor }]} 
          allowsMultipleSelection={true}
          allowsEditing={false}
        >
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.addButtonText}>Ajouter</Text>
        </ImagePicker>
      </View>
      
      {images.length > 0 ? (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.imagesContainer}
          contentContainerStyle={styles.imagesContent}
        >
          {images.map((image) => (
            <View key={image.id} style={styles.imageWrapper}>
              <Image source={{ uri: image.uri }} style={styles.image} />
              <TouchableOpacity 
                style={styles.removeImageButton} 
                onPress={() => onRemoveImage(image.id)}
                disabled={isSubmitting}
              >
                <Ionicons name="close-circle" size={24} color="#FF3B30" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      ) : (
        <EmptyState 
          icon="image-outline" 
          message="Aucune image ajoutée" 
          color={textSecondary} 
          borderColor={dividerColor}
        />
      )}
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
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 30,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 4,
  },
  imagesContainer: {
    paddingVertical: 10,
    maxHeight: 120,
  },
  imagesContent: {
    paddingRight: 16,
  },
  imageWrapper: {
    position: 'relative',
    marginRight: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: 'white',
    borderRadius: 12,
    zIndex: 10,
  },
});