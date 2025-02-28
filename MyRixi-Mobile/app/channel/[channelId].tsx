import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text } from "react-native";

export default function ChannelScreen() {
  const router = useRouter();
  const { channelId } = useLocalSearchParams();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Channel {channelId}</Text>
    </View>
  )
}