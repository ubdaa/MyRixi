import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text,
  ViewStyle,
  TextStyle,
  Animated,
  Image,
  Pressable
} from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '@/contexts/ThemeContext';

interface ChatBubbleProps {
  message: string;
  timestamp: string;
  isCurrentUser: boolean;
  avatar?: string;
  username?: string;
  showAvatar?: boolean;
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
  onPress?: () => void;
  onLongPress?: () => void;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({
  message,
  timestamp,
  isCurrentUser,
  avatar,
  username,
  showAvatar = true,
  containerStyle,
  textStyle,
  onPress,
  onLongPress,
}) => {
  const { theme, colorMode } = useTheme();
  const [isPressed, setIsPressed] = React.useState(false);
  
  // Obtenir les dégradés de couleur en fonction de qui envoie le message
  const getBubbleStyle = () => {
    if (isCurrentUser) {
      // Dégradé pour l'utilisateur actuel
      return {
        backgroundColor: colorMode === 'dark'
          ? 'rgba(138, 46, 255, 0.15)'  // Néo Purple avec transparence
          : 'rgba(138, 46, 255, 0.08)',
        borderColor: theme.colors.neoPurple,
        alignSelf: 'flex-end' as 'flex-end',
        borderTopRightRadius: showAvatar ? 4 : theme.roundness,
        borderTopLeftRadius: theme.roundness,
        borderBottomLeftRadius: theme.roundness,
        borderBottomRightRadius: theme.roundness,
      };
    } else {
      // Dégradé pour les autres utilisateurs
      return {
        backgroundColor: colorMode === 'dark'
          ? 'rgba(24, 160, 251, 0.15)'  // Techno Blue avec transparence
          : 'rgba(24, 160, 251, 0.08)',
        borderColor: theme.colors.technoBlue,
        alignSelf: 'flex-start' as 'flex-start',
        borderTopRightRadius: theme.roundness,
        borderTopLeftRadius: showAvatar ? 4 : theme.roundness,
        borderBottomLeftRadius: theme.roundness,
        borderBottomRightRadius: theme.roundness,
      };
    }
  };

  const bubbleStyle = getBubbleStyle();
  
  // Animation pour l'effet "pressed"
  const scale = React.useRef(new Animated.Value(1)).current;
  
  React.useEffect(() => {
    Animated.spring(scale, {
      toValue: isPressed ? 0.98 : 1,
      friction: 5,
      tension: 300,
      useNativeDriver: true
    }).start();
  }, [isPressed]);

  return (
    <View style={[
      styles.container,
      { marginLeft: isCurrentUser ? 50 : showAvatar ? 0 : 50 },
      { marginRight: isCurrentUser ? (showAvatar ? 0 : 50) : 50 },
      containerStyle
    ]}>
      {/* Avatar si ce n'est pas l'utilisateur actuel et showAvatar est true */}
      {!isCurrentUser && showAvatar && (
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: avatar || 'https://via.placeholder.com/40' }}
            style={styles.avatar}
          />
        </View>
      )}
      
      <View style={{ flex: 1 }}>
        {/* Nom d'utilisateur si ce n'est pas l'utilisateur actuel */}
        {!isCurrentUser && username && (
          <Text style={[styles.username, { color: theme.colors.textSecondary }]}>
            {username}
          </Text>
        )}
        
        <Pressable
          onPress={onPress}
          onLongPress={onLongPress}
          onPressIn={() => setIsPressed(true)}
          onPressOut={() => setIsPressed(false)}
          style={{ alignSelf: bubbleStyle.alignSelf as 'flex-start' | 'flex-end' }}
        >
          <Animated.View style={{ transform: [{ scale }] }}>
            <BlurView
              intensity={10}
              tint={colorMode === 'dark' ? 'dark' : 'light'}
              style={[
                styles.blurContainer,
                {
                  borderRadius: theme.roundness,
                  borderTopRightRadius: bubbleStyle.borderTopRightRadius,
                  borderTopLeftRadius: bubbleStyle.borderTopLeftRadius,
                  borderBottomLeftRadius: bubbleStyle.borderBottomLeftRadius,
                  borderBottomRightRadius: bubbleStyle.borderBottomRightRadius,
                }
              ]}
            >
              <View style={[
                styles.bubble,
                bubbleStyle,
                { borderWidth: 1 }
              ]}>
                <Text style={[
                  styles.message,
                  { color: theme.colors.textPrimary },
                  textStyle
                ]}>
                  {message}
                </Text>
                <Text style={[
                  styles.timestamp,
                  { color: colorMode === 'dark' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }
                ]}>
                  {timestamp}
                </Text>
              </View>
            </BlurView>
          </Animated.View>
        </Pressable>
      </View>
      
      {/* Avatar si c'est l'utilisateur actuel et showAvatar est true */}
      {isCurrentUser && showAvatar && (
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: avatar || 'https://via.placeholder.com/40' }}
            style={styles.avatar}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: 4,
    alignItems: 'flex-end',
  },
  avatarContainer: {
    marginHorizontal: 8,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  blurContainer: {
    overflow: 'hidden',
  },
  bubble: {
    padding: 10,
    maxWidth: 300,
  },
  username: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 2,
    marginLeft: 12,
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
  },
  timestamp: {
    fontSize: 10,
    alignSelf: 'flex-end',
    marginTop: 4,
  }
});