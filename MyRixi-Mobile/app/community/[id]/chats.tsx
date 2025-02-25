import { View, Text, StyleSheet } from 'react-native';

export default function CommunityChatsScreen() {
  return (
    <View style={styles.container}>
      <Text>Chat</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});