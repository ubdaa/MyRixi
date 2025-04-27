import React from 'react';
import { StyleSheet, View, ScrollView, Pressable } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Text } from 'react-native';
import { NeoButton } from '@/components/ui/NeoButton';

export default function TermsScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background1 }]}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={({pressed}) => [
        styles.backButton,
        {
          backgroundColor: pressed ? theme.colors.synthGreen : theme.colors.technoBlue,
          opacity: pressed ? 0.9 : 1,
        },
          ]}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </Pressable>
        <Text style={[styles.headerTitle, { color: theme.colors.textPrimary }]}>
          Conditions d'utilisation
        </Text>
        <View style={{ width: 40 }} />
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Text style={[styles.lastUpdated, { color: theme.colors.textSecondary }]}>
          Dernière mise à jour : 27 avril 2025
        </Text>
        
        <View style={styles.termsSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            1. Introduction
          </Text>
          <Text style={[styles.termsText, { color: theme.colors.textSecondary }]}>
            Bienvenue dans MyRixi. Ces Conditions d'utilisation régissent votre accès et votre utilisation de l'application mobile MyRixi, ainsi que tous les contenus, fonctionnalités et services associés (collectivement désignés comme le "Service").
          </Text>
          <Text style={[styles.termsText, { color: theme.colors.textSecondary }]}>
            En accédant ou en utilisant notre Service, vous acceptez d'être lié par ces Conditions. Si vous n'acceptez pas ces Conditions, vous ne devez pas accéder ou utiliser le Service.
          </Text>
        </View>
        
        <View style={styles.termsSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            2. Compte utilisateur
          </Text>
          <Text style={[styles.termsText, { color: theme.colors.textSecondary }]}>
            Pour utiliser certaines fonctionnalités du Service, vous devrez créer un compte. Vous êtes responsable du maintien de la confidentialité de votre compte et de votre mot de passe, et vous acceptez la responsabilité de toutes les activités qui se produisent sous votre compte.
          </Text>
          <Text style={[styles.termsText, { color: theme.colors.textSecondary }]}>
            Vous acceptez de nous fournir des informations précises, actuelles et complètes lors de la création de votre compte et de mettre à jour ces informations pour les maintenir précises.
          </Text>
        </View>
        
        <View style={styles.termsSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            3. Droits de propriété intellectuelle
          </Text>
          <Text style={[styles.termsText, { color: theme.colors.textSecondary }]}>
            Le Service et tout son contenu original, fonctionnalités et fonctionnalités sont et resteront la propriété exclusive de MyRixi et de ses concédants. Le Service est protégé par le droit d'auteur, les marques commerciales et autres lois en France et à l'étranger.
          </Text>
          <Text style={[styles.termsText, { color: theme.colors.textSecondary }]}>
            Vous ne pouvez pas utiliser le nom, le logo ou d'autres marques de MyRixi sans notre consentement écrit préalable.
          </Text>
        </View>
        
        <View style={styles.termsSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            4. Contenu de l'utilisateur
          </Text>
          <Text style={[styles.termsText, { color: theme.colors.textSecondary }]}>
            Notre Service peut vous permettre de publier, de lier, de stocker, de partager et de mettre à disposition certaines informations, textes, graphiques, vidéos ou autres contenus ("Contenu de l'utilisateur"). Vous êtes responsable du Contenu de l'utilisateur que vous publiez sur ou via le Service, y compris sa légalité, sa fiabilité et son caractère approprié.
          </Text>
          <Text style={[styles.termsText, { color: theme.colors.textSecondary }]}>
            En publiant du Contenu de l'utilisateur sur ou via le Service, vous nous accordez le droit d'utiliser, de modifier, d'exécuter publiquement, d'afficher publiquement, de reproduire et de distribuer ce Contenu de l'utilisateur sur et via le Service.
          </Text>
        </View>
        
        <View style={styles.termsSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            5. Confidentialité
          </Text>
          <Text style={[styles.termsText, { color: theme.colors.textSecondary }]}>
            Votre vie privée est importante pour nous. Veuillez consulter notre Politique de confidentialité pour comprendre nos pratiques concernant la collecte, l'utilisation et la divulgation de vos informations personnelles.
          </Text>
        </View>
        
        <View style={styles.termsSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            6. Limitation de responsabilité
          </Text>
          <Text style={[styles.termsText, { color: theme.colors.textSecondary }]}>
            En aucun cas, MyRixi, ses administrateurs, employés ou agents ne seront responsables de tout dommage direct, indirect, accessoire, spécial, consécutif ou punitif, y compris, sans limitation, la perte de profits, de données, d'utilisation, de bonne volonté ou d'autres pertes intangibles, résultant de votre accès ou de votre utilisation ou de votre incapacité à accéder ou à utiliser le Service.
          </Text>
        </View>
        
        <View style={styles.termsSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            7. Modifications
          </Text>
          <Text style={[styles.termsText, { color: theme.colors.textSecondary }]}>
            Nous nous réservons le droit de modifier ou de remplacer ces Conditions à tout moment à notre seule discrétion. Si une révision est importante, nous essaierons de fournir un préavis d'au moins 15 jours avant que les nouvelles conditions ne prennent effet.
          </Text>
        </View>
        
        <View style={styles.termsSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            8. Contact
          </Text>
          <Text style={[styles.termsText, { color: theme.colors.textSecondary }]}>
            Si vous avez des questions concernant ces Conditions, veuillez nous contacter à contact@myrixi.com.
          </Text>
        </View>
        
        <View style={styles.actionButtons}>
          <NeoButton
            title="Politique de confidentialité"
            onPress={() => console.log('Navigate to privacy policy')}
            variant="outline"
            accentColor={theme.colors.technoBlue}
            size="medium"
            style={styles.actionButton}
          />
          <NeoButton
            title="Nous contacter"
            onPress={() => router.push("/settings/contact")}
            variant="outline"
            accentColor={theme.colors.technoBlue}
            size="medium"
            style={styles.actionButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  lastUpdated: {
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 24,
  },
  termsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  termsText: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 24,
    flexWrap: 'wrap',
  },
  actionButton: {
    minWidth: '48%',
    marginBottom: 12,
  },
});