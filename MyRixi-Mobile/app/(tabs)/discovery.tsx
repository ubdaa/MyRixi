import { View, Text, StyleSheet } from 'react-native';

export default function DiscoveryScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Découverte</Text>
      <Text style={styles.text}>Découvrez des communautés et des personnes.</Text>
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