import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, TextInput, Alert, KeyboardAvoidingView, Platform, Pressable } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Text } from 'react-native';
import { NeoButton } from '@/components/ui/NeoButton';

export default function ContactScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  
  // États pour le formulaire
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Fonction pour envoyer le message
  const handleSubmit = () => {
    // Validation de base
    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs.");
      return;
    }
    
    // Validation email basique
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Erreur", "Veuillez entrer une adresse email valide.");
      return;
    }
    
    // Simuler l'envoi
    setIsSubmitting(true);
    
    // Ici, vous ajouteriez l'appel API réel pour envoyer le message
    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert(
        "Message envoyé", 
        "Nous avons bien reçu votre message et vous répondrons dans les plus brefs délais.",
        [{ text: "OK", onPress: () => router.back() }]
      );
      
      // Reset form
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    }, 1500);
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background1 }]}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [
            styles.backButton,
            {
              backgroundColor: pressed
                ? theme.colors.synthGreen
                : theme.colors.technoBlue,
              opacity: pressed ? 0.9 : 1,
            },
          ]}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </Pressable>
        <Text style={[styles.headerTitle, { color: theme.colors.textPrimary }]}>
          Contact
        </Text>
        <View style={{ width: 40 }} />
      </View>
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Nous contacter
          </Text>
          
          <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
            Vous avez une question ou besoin d'aide ? N'hésitez pas à nous contacter via le formulaire ci-dessous, nous vous répondrons dans les plus brefs délais.
          </Text>
          
          <View style={styles.contactInfo}>
            <View style={styles.contactItem}>
              <Ionicons name="mail-outline" size={20} color={theme.colors.technoBlue} />
              <Text style={[styles.contactText, { color: theme.colors.textSecondary }]}>
                support@myrixi.com
              </Text>
            </View>
            
            <View style={styles.contactItem}>
              <Ionicons name="call-outline" size={20} color={theme.colors.technoBlue} />
              <Text style={[styles.contactText, { color: theme.colors.textSecondary }]}>
                +33 1 23 45 67 89
              </Text>
            </View>
          </View>
          
          <View style={styles.formContainer}>
            <Text style={[styles.formLabel, { color: theme.colors.textPrimary }]}>Votre nom</Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.colors.background2, 
                color: theme.colors.textPrimary,
                borderColor: theme.colors.divider
              }]}
              placeholder="Entrez votre nom"
              placeholderTextColor={theme.colors.textSecondary}
              value={name}
              onChangeText={setName}
            />
            
            <Text style={[styles.formLabel, { color: theme.colors.textPrimary }]}>Votre email</Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.colors.background2, 
                color: theme.colors.textPrimary,
                borderColor: theme.colors.divider
              }]}
              placeholder="Entrez votre email"
              placeholderTextColor={theme.colors.textSecondary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            
            <Text style={[styles.formLabel, { color: theme.colors.textPrimary }]}>Sujet</Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.colors.background2, 
                color: theme.colors.textPrimary,
                borderColor: theme.colors.divider
              }]}
              placeholder="Objet de votre message"
              placeholderTextColor={theme.colors.textSecondary}
              value={subject}
              onChangeText={setSubject}
            />
            
            <Text style={[styles.formLabel, { color: theme.colors.textPrimary }]}>Votre message</Text>
            <TextInput
              style={[styles.textArea, { 
                backgroundColor: theme.colors.background2, 
                color: theme.colors.textPrimary,
                borderColor: theme.colors.divider
              }]}
              placeholder="Décrivez votre problème ou votre question..."
              placeholderTextColor={theme.colors.textSecondary}
              value={message}
              onChangeText={setMessage}
              multiline={true}
              numberOfLines={6}
              textAlignVertical="top"
            />
            
            <NeoButton
              title={isSubmitting ? "Envoi en cours..." : "Envoyer le message"}
              onPress={handleSubmit}
              variant="primary"
              accentColor={theme.colors.synthGreen}
              size="large"
              style={styles.submitButton}
              disabled={isSubmitting}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 24,
  },
  contactInfo: {
    marginBottom: 24,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactText: {
    fontSize: 16,
    marginLeft: 10,
  },
  formContainer: {
    marginBottom: 40,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
  },
  textArea: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingTop: 12,
    fontSize: 16,
    borderWidth: 1,
  },
  submitButton: {
    marginTop: 24,
  },
});