import CommunityChannels from '@/components/community/channels/channels-list';
import { View, Text, StyleSheet } from 'react-native';

export default function CommunityChatsScreen() {
  return (
    <View style={styles.container}>
      <CommunityChannels />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});