import { Tabs } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import { useCommunity } from "@/contexts/CommunityContext";
import { Ionicons } from "@expo/vector-icons";

export default function CommunityLayout() {
  const { id } = useLocalSearchParams();
  const { communities } = useCommunity();

  const community = communities.find((c) => c.id === id);

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopWidth: 1,
          borderTopColor: "#e5e5e5",
        },
        tabBarActiveTintColor: "#4c669f",
        tabBarInactiveTintColor: "#666",
      }}
    >
      <Tabs.Screen
        name="members"
        options={{
          title: "Feed",
          headerShown: false,
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="posts"
        options={{
          title: "Publications",
          headerShown: false,
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="pencil" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: "Feed",
          headerShown: false,
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="chats"
        options={{
          title: "Chats",
          headerShown: false,
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="chatbubbles" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
