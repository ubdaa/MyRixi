import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView
} from "react-native";
import { Image } from "expo-image";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";

import { useTheme } from "@/contexts/ThemeContext";
import { GlassInput } from "@/components/ui/GlassInput";
import { NeoButton } from "@/components/ui/NeoButton";
import { fetchProfileById } from "@/services/profileService";

// Placeholder for actual profile service - replace with your actual API calls
const fetchUserProfile = async (userId: string) => {
  // This would be replaced with actual API call
  return {
    displayName: "User " + userId,
    bio: "This is a sample biography. Tell people about yourself!",
    profilePicture: null,
    banner: null
  };
};

const updateUserProfile = async (userId: string, profileData: any) => {
  // This would be replaced with actual API call
  console.log("Updating profile for user", userId, profileData);
  return true;
};

export default function EditProfile() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme, colorMode } = useTheme();
  
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    displayName: "",
    bio: "",
    profilePicture: "",
    banner: ""
  });

  useEffect(() => {
    const loadUserProfile = async () => {
      if (id) {
        try {
          const profile = await fetchProfileById(id);
          setFormData({
            displayName: profile.displayName || profile.pseudonym || "",
            bio: profile.bio || "",
            profilePicture: profile.profilePicture.url || "",
            banner: profile.coverPicture.url || ""
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

  const pickImage = async (type: "profilePicture" | "banner") => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert(
        "Permissions Requis",
        "Vous devez autoriser l'accès à la bibliothèque d'images pour sélectionner une image.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: type === "profilePicture" ? [1, 1] : [16, 9],
      quality: 0.8,
    });

    if (!result.canceled) {
      setFormData(prev => ({
        ...prev,
        [type]: result.assets[0].uri
      }));
    }
  };

  const handleSave = async () => {
    if (!formData.displayName.trim()) {
      Alert.alert("Erreur", "Le nom est requis.");
      return;
    }

    setIsLoading(true);
    try {
      await updateUserProfile(id as string, formData);
      Alert.alert(
        "Succès", 
        "Votre profil a été mis à jour avec succès.",
        [{ text: "OK", onPress: () => router.back() }]
      );
    } catch (error) {
      console.error("Failed to update profile", error);
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

          {/* Banner Image */}
          <TouchableOpacity
            style={styles.bannerContainer}
            activeOpacity={0.8}
            onPress={() => pickImage("banner")}
          >
            {formData.banner ? (
              <Image
                source={formData.banner}
                style={styles.bannerImage}
                contentFit="cover"
              />
            ) : (
              <LinearGradient
                colors={[
                  colorMode === "dark" ? "#2a2a2e" : "#e0e0e0",
                  colorMode === "dark" ? "#1a1b1f" : "#f5f5f5"
                ]}
                style={styles.bannerPlaceholder}
              >
                <Ionicons 
                  name="image-outline" 
                  size={40} 
                  color={colorMode === "dark" ? "#888" : "#aaa"} 
                />
                <Text style={[
                  styles.placeholderText,
                  {color: theme.colors.textSecondary}
                ]}>
                  Ajouter une bannière
                </Text>
              </LinearGradient>
            )}
          </TouchableOpacity>

          {/* Profile Picture */}
          <TouchableOpacity
            style={[
              styles.profilePictureContainer,
              {
                borderColor: theme.colors.background1,
                shadowColor: colorMode === "dark" ? "#000" : "#000",
              }
            ]}
            activeOpacity={0.8}
            onPress={() => pickImage("profilePicture")}
          >
            {formData.profilePicture ? (
              <Image
                source={formData.profilePicture}
                style={styles.profilePicture}
                contentFit="cover"
              />
            ) : (
              <View style={[
                styles.profilePicturePlaceholder,
                {backgroundColor: colorMode === "dark" ? "#2a2a2e" : "#e0e0e0"}
              ]}>
                <MaterialCommunityIcons
                  name="account"
                  size={60}
                  color={colorMode === "dark" ? "#888" : "#aaa"}
                />
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.formContainer}>
            {/* Display Name / Pseudonym Input */}
            <GlassInput
              label="Nom du profil"
              placeholder="Ton nom de profil sur la plateforme"
              value={formData.displayName}
              onChangeText={(text) => handleChange("displayName", text)}
              accentColor={theme.colors.cyberPink}
              containerStyle={styles.inputContainer}
            />

            {/* Biography Input */}
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
  bannerContainer: {
    width: "100%",
    height: 180,
    borderRadius: 16,
    overflow: "hidden",
    position: "relative",
  },
  bannerImage: {
    width: "100%",
    height: "100%",
  },
  bannerPlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  profilePictureContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    position: "absolute",
    top: 180 - 60,
    left: 24,
    borderWidth: 4,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: "hidden",
  },
  profilePicture: {
    width: "100%",
    height: "100%",
    borderRadius: 60,
  },
  profilePicturePlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 60,
  },
  placeholderText: {
    marginTop: 8,
    fontSize: 16,
  },
  editBadge: {
    position: "absolute",
    right: 12,
    bottom: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  editProfileBadge: {
    position: "absolute",
    right: 4,
    bottom: 4,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
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
  infoCard: {
    marginVertical: 16,
    padding: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
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