import { View, Text, StyleSheet } from 'react-native';

export default function CommunityProfileScreen() {
  return (
    <View style={styles.container}>
      <Text>Posts</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});