import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { register } from "@/services/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { GlassInput } from "@/components/ui/GlassInput";
import { NeoButton } from "@/components/ui/NeoButton";
import { useTheme } from "@/contexts/ThemeContext";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const router = useRouter();
  const { theme, colorMode } = useTheme();

  const handleRegister = async () => {
    if (!email || !password || !username) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await register(email, password, username);
      await AsyncStorage.setItem("token", response.token);
      router.replace("/home");
    } catch (err) {
      setError("Cette adresse email est déjà utilisée");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background1 }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.logoContainer}>
            <Image
              source={require("@/assets/images/icon.png")}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={[styles.title, { color: theme.colors.textPrimary }]}>Créer un compte</Text>
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
              Rejoignez vos amis et connectez vous à vos intérêts
            </Text>
          </View>

          <View style={styles.formContainer}>
            <GlassInput
              label="Email"
              placeholder="Entrez votre email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              rightIcon={<Ionicons name="mail-outline" size={20} color={theme.colors.textSecondary} />}
            />

            <GlassInput
              label="Nom d'utilisateur"
              placeholder="Choisissez un nom d'utilisateur"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              rightIcon={<Ionicons name="person-outline" size={20} color={theme.colors.textSecondary} />}
            />

            <GlassInput
              label="Mot de passe"
              placeholder="Créez un mot de passe sécurisé"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={secureTextEntry}
              rightIcon={
                <TouchableOpacity onPress={() => setSecureTextEntry(!secureTextEntry)}>
                  <Ionicons
                    name={secureTextEntry ? "eye-outline" : "eye-off-outline"}
                    size={20}
                    color={theme.colors.textSecondary}
                  />
                </TouchableOpacity>
              }
            />

            {error ? <Text style={[styles.error, { color: theme.colors.neoRed }]}>{error}</Text> : null}

            <NeoButton
              title="S'inscrire"
              onPress={handleRegister}
              loading={loading}
              disabled={loading}
              style={styles.registerButton}
              size="large"
            />
          </View>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: theme.colors.textSecondary }]}>Vous avez déjà un compte? </Text>
            <TouchableOpacity onPress={() => router.replace("/login")}>
              <Text style={[styles.footerLink, { color: theme.colors.technoBlue }]}>Se connecter</Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.terms, { color: theme.colors.textSecondary + '99' }]}>
            En vous inscrivant, vous acceptez nos conditions d'utilisation et
            notre politique de confidentialité
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 50,
    marginBottom: 30,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  formContainer: {
    paddingHorizontal: 25,
    marginBottom: 20,
  },
  registerButton: {
    marginTop: 10,
  },
  error: {
    marginBottom: 15,
    textAlign: "center",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  footerText: {
    fontSize: 15,
  },
  footerLink: {
    fontSize: 15,
    fontWeight: "600",
  },
  terms: {
    textAlign: "center",
    fontSize: 12,
    paddingHorizontal: 30,
  },
});
