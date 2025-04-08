import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import * as FileSystem from 'expo-file-system';

import { useTheme } from "@/contexts/ThemeContext";
import { GlassInput } from "@/components/ui/GlassInput";
import { NeoButton } from "@/components/ui/NeoButton";
import { fetchProfileById, updateProfile, UpdateProfile } from "@/services/profileService";
import { ProfileImageSection } from "@/components/profile/ProfileImageSection";
import { ReactNativeFile } from "@/services/postService";

export default function EditProfile() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme, colorMode } = useTheme();
  
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    displayName: "",
    bio: "",
    profilePicture: "",
    banner: "",
    profilePictureFile: null as ReactNativeFile | null,
    bannerFile: null as ReactNativeFile | null
  });

  useEffect(() => {
    const loadUserProfile = async () => {
      if (id) {
        try {
          const profile = await fetchProfileById(id);
          setFormData({
            displayName: profile.displayName || profile.pseudonym || "",
            bio: profile.bio || "",
            profilePicture: profile.profilePicture?.url || "",
            banner: profile.coverPicture?.url || "",
            profilePictureFile: null,
            bannerFile: null
          });
        } catch (error) {
          console.error("Failed to load profile", error);
          Alert.alert("Erreur", "Échec du chargement du profil.");
          router.back();
        }
      }
    };

    loadUserProfile();
  }, [id]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const createFileFromUri = async (uri: string, fieldName: string): Promise<ReactNativeFile | null> => {
    // Only process URIs that are local files (not network URLs from existing images)
    if (!uri || uri.startsWith('http')) return null;
    
    try {
      const fileInfo = await FileSystem.getInfoAsync(uri);
      if (!fileInfo.exists) return null;
      
      // Get file name from the URI
      const fileName = uri.split('/').pop() || `${fieldName}_${Date.now()}.jpg`;
      
      // Get mime type (assuming images for simplicity)
      const mimeType = uri.endsWith('.png') ? 'image/png' : 'image/jpeg';
      
      return {
        uri,
        name: fileName,
        type: mimeType
      } as ReactNativeFile;
    } catch (error) {
      console.error('Error creating file from URI:', error);
      return null;
    }
  };

  const handleBannerSelected = async (uri: string) => {
    const bannerFile = await createFileFromUri(uri, 'banner');
    setFormData(prev => ({ 
      ...prev, 
      banner: uri,
      bannerFile: bannerFile
    }));
  };

  const handleProfilePictureSelected = async (uri: string) => {
    const profileFile = await createFileFromUri(uri, 'profile');
    setFormData(prev => ({ 
      ...prev, 
      profilePicture: uri,
      profilePictureFile: profileFile
    }));
  };

  const handleSave = async () => {
    if (!formData.displayName.trim()) {
      Alert.alert("Erreur", "Le nom est requis.");
      return;
    }

    setIsLoading(true);
    try {
      // Create an UpdateProfile object with the correct data format
      const profileData: UpdateProfile = {
        name: formData.displayName.trim(),
        bio: formData.bio.trim(),
        profileFile: formData.profilePictureFile || undefined,
        coverFile: formData.bannerFile || undefined
      };

      // Call the actual API method
      await updateProfile(id as string, profileData);
      
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      Alert.alert(
        "Succès", 
        "Votre profil a été mis à jour avec succès.",
        [{ text: "OK", onPress: () => router.back() }]
      );
    } catch (error) {
      console.error("Failed to update profile", error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Erreur", "Échec de la mise à jour du profil.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: theme.colors.background1}}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{flex: 1}}
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
        >
          <Text style={[styles.pageTitle, {color: theme.colors.textPrimary}]}>
            Édition du profil
          </Text>

          <ProfileImageSection 
            banner={formData.banner}
            profilePicture={formData.profilePicture}
            onBannerSelected={handleBannerSelected}
            onProfilePictureSelected={handleProfilePictureSelected}
            colorMode={colorMode}
            backgroundcolor={theme.colors.background1}
            textSecondary={theme.colors.textSecondary}
          />

          <View style={styles.formContainer}>
            <GlassInput
              label="Nom du profil"
              placeholder="Ton nom de profil sur la plateforme"
              value={formData.displayName}
              onChangeText={(text) => handleChange("displayName", text)}
              accentColor={theme.colors.cyberPink}
              containerStyle={styles.inputContainer}
            />

            <GlassInput
              label="Biographie"
              placeholder="A propos de toi..."
              value={formData.bio}
              onChangeText={(text) => handleChange("bio", text)}
              accentColor={theme.colors.technoBlue}
              multiline
              numberOfLines={5}
              containerStyle={styles.inputContainer}
              inputStyle={styles.bioInput}
            />

            <View style={styles.buttonContainer}>
              <NeoButton
                title="Annuler"
                onPress={() => router.back()}
                variant="outline"
                style={styles.cancelButton}
              />
              <NeoButton
                title="Sauvegarder"
                onPress={handleSave}
                loading={isLoading}
                disabled={!formData.displayName.trim()}
                accentColor={theme.colors.cyberPink}
                variant="primary"
                style={styles.saveButton}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    marginLeft: 8,
  },
  formContainer: {
    marginTop: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  bioInput: {
    height: 120,
    textAlignVertical: "top",
    paddingTop: 12,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
  },
  saveButton: {
    flex: 2,
    marginLeft: 8,
  },
});