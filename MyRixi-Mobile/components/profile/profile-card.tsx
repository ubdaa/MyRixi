import { Profile } from "@/types/profile";
import { Image, StyleSheet, Text, View } from "react-native";

export function ProfileCard({ profile }: { profile: Profile }) {
  return (
    <View style={styles.container}>
      <Image
        style={styles.cover}
        source={{ uri: profile.coverPicture.url }}
      />
      <View style={styles.profileContainer}>
        <Image
          style={styles.profilePicture}
          source={{ uri: profile.profilePicture.url }}
        />
        <Text style={styles.displayName}>{profile.displayName}</Text>
        <Text style={styles.bio}>{profile.bio}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 10,
    overflow: "hidden",
  },
  cover: {
    width: "100%",
    height: 200,
  },
  profileContainer: {
    padding: 20,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  displayName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  bio: {
    fontSize: 16,
  },
});