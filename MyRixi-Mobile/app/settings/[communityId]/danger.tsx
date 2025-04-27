import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Alert, Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// Components
import { SettingsHeader } from '@/components/settings/SettingsHeader';
import { SettingsSection } from '@/components/settings/SettingsSection';
import { NeoButton } from '@/components/ui/NeoButton';
import { GlassInput } from '@/components/ui/GlassInput';

// Mock community data (replace with real data fetching)
const fetchCommunityData = async (id: string) => {
  return {
    id,
    name: 'Communauté Neo-Tokyo',
    memberCount: 1248
  };
};

export default function CommunityDangerZoneScreen() {
  const { communityId } = useLocalSearchParams();
  const router = useRouter();
  const { theme } = useTheme();
  
  const [loading, setLoading] = useState(true);
  const [community, setCommunity] = useState<any>(null);
  const [confirmName, setConfirmName] = useState('');
  const [processingDelete, setProcessingDelete] = useState(false);
  
  useEffect(() => {
    const loadCommunity = async () => {
      if (typeof communityId === 'string') {
        const data = await fetchCommunityData(communityId);
        setCommunity(data);
        setLoading(false);
      }
    };

    loadCommunity();
  }, [communityId]);

  const handleDeleteRequest = () => {
    if (confirmName !== community?.name) {
      Alert.alert(
        "Erreur de confirmation",
        "Le nom de la communauté que vous avez saisi ne correspond pas. Veuillez réessayer.",
      );
      return;
    }

    Alert.alert(
      "Supprimer définitivement",
      `Êtes-vous absolument sûr de vouloir supprimer "${community.name}" ? Cette action est irréversible et supprimera toutes les données associées à cette communauté.`,
      [
        { text: "Annuler", style: "cancel" },
        { 
          text: "Supprimer définitivement", 
          style: "destructive", 
          onPress: handleDeleteConfirmed
        }
      ]
    );
  };

  const handleDeleteConfirmed = () => {
    setProcessingDelete(true);
    
    // Simulation de la suppression avec délai
    setTimeout(() => {
      setProcessingDelete(false);
      Alert.alert(
        "Communauté supprimée",
        "La communauté a été supprimée avec succès.",
        [
          { 
            text: "OK", 
            onPress: () => router.replace('/communities') // Rediriger vers la liste des communautés
          }
        ]
      );
    }, 2000);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background1 }]}>
      <SettingsHeader title="Zone de danger" />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={{ color: theme.colors.textPrimary }}>Chargement...</Text>
          </View>
        ) : (
          <>
            {/* Warning Section */}
            <SettingsSection>
              <View style={styles.warningContainer}>
                <View style={[styles.warningIcon, { backgroundColor: theme.colors.neoRed }]}>
                  <Ionicons name="warning" size={32} color="white" />
                </View>
                
                <Text style={[styles.warningTitle, { color: theme.colors.neoRed }]}>
                  Zone de danger
                </Text>
                
                <Text style={[styles.warningText, { color: theme.colors.textPrimary }]}>
                  Les actions effectuées dans cette section sont destructives et irréversibles.
                  Veuillez procéder avec une extrême prudence.
                </Text>
              </View>
            </SettingsSection>
            
            {/* Delete Community Section */}
            <SettingsSection 
              title="Supprimer la communauté"
              footer="Une fois supprimée, vous ne pourrez pas récupérer cette communauté ni ses données"
            >
              <View style={styles.deleteContainer}>
                <Text style={[styles.deleteWarning, { color: theme.colors.textPrimary }]}>
                  La suppression de cette communauté entraînera:
                </Text>
                
                <View style={styles.consequencesList}>
                  <View style={styles.consequenceItem}>
                    <Ionicons 
                      name="close-circle" 
                      size={18} 
                      color={theme.colors.neoRed} 
                      style={styles.bulletIcon}
                    />
                    <Text style={[styles.consequenceText, { color: theme.colors.textPrimary }]}>
                      La suppression de tous les messages et médias
                    </Text>
                  </View>
                  <View style={styles.consequenceItem}>
                    <Ionicons 
                      name="close-circle" 
                      size={18} 
                      color={theme.colors.neoRed} 
                      style={styles.bulletIcon}
                    />
                    <Text style={[styles.consequenceText, { color: theme.colors.textPrimary }]}>
                      La dissolution de tous les groupes et rôles
                    </Text>
                  </View>
                  <View style={styles.consequenceItem}>
                    <Ionicons 
                      name="close-circle" 
                      size={18} 
                      color={theme.colors.neoRed} 
                      style={styles.bulletIcon}
                    />
                    <Text style={[styles.consequenceText, { color: theme.colors.textPrimary }]}>
                      Le retrait de tous les membres ({community.memberCount})
                    </Text>
                  </View>
                </View>
                
                <Text style={[styles.confirmInstructions, { color: theme.colors.textSecondary }]}>
                  Pour confirmer, veuillez saisir le nom exact de la communauté:
                </Text>
                <Text style={[styles.communityName, { color: theme.colors.neoRed }]}>
                  {community.name}
                </Text>
                
                <GlassInput
                  placeholder="Entrez le nom de la communauté"
                  value={confirmName}
                  onChangeText={setConfirmName}
                  accentColor={theme.colors.neoRed}
                  containerStyle={styles.confirmInput}
                />
                
                <NeoButton 
                  title="Supprimer définitivement cette communauté"
                  onPress={handleDeleteRequest}
                  accentColor={theme.colors.neoRed}
                  loading={processingDelete}
                  disabled={confirmName !== community.name || processingDelete}
                  style={styles.deleteButton}
                />
              </View>
            </SettingsSection>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  warningContainer: {
    padding: 16,
    alignItems: 'center',
  },
  warningIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  warningTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  warningText: {
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 16,
  },
  deleteContainer: {
    padding: 16,
  },
  deleteWarning: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  consequencesList: {
    marginBottom: 16,
  },
  consequenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  bulletIcon: {
    marginRight: 8,
  },
  consequenceText: {
    fontSize: 14,
  },
  confirmInstructions: {
    fontSize: 14,
    marginBottom: 8,
  },
  communityName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  confirmInput: {
    marginBottom: 16,
  },
  deleteButton: {
    width: '100%',
  },
  footer: {
    height: 100,
  }
});
