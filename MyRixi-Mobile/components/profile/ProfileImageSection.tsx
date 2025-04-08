import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import { ImagePicker } from '@/components/ui/ImagePicker';

interface ProfileImageSectionProps {
  banner: string;
  profilePicture: string;
  onBannerSelected: (uri: string) => void;
  onProfilePictureSelected: (uri: string) => void;
  colorMode: 'light' | 'dark';
  backgroundcolor: string;
  textSecondary: string;
}

export const ProfileImageSection: React.FC<ProfileImageSectionProps> = ({
  banner,
  profilePicture,
  onBannerSelected,
  onProfilePictureSelected,
  colorMode,
  backgroundcolor,
  textSecondary
}) => {
  
  return (
    <>
      <ImagePicker
        style={styles.bannerContainer}
        aspect={[16, 9]}
        onImageSelected={(result) => onBannerSelected(result.uri)}
      >
        {banner ? (
          <Image
            source={banner}
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
              {color: textSecondary}
            ]}>
              Ajouter une bannière
            </Text>
          </LinearGradient>
        )}
      </ImagePicker>

      <ImagePicker
        style={[
          styles.profilePictureContainer,
          {
            borderColor: backgroundcolor,
            shadowColor: colorMode === "dark" ? "#000" : "#000",
          }
        ]}
        aspect={[1, 1]}
        onImageSelected={(result) => onProfilePictureSelected(result.uri)}
      >
        {profilePicture ? (
          <Image
            source={profilePicture}
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
      </ImagePicker>
    </>
  );
};

const styles = StyleSheet.create({
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
});
