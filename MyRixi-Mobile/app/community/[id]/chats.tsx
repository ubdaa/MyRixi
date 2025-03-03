import CommunityChannels from '@/components/community/channels/channels-list';
import { useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CommunityChatsScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top', 'right', 'left']}>
      <CommunityChannels />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});