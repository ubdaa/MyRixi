import React from "react";
import { Tabs, useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, StyleSheet, TouchableOpacity, Animated } from "react-native";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { AntDesign } from '@expo/vector-icons';
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useTheme } from "@/contexts/ThemeContext";

interface Route {
  key: string;
  name: string;
}

// --- Composant TabBar personnalisé avec design glassmorphique ---
function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { theme, colorMode } = useTheme();
  
  // Références pour les animations
  const tabAnimations = React.useRef(
    state.routes.map(() => new Animated.Value(0))
  ).current;
  
  const handleTabPress = (route: Route, index: number, isFocused: boolean): void => {
    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      // Animation et feedback haptique
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      
      // Animation de pulse
      Animated.sequence([
        Animated.timing(tabAnimations[index], {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(tabAnimations[index], {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        })
      ]).start();
      
      // Navigation en conservant l'id
      router.replace({
        pathname: `/community/[id]/${route.name}` as any,
        params
      });
    }
  };
  
  const getTabIcon = (routeName: string, isFocused: boolean, index: number): JSX.Element => {
    // Déterminer la couleur basée sur le focus et le thème
    const color = isFocused 
      ? theme.colors.cyberPink 
      : colorMode === 'dark' ? '#B8B8B8' : '#666';
    const size = 22;
    
    // Animation du scale
    const scale = tabAnimations[index].interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [1, 1.2, 1]
    });
    
    const iconName = getIconName(routeName, isFocused);
    
    return (
      <Animated.View style={{ transform: [{ scale }] }}>
        <AntDesign name={iconName} size={size} color={color} />
      </Animated.View>
    );
  };
  
  const getIconName = (routeName: string, isFocused: boolean): keyof typeof AntDesign.glyphMap => {
    switch (routeName) { 
      case 'members':
        return 'addusergroup';
      case 'posts':
        return 'edit';
      case 'feed':
        return isFocused ? 'star' : 'staro';
      case 'chats':
        return 'message1';
      case 'profile':
        return 'smileo';
      default:
        return 'questioncircleo';
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
        intensity={theme.glassmorphism.blur + 20} 
        tint={colorMode === 'dark' ? 'dark' : 'light'} 
        style={[styles.tabBarContainer, {
          backgroundColor: colorMode === 'dark' 
            ? 'rgba(20, 19, 22, 0.5)'
            : 'rgba(255, 255, 255, 0.6)',
          borderColor: colorMode === 'dark'
            ? 'rgba(255, 255, 255, 0.1)'
            : 'rgba(229, 229, 229, 1)',
        }]}
      >
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          
          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              onPress={() => handleTabPress(route, index, isFocused)}
              style={styles.tabButton}
              activeOpacity={0.7}
            >
              <View style={styles.tabContent}>
                {getTabIcon(route.name, isFocused, index)}
                <Text style={[
                  styles.tabText, 
                  { 
                    color: isFocused 
                      ? theme.colors.cyberPink 
                      : theme.colors.textSecondary
                  }
                ]}>
                  {getTabLabel(route.name)}
                </Text>
                {isFocused && (
                  <View style={[
                    styles.activeIndicator, 
                    { backgroundColor: theme.colors.cyberPink }
                  ]} />
                )}
              </View>
              {isFocused && (
                <Animated.View 
                  style={[
                    styles.tabGlow,
                    { backgroundColor: theme.colors.cyberPink }
                  ]}
                />
              )}
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
  const { colorMode } = useTheme();
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    backgroundColor: 'transparent',
  },
  tabBarContainer: {
    flexDirection: 'row',
    borderWidth: 1,
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
    position: 'relative',
    overflow: 'hidden',
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    zIndex: 2,
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
  },
  tabGlow: {
    position: 'absolute',
    bottom: -15,
    width: 20,
    height: 4,
    borderRadius: 10,
    opacity: 0.5,
    zIndex: 1,
    alignSelf: 'center',
  }
});