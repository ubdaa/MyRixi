import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/contexts/ThemeContext';
import { GlassCard } from '@/components/ui/GlassCard';
import { NeoButton } from '@/components/ui/NeoButton';
import { Badge } from '../ui/Badge';
import { useRouter } from 'expo-router';

export const WelcomeCard: React.FC = () => {
  const { theme } = useTheme();
  const router = useRouter();
  
  return (
    <GlassCard style={styles.welcomeCard}>
      <View style={styles.welcomeContent}>
        <View style={styles.welcomeHeader}>
          <Text style={[styles.welcomeTitle, { color: theme.colors.textPrimary }]}>
            Bienvenue sur MyRixi
          </Text>
          <Badge text="Nouveau" color="primary" />
        </View>
        <Text style={[styles.welcomeText, { color: theme.colors.textSecondary }]}>
          Découvrez les dernières actualités de vos communautés et restez connecté avec vos amis.
        </Text>
        <View style={styles.cardButtons}>
          <NeoButton 
            title="Explorer" 
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              router.push('/discovery');
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
  );
};

const styles = StyleSheet.create({
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
});
