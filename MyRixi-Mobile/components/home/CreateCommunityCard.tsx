import React from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';

export const CreateCommunityCard: React.FC = () => {
  const { theme, colorMode } = useTheme();
  
  return (
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
  );
};

const styles = StyleSheet.create({
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
});
