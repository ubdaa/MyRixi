import React, { useEffect, useRef } from 'react';
import { Profile } from "@/types/profile";
import { Animated, StyleSheet, Text, View } from "react-native";
import { BlurView } from 'expo-blur';

export default function ProfileDetails({ profile }: { profile: Profile }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animation d'apparition progressive
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <BlurView intensity={30} tint="light" style={StyleSheet.absoluteFill} />
      <Text style={styles.bio}>{profile.bio || "Aucune bio disponible."}</Text>
      <Text style={styles.joinedDate}>
        Membre depuis {new Date(profile.joinedAt).toLocaleDateString()}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#E1E8ED",
    borderBottomWidth: 1,
    borderBottomColor: "#E1E8ED",
    position: 'relative',
    backgroundColor: "rgba(255,255,255,0.8)",
  },
  bio: {
    fontSize: 16,
    marginBottom: 10,
    color: "#333",
  },
  joinedDate: {
    fontSize: 14,
    color: "gray",
  },
});
