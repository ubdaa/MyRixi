import React from 'react';
import { Alert, TouchableOpacity, StyleSheet, ActionSheetIOS, Platform } from 'react-native';
import * as ExpoImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';

interface ImagePickerProps {
  children: React.ReactNode;
  onImageSelected: (result: ExpoImagePicker.ImagePickerAsset) => void;
  aspect?: [number, number];
  style?: any;
  allowsEditing?: boolean;
  quality?: number;
  allowsMultipleSelection?: boolean;
}

export const ImagePicker: React.FC<ImagePickerProps> = ({
  children,
  onImageSelected,
  aspect = [1, 1],
  style,
  allowsEditing = true,
  quality = 0.8,
  allowsMultipleSelection = false,
}) => {
  const showImagePickerOptions = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Annuler', 'Prendre une photo', 'Choisir depuis la galerie'],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            pickImageFromCamera();
          } else if (buttonIndex === 2) {
            pickImageFromGallery();
          }
        }
      );
    } else {
      Alert.alert(
        "Sélectionner une image",
        "Choisissez une source",
        [
          {
            text: "Annuler",
            style: "cancel"
          },
          {
            text: "Prendre une photo",
            onPress: () => pickImageFromCamera()
          },
          {
            text: "Choisir depuis la galerie",
            onPress: () => pickImageFromGallery()
          }
        ]
      );
    }
  };

  const pickImageFromCamera = async () => {
    const permissionResult = await ExpoImagePicker.requestCameraPermissionsAsync();
    
    if (!permissionResult.granted) {
      Alert.alert(
        "Permissions Requises",
        "Vous devez autoriser l'accès à la caméra pour prendre une photo."
      );
      return;
    }

    const result = await ExpoImagePicker.launchCameraAsync({
      allowsEditing,
      aspect,
      quality,
    });

    if (!result.canceled) {
      onImageSelected(result.assets[0]);
    }
  };

  const pickImageFromGallery = async () => {
    const permissionResult = await ExpoImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (!permissionResult.granted) {
      Alert.alert(
        "Permissions Requises",
        "Vous devez autoriser l'accès à la bibliothèque d'images pour sélectionner une image."
      );
      return;
    }

    const result = await ExpoImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing,
      allowsMultipleSelection,
      aspect,
      quality,
    });

    if (!result.canceled) {
      onImageSelected(result.assets[0]);
    }
  };

  return (
    <TouchableOpacity 
      activeOpacity={0.8}
      style={style}
      onPress={showImagePickerOptions}
    >
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
});
