import { useProfile } from "@/contexts/ProfileContext";
import { useEffect } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View, Text, RefreshControl } from "react-native";
import ProfileHeader from "@/components/profile/profile-header";
import ProfileDetails from "@/components/profile/profile-details";

export default function ProfileScreen() {
  const { fetchProfile, profile, loading } = useProfile();

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1DA1F2" />
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Erreur lors du chargement du profil.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} refreshControl={
      <RefreshControl refreshing={loading} onRefresh={fetchProfile} />
    }>
      <ProfileHeader profile={profile} />
      <ProfileDetails profile={profile} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
