import useChannel from '@/hooks/useChannel';
import { View, Text, StyleSheet } from 'react-native';
import { Platform } from 'react-native';

// Définissez une URL de base cohérente
const API_URL = Platform.OS === "android" 
  ? 'http://10.0.2.2:5000/v1' 
  : 'http://172.20.10.2:5000/v1';

export default function Home() {
  const channel = useChannel();
  channel.connectSignalR(`${API_URL}/hubs/chat`);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue sur MyRixi</Text>
      <Text style={styles.text}>MyRixi est une application mobile de gestion de tâches.</Text>
      <Text style={styles.text}>Vous pouvez créer des tâches, les marquer comme terminées et les supprimer.</Text>
      <Text style={styles.text}>Vous pouvez également vous connecter et vous inscrire.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
});