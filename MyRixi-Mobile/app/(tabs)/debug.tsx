import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "expo-router";
import { View, Text, StyleSheet, Touchable, TouchableOpacity } from "react-native";

export default function Home() {
  const router = useRouter();
  const { logout } = useAuth();

  return (
    <View style={styles.container}>
      <Text>Home</Text>
      
      <TouchableOpacity onPress={() => router.push({ pathname: `/community/create`})}>
        <View>
          <Text>Create Community</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => { logout(); router.replace({ pathname: '/login' }) }}>
        <View>
          <Text>Logout</Text>
        </View>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={async () => { 
        try {
          const response = await fetch('https://api.myrixi.com/communities');
          const data = await response.json();
          console
        } catch (error) {
          console.log(error);
        }
       }}>
        <View>
          <Text>Fetch communities</Text>
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