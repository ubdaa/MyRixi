import { View, Text, StyleSheet } from 'react-native';

export default function CommunityMembersScreen() {
  return (
    <View style={styles.container}>
      <Text>Members</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});