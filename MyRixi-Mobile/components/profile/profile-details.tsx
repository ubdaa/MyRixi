import React, { useEffect, useRef, useState } from 'react';
import { Profile } from "@/types/profile";
import { 
  Animated, 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity,
  Dimensions,
  FlatList
} from "react-native";
import { BlurView } from 'expo-blur';
import { Feather } from '@expo/vector-icons';

// Composant pour les onglets de contenu
function TabContent ({ active, children }: { active: boolean, children: React.ReactNode }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: active ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [active]);

  if (!active) return null;
  
  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      {children}
    </Animated.View>
  );
};

// Composant simulant une publication/commentaire
function ContentItem({ isPublication, data }: { isPublication: boolean, data: any }) {
  return (
    <View style={styles.contentItem}>
      <View style={styles.contentHeader}>
        <Text style={styles.contentTitle}>{isPublication ? "Publication" : "Commentaire"}</Text>
        <Text style={styles.contentDate}>{new Date().toLocaleDateString()}</Text>
      </View>
      <Text style={styles.contentText}>
        {data || isPublication 
          ? "Ceci est un exemple de contenu qui apparaîtrait ici dans une application réelle."
          : "Ceci est un exemple de commentaire que l'utilisateur a laissé."}
      </Text>
    </View>
  );
};

export default function ProfileDetails({ profile }: { profile: Profile }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [activeTab, setActiveTab] = useState('publications');
  
  // Données simulées pour démo
  const examplePublications = Array(3).fill(null);
  const exampleComments = Array(2).fill(null);

  useEffect(() => {
    // Animation d'apparition progressive
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <BlurView intensity={30} tint="light" style={StyleSheet.absoluteFill} />
      
      {/* Bio et date d'inscription */}
      <View style={styles.infoSection}>
        <Text style={styles.bio}>{profile.bio || "Aucune bio disponible."}</Text>
        <Text style={styles.joinedDate}>
          Membre depuis {new Date(profile.joinedAt).toLocaleDateString()}
        </Text>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>Publications</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>Abonnés</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>Abonnements</Text>
        </View>
      </View>

      {/* Onglets */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          onPress={() => setActiveTab('publications')}
          style={[
            styles.tabButton, 
            activeTab === 'publications' && styles.activeTabButton
          ]}
        >
          <Text style={[
            styles.tabButtonText,
            activeTab === 'publications' && styles.activeTabButtonText
          ]}>Publications</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={() => setActiveTab('commentaires')}
          style={[
            styles.tabButton, 
            activeTab === 'commentaires' && styles.activeTabButton
          ]}
        >
          <Text style={[
            styles.tabButtonText,
            activeTab === 'commentaires' && styles.activeTabButtonText
          ]}>Commentaires</Text>
        </TouchableOpacity>
      </View>

      {/* Contenu des onglets */}
      <View style={styles.contentContainer}>
        <TabContent active={activeTab === 'publications'}>
          {examplePublications.length > 0 ? (
            examplePublications.map((_, index) => (
              <ContentItem key={`pub-${index}`} isPublication={true} data={null} />
            ))
          ) : (
            <View style={styles.emptyContent}>
              <Feather name="file-text" size={24} color="#aaa" />
              <Text style={styles.emptyContentText}>Aucune publication pour le moment</Text>
            </View>
          )}
        </TabContent>
        
        <TabContent active={activeTab === 'commentaires'}>
          {exampleComments.length > 0 ? (
            exampleComments.map((_, index) => (
              <ContentItem key={`comment-${index}`} isPublication={false} data={null} />
            ))
          ) : (
            <View style={styles.emptyContent}>
              <Feather name="message-square" size={24} color="#aaa" />
              <Text style={styles.emptyContentText}>Aucun commentaire pour le moment</Text>
            </View>
          )}
        </TabContent>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    position: 'relative',
    backgroundColor: "rgba(255,255,255,0.8)",
  },
  infoSection: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: "#E1E8ED",
  },
  bio: {
    fontSize: 16,
    marginBottom: 10,
    color: "#333",
  },
  joinedDate: {
    fontSize: 14,
    color: "gray",
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderTopWidth: 1,
    borderTopColor: "#E1E8ED",
    borderBottomWidth: 1,
    borderBottomColor: "#E1E8ED",
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: "#333",
  },
  statLabel: {
    fontSize: 14,
    color: "gray",
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: "#E1E8ED",
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 15,
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: "#1DA1F2",
  },
  tabButtonText: {
    color: "gray",
    fontWeight: "500",
  },
  activeTabButtonText: {
    color: "#1DA1F2",
    fontWeight: "bold",
  },
  contentContainer: {
    minHeight: 200,
  },
  contentItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E1E8ED",
  },
  contentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  contentTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: "#333",
  },
  contentDate: {
    color: "gray",
    fontSize: 14,
  },
  contentText: {
    fontSize: 14,
    color: "#555",
  },
  emptyContent: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  emptyContentText: {
    color: "#aaa",
    marginTop: 10,
    fontSize: 16,
  }
});