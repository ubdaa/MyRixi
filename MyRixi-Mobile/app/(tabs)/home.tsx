import { useRouter } from "expo-router";
import { View, Text, StyleSheet, Touchable, TouchableOpacity } from "react-native";

export default function Home() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text>Home</Text>
      
      <TouchableOpacity onPress={() => router.push({ pathname: `/community/create`})}>
        <View>
          <Text>Create Community</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
});