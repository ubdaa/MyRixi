import { Tabs } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import { useCommunity } from "@/contexts/CommunityContext";
import AntDesign from '@expo/vector-icons/AntDesign';

export default function CommunityLayout() {
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
          title: "Members",
          headerShown: false,
          tabBarIcon: ({ size, color }) => (
            <AntDesign name="addusergroup" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="posts"
        options={{
          title: "Publications",
          headerShown: false,
          tabBarIcon: ({ size, color }) => (
            <AntDesign name="edit" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: "Feed",
          headerShown: false,
          tabBarIcon: ({ size, color }) => (
            <AntDesign name="staro" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="chats"
        options={{
          title: "Chats",
          headerShown: false,
          tabBarIcon: ({ size, color }) => (
            <AntDesign name="message1" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ size, color }) => (
            <AntDesign name="smileo" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
