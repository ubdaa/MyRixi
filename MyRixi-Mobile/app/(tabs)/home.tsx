import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  TouchableOpacity,
  ImageBackground,
  Image,
  StatusBar,
  useWindowDimensions,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';
import { GlassCard } from '@/components/ui/GlassCard';
import { NeoButton } from '@/components/ui/NeoButton';
import { GlassInput } from '@/components/ui/GlassInput';
import useChannel from '@/hooks/useChannel';

// Données fictives pour la démo
const DEMO_POSTS = [
  {
    id: '1',
    author: 'Kenzō',
    avatar: 'https://i.pravatar.cc/150?img=1',
    time: 'Il y a 5 min',
    content: 'Bienvenue dans la nouvelle version de MyRixi avec interface glassmorphique ! Qu\'en pensez-vous ?',
    likes: 24,
    comments: 6
  },
  {
    id: '2',
    author: 'Marie',
    avatar: 'https://i.pravatar.cc/150?img=5',
    time: 'Il y a 20 min',
    content: 'Les effets de transparence sont vraiment réussis, j\'adore l\'aspect cybernétique !',
    likes: 18,
    comments: 3
  },
  {
    id: '3',
    author: 'Thomas',
    avatar: 'https://i.pravatar.cc/150?img=8',
    time: 'Il y a 1h',
    content: 'Le néomorphisme subtil apporte une touche d\'élégance sans être trop chargé. Parfait pour une utilisation prolongée.',
    likes: 32,
    comments: 9
  }
];

// Données fictives pour les communautés
const DEMO_COMMUNITIES = [
  {
    id: '1',
    name: 'Design UI/UX',
    members: 1234,
    image: 'https://picsum.photos/200/300?random=1'
  },
  {
    id: '2',
    name: 'React Native Dev',
    members: 856,
    image: 'https://picsum.photos/200/300?random=2'
  },
  {
    id: '3',
    name: 'Glassmorphism',
    members: 478,
    image: 'https://picsum.photos/200/300?random=3'
  },
];

// Composant Post
const PostCard = ({ post }) => {
  const { theme, colorMode } = useTheme();
  const [liked, setLiked] = useState(false);
  
  // Animation pour le cœur
  const heartScale = useRef(new Animated.Value(1)).current;
  
  const handleLike = () => {
    setLiked(!liked);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    if (!liked) {
      Animated.sequence([
        Animated.timing(heartScale, {
          toValue: 1.3,
          duration: 200,
          useNativeDriver: true
        }),
        Animated.timing(heartScale, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true
        })
      ]).start();
    }
  };

  return (
    <GlassCard style={styles.postCard}>
      <View style={styles.postHeader}>
        <View style={styles.postAuthor}>
          <Image source={{ uri: post.avatar }} style={styles.avatar} />
          <View>
            <Text style={[styles.authorName, { color: theme.colors.textPrimary }]}>
              {post.author}
            </Text>
            <Text style={[styles.postTime, { color: theme.colors.textSecondary }]}>
              {post.time}
            </Text>
          </View>
        </View>
        
        <TouchableOpacity>
          <Ionicons
            name="ellipsis-horizontal"
            size={20}
            color={theme.colors.textSecondary}
          />
        </TouchableOpacity>
      </View>
      
      <Text style={[styles.postContent, { color: theme.colors.textPrimary }]}>
        {post.content}
      </Text>
      
      <View style={[styles.postActions, { borderTopColor: theme.colors.divider }]}>
        <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
          <Animated.View style={{ transform: [{ scale: heartScale }] }}>
            <Ionicons
              name={liked ? "heart" : "heart-outline"}
              size={22}
              color={liked ? theme.colors.cyberPink : theme.colors.textSecondary}
            />
          </Animated.View>
          <Text style={[styles.actionText, { 
            color: liked ? theme.colors.cyberPink : theme.colors.textSecondary
          }]}>
            {post.likes + (liked ? 1 : 0)}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons
            name="chatbubble-outline"
            size={20}
            color={theme.colors.textSecondary}
          />
          <Text style={[styles.actionText, { color: theme.colors.textSecondary }]}>
            {post.comments}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons
            name="share-social-outline"
            size={20}
            color={theme.colors.textSecondary}
          />
        </TouchableOpacity>
      </View>
    </GlassCard>
  );
};

