import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="debug" options={{ 
        headerShown: false,
      }} />
    </Tabs>
  );
}