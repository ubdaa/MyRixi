import React from "react";
import { Tabs, useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import AntDesign from '@expo/vector-icons/AntDesign';
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";

interface Route {
  key: string;
  name: string;
}

// --- Composant TabBar personnalisé ---
function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const router = useRouter();
  const params = useLocalSearchParams(); // Récupère les paramètres (dont l'id)
  
  const handleTabPress = (route: Route, isFocused: boolean): void => {
    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      // Feedback haptique lors du changement d'onglet
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);      
      
      // Navigation en conservant l'id
      if (!isFocused && !event.defaultPrevented) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        // Navigation en conservant l'id
        router.replace({
          pathname: `/community/[id]/${route.name}` as any,
          params
        });
      }
    }
  };
  
  const getTabIcon = (routeName: string, isFocused: boolean): JSX.Element => {
    const color = isFocused ? "#4c669f" : "#666";
    const size = 22;
    
    switch (routeName) {
      case 'members':
        return <AntDesign name="addusergroup" size={size} color={color} />;
      case 'posts':
        return <AntDesign name="edit" size={size} color={color} />;
      case 'feed':
        return <AntDesign name={isFocused ? "star" : "staro"} size={size} color={color} />;
      case 'chats':
        return <AntDesign name="message1" size={size} color={color} />;
      case 'profile':
        return <AntDesign name="smileo" size={size} color={color} />;
      default:
        return <AntDesign name="questioncircleo" size={size} color={color} />;
    }
  };

  const getTabLabel = (routeName: string): string => {
    switch (routeName) {
      case 'members': return 'Membres';
      case 'posts': return 'Posts';
      case 'feed': return 'Feed';
      case 'chats': return 'Chats';
      case 'profile': return 'Profil';
      default: return routeName;
    }
  };
  
  return (
    <View style={styles.tabBarShadowContainer}>
      <BlurView 
        intensity={80} 
        tint="light" 
        style={styles.tabBarContainer}
      >
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          
          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              onPress={() => handleTabPress(route, isFocused)}
              style={styles.tabButton}
              activeOpacity={0.7}
            >
              <View style={styles.tabContent}>
                {getTabIcon(route.name, isFocused)}
                <Text style={[
                  styles.tabText, 
                  { color: isFocused ? "#4c669f" : "#666" }
                ]}>
                  {getTabLabel(route.name)}
                </Text>
                {isFocused && <View style={styles.activeIndicator} />}
              </View>
            </TouchableOpacity>
          );
        })}
      </BlurView>
    </View>
  );
}

// --- Type pour définir un onglet ---
interface TabItem {
  name: string;
  title: string;
}

// --- Composant principal ---
export default function CommunityLayout() {
  const tabs: TabItem[] = [
    { name: "members", title: "Membres" },
    { name: "posts", title: "Posts" },
    { name: "feed", title: "Feed" },
    { name: "chats", title: "Chats" },
    { name: "profile", title: "Profil" }
  ];
  
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
          }}
        />
      ))}
    </Tabs>
  );
};

const styles = StyleSheet.create({
  // Conteneur pour les ombres avec coins arrondis
  tabBarShadowContainer: {
    position: 'absolute',
    bottom: 36,
    left: 20,
    right: 20,
    borderRadius: 100,
    elevation: 10,
    backgroundColor: 'transparent',
  },
  tabBarContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(229, 229, 229, 1)',
    borderRadius: 100,
    overflow: 'hidden',
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontSize: 11,
    marginTop: 4,
    fontWeight: '500',
  },
  activeIndicator: {
    position: 'absolute',
    top: -8,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#4c669f',
  },
});