// Composant pour la carte de communauté
const CommunityCard = ({ community, index }) => {
  const { theme } = useTheme();
  const animatedValue = useRef(new Animated.Value(0)).current;
  
  // Animation d'entrée échelonnée
  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 500,
      delay: index * 100,
      useNativeDriver: true,
    }).start();
  }, []);
  
  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 0],
  });
  
  const opacity = animatedValue;
  
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/community/${community.id}/feed`);
  };
  
  return (
    <Animated.View style={[
      styles.communityCardContainer,
      { 
        opacity, 
        transform: [{ translateY }] 
      }
    ]}>
      <TouchableOpacity onPress={handlePress} activeOpacity={0.9}>
        <ImageBackground
          source={{ uri: community.image }}
          style={styles.communityImage}
          imageStyle={{ borderRadius: theme.roundness }}
        >
          <BlurView
            intensity={60}
            tint="dark"
            style={styles.communityOverlay}
            experimentalBlurMethod='dimezisBlurView'
          >
            <Text style={styles.communityName}>{community.name}</Text>
            <Text style={styles.communityMembers}>
              {community.members} membres
            </Text>
          </BlurView>
        </ImageBackground>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function HomePage() {
  const channel = useChannel();
  channel.connectSignalR();

  const { theme, colorMode, toggleColorMode } = useTheme();
  const dimensions = useWindowDimensions();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [searchQuery, setSearchQuery] = useState('');
  
  // Animation pour l'effet de parallaxe
  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -50],
    extrapolate: 'clamp',
  });

  // Animation pour l'effet de fondu du header
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 60, 90],
    outputRange: [1, 0.8, 0],
    extrapolate: 'clamp',
  });

  // Animation pour le background
  const bgScale = useRef(new Animated.Value(1.05)).current;
  const bgTranslateY = scrollY.interpolate({
    inputRange: [-100, 0, 100],
    outputRange: [10, 0, -30],
    extrapolate: 'clamp',
  });
  
  return (
    <View style={[
      styles.container,
      { backgroundColor: theme.colors.background1 }
    ]}>
      <StatusBar
        barStyle={colorMode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      
      {/* Fond animé avec effet parallaxe */}
      <Animated.View style={[
        styles.backgroundContainer,
        {
          transform: [
            { scale: bgScale },
            { translateY: bgTranslateY }
          ]
        }
      ]}>
        <LinearGradient
          colors={
            colorMode === 'dark'
              ? ['#141316', '#1E1C24', '#141316']
              : ['#F8F8FA', '#FFFFFF', '#F8F8FA']
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.backgroundGradient}
        >
          {/* Points de motif en arrière-plan pour effet cybernétique */}
          {colorMode === 'dark' && (
            <View style={styles.patternContainer}>
              {/* Motif de points à ajouter ici si désiré */}
            </View>
          )}
        </LinearGradient>
      </Animated.View>
      
      {/* Header flottant avec effet parallaxe */}
      <Animated.View
        style={[
          styles.header,
          {
            transform: [{ translateY: headerTranslateY }],
            opacity: headerOpacity,
          }
        ]}
      >
        <BlurView
          intensity={20}
          tint={colorMode === 'dark' ? 'dark' : 'light'}
          style={[
            styles.headerBlur,
            {
              backgroundColor: 
                colorMode === 'dark' 
                  ? 'rgba(20, 19, 22, 0.7)' 
                  : 'rgba(248, 248, 250, 0.7)',
            }
          ]}
        >
          <View style={styles.headerContent}>
            <View>
              <Text style={[
                styles.headerGreeting,
                { color: theme.colors.textSecondary }
              ]}>
                Bonjour,
              </Text>
              <Text style={[
                styles.headerName,
                { color: theme.colors.textPrimary }
              ]}>
                Ubda
              </Text>
            </View>
            
            <TouchableOpacity
              onPress={toggleColorMode}
              style={styles.profileButton}
            >
              <BlurView
                intensity={30}
                tint={colorMode === 'dark' ? 'dark' : 'light'}
                style={styles.profileBlur}
                experimentalBlurMethod='dimezisBlurView'
              >
                <Image 
                  source={{ uri: 'https://i.pravatar.cc/150?img=1' }} 
                  style={styles.profileImage}
                />
                <View style={[
                  styles.statusIndicator, 
                  { backgroundColor: theme.colors.synthGreen }
                ]} />
              </BlurView>
            </TouchableOpacity>
          </View>
        </BlurView>
      </Animated.View>
      
      {/* Contenu principal */}
      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        {/* Zone de recherche */}
        <View style={styles.searchContainer}>
          <GlassInput
            placeholder="Rechercher..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            containerStyle={{ marginBottom: 0 }}
            rightIcon={
              <Ionicons
                name="search"
                size={22}
                color={theme.colors.textSecondary}
              />
            }
          />
        </View>
        
        {/* Carte de bienvenue */}
        <GlassCard style={styles.welcomeCard}>
          <View style={styles.welcomeContent}>
            <View style={styles.welcomeHeader}>
              <Text style={[styles.welcomeTitle, { color: theme.colors.textPrimary }]}>
                Nouveau design MyRixi
              </Text>
              <View style={[styles.badge, { backgroundColor: theme.colors.holoTurquoise }]}>
                <Text style={styles.badgeText}>NOUVEAU</Text>
              </View>
            </View>
            <Text style={[styles.welcomeText, { color: theme.colors.textSecondary }]}>
              Découvrez notre nouvelle interface glassmorphique avec des effets néomorphiques et cybernétiques.
            </Text>
            <View style={styles.cardButtons}>
              <NeoButton 
                title="Explorer" 
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                }}
                accentColor={theme.colors.neoPurple}
                size="small"
                style={{ flex: 1, marginRight: 8 }}
              />
              <NeoButton
                title="En savoir plus"
                onPress={() => {}}
                variant="outline"
                size="small"
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </GlassCard>
        
        {/* Section Communautés */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
              Vos Communautés
            </Text>
            <TouchableOpacity 
              onPress={() => router.push('/communities')}
              style={styles.seeAllButton}
            >
              <Text style={[styles.seeAllText, { color: theme.colors.technoBlue }]}>
                Voir tout
              </Text>
              <Ionicons name="chevron-forward" size={16} color={theme.colors.technoBlue} />
            </TouchableOpacity>
          </View>
          
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.communitiesContainer}
          >
            {DEMO_COMMUNITIES.map((community, index) => (
              <CommunityCard key={community.id} community={community} index={index} />
            ))}
            
            <TouchableOpacity 
              onPress={() => router.push('/community/create')}
              style={[
                styles.createCommunityCard, 
                { borderColor: theme.colors.divider }
              ]}
            >
              <BlurView
                intensity={10}
                tint={colorMode === 'dark' ? 'dark' : 'light'}
                style={[
                  styles.createCommunityContent,
                  { borderRadius: theme.roundness }
                ]}
                experimentalBlurMethod='dimezisBlurView'
              >
                <View style={[
                  styles.addIconContainer,
                  { backgroundColor: theme.colors.cyberPink + '20' } // 20 = 12% opacity
                ]}>
                  <Ionicons 
                    name="add" 
                    size={24} 
                    color={theme.colors.cyberPink} 
                  />
                </View>
                <Text style={[
                  styles.createCommunityText, 
                  { color: theme.colors.textPrimary }
                ]}>
                  Créer une communauté
                </Text>
              </BlurView>
            </TouchableOpacity>
          </ScrollView>
        </View>
        
        {/* Section Posts */}
        <View style={[styles.sectionContainer, { marginBottom: 100 }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
              Fil d'actualité
            </Text>
            <TouchableOpacity style={styles.seeAllButton}>
              <Text style={[styles.seeAllText, { color: theme.colors.technoBlue }]}>
                Voir tout
              </Text>
              <Ionicons name="chevron-forward" size={16} color={theme.colors.technoBlue} />
            </TouchableOpacity>
          </View>
          
          {DEMO_POSTS.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </View>
      </Animated.ScrollView>
      
      {/* Bouton flottant pour nouveau post */}
      <View style={styles.fabContainer}>
        <BlurView
          intensity={40}
          tint={colorMode === 'dark' ? 'dark' : 'light'}
          style={[
            styles.fabBlur,
            {
              backgroundColor: colorMode === 'dark' 
                ? 'rgba(20, 19, 22, 0.5)'
                : 'rgba(248, 248, 250, 0.5)',
            }
          ]}
          experimentalBlurMethod='dimezisBlurView'
        >
          <TouchableOpacity 
            style={[styles.fab, { backgroundColor: theme.colors.cyberPink }]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }}
          >
            <Ionicons name="add" size={28} color="#FFF" />
          </TouchableOpacity>
        </BlurView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
    height: '120%',
    width: '100%',
  },
  backgroundGradient: {
    flex: 1,
  },
  patternContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.05,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  headerBlur: {
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60, // Pour compenser la StatusBar
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  headerGreeting: {
    fontSize: 16,
    fontWeight: '400',
  },
  headerName: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  profileButton: {
    height: 42,
    width: 42,
    overflow: 'hidden',
  },
  profileBlur: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    height: 36,
    width: 36,
    borderRadius: 18,
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingTop: 120, // Pour compenser le header
    paddingBottom: 20,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  welcomeCard: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  welcomeContent: {
    padding: 5,
  },
  welcomeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  welcomeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000',
  },
  welcomeText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  cardButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '500',
    marginRight: 4,
  },
  communitiesContainer: {
    paddingBottom: 10,
    paddingRight: 20,
  },
  communityCardContainer: {
    marginRight: 12,
  },
  communityImage: {
    width: 160,
    height: 100,
    justifyContent: 'flex-end',
  },
  communityOverlay: {
    padding: 10,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  communityName: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  communityMembers: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
  },
  createCommunityCard: {
    width: 160,
    height: 100,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    overflow: 'hidden',
  },
  createCommunityContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  createCommunityText: {
    fontSize: 12,
    fontWeight: '500',
  },
  postCard: {
    marginBottom: 16,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  postAuthor: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  authorName: {
    fontWeight: '600',
    fontSize: 15,
  },
  postTime: {
    fontSize: 12,
  },
  postContent: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 12,
  },
  postActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  actionText: {
    marginLeft: 6,
    fontSize: 13,
    fontWeight: '500',
  },
  fabContainer: {
    position: 'absolute',
    right: 20,
    bottom: 80,
    borderRadius: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    overflow: 'hidden',
  },
  fabBlur: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fab: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
});