import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";

function TabBarIcon({ name, color, size }: { name: keyof typeof Ionicons.glyphMap; color: string; size: number }) {
  return (
    <View style={styles.iconContainer}>
      <Ionicons name={name} size={size} color={color} />
    </View>
  );
}

function MyTabs() {
  const { theme, colorMode } = useTheme();
  
  // Fonction pour créer le fond en verre
  const screenOptions = {
    headerShown: false,
    tabBarStyle: {
      position: 'absolute' as const,
      left: 24,
      right: 24,
      elevation: 0,
      backgroundColor: 'transparent',
      borderTopWidth: 0,
      borderRadius: 30,
    },
    tabBarBackground: () => (
      <BlurView
        intensity={theme.glassmorphism.blur}
        tint={colorMode === 'dark' ? 'dark' : 'light'}
        style={{ 
          ...StyleSheet.absoluteFillObject,
          borderRadius: 30,
          overflow: 'hidden',
        }}
      />
    ),
    tabBarActiveTintColor: theme.colors.cyberPink,
    tabBarInactiveTintColor: theme.colors.textSecondary,
  };

  // Options pour les animations
  const getTabAnimation = (isFocused: boolean) => {
    return {
      tabBarIconStyle: {
        transform: [{ scale: isFocused ? 1.1 : 1 }],
      },
      tabBarLabelStyle: {
        fontWeight: isFocused ? "700" as const : "500" as const,
        fontSize: 12,
      },
    };
  };

  return (
    <Tabs
      screenOptions={screenOptions}
    >
      <Tabs.Screen
        name="debug"
        options={({ navigation }) => ({
          title: "Debug",
          ...getTabAnimation(navigation.isFocused()),
          tabBarIcon: ({ size, color }) => (
            <TabBarIcon name="dice" size={size} color={color} />
          ),
        })}
      />
      <Tabs.Screen
        name="discovery"
        options={({ navigation }) => ({
          title: "Discovery",
          ...getTabAnimation(navigation.isFocused()),
          tabBarIcon: ({ size, color }) => (
            <TabBarIcon name="compass" size={size} color={color} />
          ),
        })}
      />
      <Tabs.Screen
        name="home"
        options={({ navigation }) => ({
          title: "Home",
          ...getTabAnimation(navigation.isFocused()),
          tabBarIcon: ({ size, color }) => (
            <TabBarIcon name="home" size={size} color={color} />
          ),
        })}
      />
      <Tabs.Screen
        name="communities"
        options={({ navigation }) => ({
          title: "Communities",
          ...getTabAnimation(navigation.isFocused()),
          tabBarIcon: ({ size, color }) => (
            <TabBarIcon name="people" size={size} color={color} />
          ),
        })}
      />
      <Tabs.Screen
        name="profile"
        options={({ navigation }) => ({
          title: "Profile",
          ...getTabAnimation(navigation.isFocused()),
          tabBarIcon: ({ size, color }) => (
            <TabBarIcon name="person" size={size} color={color} />
          ),
        })}
      />
    </Tabs>
  );
}

export default function TabsLayout() {
  return (
    <ThemeProvider>
      <MyTabs />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});