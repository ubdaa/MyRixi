import React, { useEffect, useRef } from 'react';
import { Profile } from "@/types/profile";
import { Animated, Image, StyleSheet, Text, View } from "react-native";
import { BlurView } from 'expo-blur';

export default function ProfileHeader({ profile }: { profile: Profile }) {
  const profileScale = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animation d'apparition du profile picture puis des textes
    Animated.sequence([
      Animated.timing(profileScale, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.coverContainer}>
        <Image style={styles.coverImage} source={{ uri: profile.coverPicture.url }} />
        <BlurView intensity={50} tint="dark" style={styles.blurOverlay} />
      </View>
      <View style={styles.profileContainer}>
        <Animated.Image
          style={[styles.profilePicture, { transform: [{ scale: profileScale }] }]}
          source={{ uri: profile.profilePicture.url }}
        />
        <Animated.View style={[styles.textContainer, { opacity: textOpacity }]}>
          <Text style={styles.displayName}>{profile.displayName}</Text>
          <Text style={styles.username}>@{profile.user.userName}</Text>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
  },
  coverContainer: {
    position: 'relative',
  },
  coverImage: {
    width: "100%",
    height: 180,
  },
  blurOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  profileContainer: {
    alignItems: "center",
    marginTop: -40, // Permet à l'image de se superposer à la couverture
  },
  profilePicture: {
    width: 80,
    height: 80,
    borderRadius: 15,
    borderWidth: 3,
    borderColor: "#fff",
  },
  textContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  displayName: {
    fontSize: 22,
    fontWeight: "bold",
    marginRight: 5,
    color: "#333",
  },
  username: {
    fontSize: 16,
    color: "gray",
  },
});
