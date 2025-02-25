import { View, Text, StyleSheet } from 'react-native';

export default function Home() {
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