import React from "react";
import { Tabs } from "expo-router";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useCommunity } from "@/contexts/CommunityContext";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";

interface CommonHeaderProps {
  title?: string;
}

function CommonHeader({ title }: CommonHeaderProps) {
  const router = useRouter();
  const { communities } = useCommunity();
  const insets = useSafeAreaInsets();

  const { id } = useLocalSearchParams();
  const community = communities.find((c) => c.id === id);
  
  const handleBackPress = (): void => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/(tabs)/home");
  };
  
  return (
    <View style={[styles.headerContainer, { paddingTop: insets.top }]}>
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={handleBackPress}
        activeOpacity={0.7}
      >
        <Ionicons name="chevron-back" size={24} color="#4c669f" />
      </TouchableOpacity>
      
      <Text style={styles.headerTitle}>
        {title || (community?.name || "Communauté")}
      </Text>
      
      <TouchableOpacity 
        style={styles.optionsButton}
        onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
        activeOpacity={0.7}
      >
        <Ionicons name="ellipsis-horizontal" size={24} color="#4c669f" />
      </TouchableOpacity>
    </View>
  );
}

interface Route {
  key: string;
  name: string;
}

interface TabBarLabelProps {
  focused: boolean;
  color: string;
  position: 'below-icon' | 'beside-icon';
  children: string;
}

interface DescriptorItem {
  options: {
    tabBarLabel?: string | ((props: TabBarLabelProps) => React.ReactNode);
    title?: string;
  };
}

interface Descriptors {
  [key: string]: DescriptorItem;
}

// --- Composant TabBar personnalisé ---
function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  
  const handleTabPress = (route: Route, isFocused: boolean): void => {
    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      // Feedback haptique lors du changement d'onglet
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      navigation.navigate(route.name);
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
      case 'index':
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
      case 'posts': return 'Publications';
      case 'index': return 'Feed';
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
        style={[styles.tabBarContainer, { paddingBottom: insets.bottom > 0 ? insets.bottom : 8 }]}
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
    { name: "posts", title: "Publications" },
    { name: "index", title: "Feed" },
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
            // Définir un header commun pour toutes les tabs
            header: () => <CommonHeader title={tab.title} />,
          }}
        />
      ))}
    </Tabs>
  );
};

const styles = StyleSheet.create({
  // Styles pour le header commun
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 60,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(230, 230, 230, 0.5)',
  },
  optionsButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(230, 230, 230, 0.5)',
  },
  
  // Conteneur pour les ombres avec coins arrondis
  tabBarShadowContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 10,
    backgroundColor: 'transparent',
  },
  // Styles pour la tab bar (BlurView)
  tabBarContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 30,
    overflow: 'hidden',
    paddingVertical: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
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
    top: -18,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#4c669f',
  },
});
