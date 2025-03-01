import CommunityChannels from '@/components/community/channels/channels-list';
import { useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';

export default function CommunityChatsScreen() {
  const { id } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      {/* <CommunityChannels communityId={Array.isArray(id) ? id[0] : id} /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});