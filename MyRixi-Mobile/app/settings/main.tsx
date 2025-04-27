import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Alert } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// Import des composants personnalisés
import { SettingsHeader } from '@/components/settings/SettingsHeader';
import { SettingsSection } from '@/components/settings/SettingsSection';
import { SettingsItem } from '@/components/settings/SettingsItem';
import { NeoButton } from '@/components/ui/NeoButton';
import { Text, Switch } from 'react-native';
import { useRouter } from 'expo-router';

export default function SettingsScreen() {
  const { theme, colorMode, toggleColorMode } = useTheme();
  const { logout } = useAuth();
  
  // Mock user data (remplacer par les données réelles de l'utilisateur)
  const user = {
    username: '',
    email: '',
  };
  
  // État pour les toggles
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  
  const router = useRouter();

  // Fonction pour gérer la déconnexion
  const handleLogout = () => {
    Alert.alert(
      "Déconnexion",
      "Êtes-vous sûr de vouloir vous déconnecter ?",
      [
        {
          text: "Annuler",
          style: "cancel"
        },
        {
          text: "Déconnexion",
          style: "destructive",
          onPress: () => { logout(); router.push("/(auth)/login"); }
        }
      ]
    );
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background1 }]}>
      <SettingsHeader title="Paramètres" />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Section Profil */}
        <SettingsSection title="Profil" footer="Gérez vos informations personnelles et préférences de sécurité">
          <SettingsItem
            icon={<Ionicons name="person-outline" size={20} color="white" />}
            title={user.username}
            subtitle={user.email}
            tint={theme.colors.technoBlue}
            onPress={() => console.log('Navigate to profile')}
          />
          <SettingsItem
            icon={<Ionicons name="key-outline" size={20} color="white" />}
            title="Changer le mot de passe"
            tint={theme.colors.solarGold}
            onPress={() => console.log('Navigate to change password')}
          />
          <SettingsItem
            icon={<Ionicons name="language-outline" size={20} color="white" />}
            title="Langue"
            subtitle="Français"
            tint={theme.colors.cyberPink}
            onPress={() => console.log('Navigate to language')}
          />
          <SettingsItem
            icon={<Ionicons name="globe-outline" size={20} color="white" />}
            title="Région"
            subtitle="France"
            tint={theme.colors.synthGreen}
            onPress={() => console.log('Navigate to region')}
          />
        </SettingsSection>

        {/* Section Apparence */}
        <SettingsSection title="Apparence">
          <SettingsItem
            icon={<Ionicons name="moon-outline" size={20} color="white" />}
            title="Mode sombre"
            tint={theme.colors.neoPurple}
            showChevron={false}
            rightElement={
              <Switch
                value={colorMode === 'dark'}
                onValueChange={toggleColorMode}
                trackColor={{ 
                  false: '#767577', 
                  true: theme.colors.neoPurple + '80' 
                }}
                thumbColor={colorMode === 'dark' ? theme.colors.neoPurple : '#f4f3f4'}
              />
            }
          />
        </SettingsSection>
        
        {/* Section Compte */}
        <SettingsSection title="Compte" footer="Gérez vos informations personnelles et préférences de sécurité">
          <SettingsItem
            icon={<Ionicons name="person-outline" size={20} color="white" />}
            title="Informations personnelles"
            tint={theme.colors.technoBlue}
            onPress={() => console.log('Navigate to personal info')}
          />
          <SettingsItem
            icon={<Ionicons name="lock-closed-outline" size={20} color="white" />}
            title="Sécurité"
            subtitle="Mot de passe, authentification à deux facteurs"
            tint={theme.colors.solarGold}
            onPress={() => console.log('Navigate to security')}
          />
          <SettingsItem
            icon={<Ionicons name="notifications-outline" size={20} color="white" />}
            title="Notifications"
            tint={theme.colors.cyberPink}
            showChevron={false}
            rightElement={
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ 
                  false: '#767577', 
                  true: theme.colors.cyberPink + '80' 
                }}
                thumbColor={notificationsEnabled ? theme.colors.cyberPink : '#f4f3f4'}
              />
            }
          />
        </SettingsSection>
        
        {/* Section Confidentialité */}
        <SettingsSection title="Confidentialité et sécurité">
          <SettingsItem
            icon={<Ionicons name="eye-outline" size={20} color="white" />}
            title="Confidentialité"
            tint={theme.colors.synthGreen}
            onPress={() => console.log('Navigate to privacy')}
          />
          <SettingsItem
            icon={<Ionicons name="finger-print-outline" size={20} color="white" />}
            title="Authentification biométrique"
            tint={theme.colors.holoTurquoise}
            showChevron={false}
            rightElement={
              <Switch
                value={biometricEnabled}
                onValueChange={setBiometricEnabled}
                trackColor={{ 
                  false: '#767577', 
                  true: theme.colors.holoTurquoise + '80' 
                }}
                thumbColor={biometricEnabled ? theme.colors.holoTurquoise : '#f4f3f4'}
              />
            }
          />
          <SettingsItem
            icon={<Ionicons name="shield-outline" size={20} color="white" />}
            title="Activité du compte"
            subtitle="Appareils connectés, historique de connexion"
            tint={theme.colors.solarGold}
            onPress={() => console.log('Navigate to account activity')}
          />
        </SettingsSection>
        
        {/* Section Aide */}
        <SettingsSection title="Aide et Support">
          <SettingsItem
            icon={<Ionicons name="help-circle-outline" size={20} color="white" />}
            title="Centre d'aide"
            tint={theme.colors.technoBlue}
            onPress={() => router.push("/settings/faq")}
          />
          <SettingsItem
            icon={<Ionicons name="document-text-outline" size={20} color="white" />}
            title="Conditions d'utilisation"
            tint={theme.colors.technoBlue}
            onPress={() => router.push("/settings/terms")}
          />
          <SettingsItem
            icon={<Ionicons name="mail-outline" size={20} color="white" />}
            title="Nous contacter"
            tint={theme.colors.technoBlue}
            onPress={() => router.push("/settings/contact")}
          />
        </SettingsSection>
        
        {/* Section Déconnexion */}
        <View style={styles.logoutContainer}>
          <NeoButton
            title="Se déconnecter"
            onPress={handleLogout}
            variant="outline"
            accentColor={theme.colors.neoRed}
            size="large"
            style={styles.logoutButton}
          />
        </View>
        
        {/* Informations sur l'application */}
        <View style={styles.versionInfo}>
          <Text style={[styles.versionText, { color: theme.colors.textSecondary }]}>
            MyRixi v1.0.0
          </Text>
        </View>
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
  logoutContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  logoutButton: {
    width: '100%',
  },
  versionInfo: {
    alignItems: 'center',
    paddingBottom: 32,
  },
  versionText: {
    fontSize: 14,
    opacity: 0.7,
  },
});