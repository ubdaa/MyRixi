import useChannel from "@/hooks/useChannel";
import signalR from "@microsoft/signalr";
import { useLocalSearchParams, useRouter, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text } from "react-native";

export default function ChannelScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { channelId } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const channel = useChannel();

  useEffect(() => {
    const id = Array.isArray(channelId) ? channelId[0] : channelId;

    if (!id) {
      setError("Channel ID is missing");
      setIsLoading(false);
      return;
    }

    async function joinChannel() {
      try {
        setIsLoading(true);
        const success = await channel.joinChannel(id);
        if (!success) {
          setError("Failed to join channel");
        }
      } catch (err) {
        console.error("Error in joinChannel:", err);
        setError("An error occurred while joining the channel");
      } finally {
        setIsLoading(false);
      }
    }

    joinChannel();

    // Clean up function to leave the channel when navigating away
    const listener = navigation.addListener("beforeRemove", (e) => {
      e.preventDefault();
      console.log("onback");
      // Do your stuff here
      channel
      .leaveChannel(id)
      .catch((err) => console.error("Error leaving channel:", err));
      navigation.dispatch(e.data.action);
    });
    
    return () => {
      if (id) {
        channel
        .leaveChannel(id)
        .catch((err) => console.error("Error leaving channel:", err));
      }
      navigation.removeListener("beforeRemove", listener);
    };
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Channel {channelId}</Text>
    </View>
  );
}
