import { Tabs } from "expo-router";
import { Ionicons } from '@expo/vector-icons';

export default function TabsLayout() {
  return (
    <Tabs
    screenOptions={{
      tabBarStyle: {
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#e5e5e5',
      },
      tabBarActiveTintColor: '#4c669f',
      tabBarInactiveTintColor: '#666',
    }}>
      <Tabs.Screen
        name="debug"
        options={{
          title: 'Debug',
          headerShown: false,
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="dice" size={size} color={color} />
          ),
        }}/>
      <Tabs.Screen 
        name="home"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}/>
        <Tabs.Screen
          name="communities"
          options={{
            title: 'Communities',
            headerShown: false,
            tabBarIcon: ({ size, color }) => (
              <Ionicons name="people" size={size} color={color} />
            ),
          }}
        />
    </Tabs>
  );
}