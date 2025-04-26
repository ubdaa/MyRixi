import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { login } from "@/services/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { GlassInput } from "@/components/ui/GlassInput";
import { NeoButton } from "@/components/ui/NeoButton";
import { useTheme } from "@/contexts/ThemeContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const router = useRouter();
  const { theme, colorMode } = useTheme();

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await login(email, password);
      await AsyncStorage.setItem("token", response.token);
      router.replace("/home");
    } catch (err) {
      setError("Email ou mot de passe incorrect");
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
        <View style={styles.logoContainer}>
          <Image
            source={require("@/assets/images/icon.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={[styles.title, { color: theme.colors.textPrimary }]}>Bienvenue</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>Connectez-vous pour continuer</Text>
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
            label="Mot de passe"
            placeholder="Entrez votre mot de passe"
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

          <TouchableOpacity 
            style={styles.forgotPassword}
            onPress={() => {/* Navigation vers récupération mot de passe */}}
          >
            <Text style={[styles.forgotPasswordText, { color: theme.colors.technoBlue }]}>
              Mot de passe oublié?
            </Text>
          </TouchableOpacity>

          <NeoButton
            title="Se connecter"
            onPress={handleLogin}
            loading={loading}
            disabled={loading}
            style={styles.loginButton}
            size="large"
          />
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.colors.textSecondary }]}>Vous n'avez pas de compte? </Text>
          <TouchableOpacity onPress={() => router.replace("/register")}>
            <Text style={[styles.footerLink, { color: theme.colors.technoBlue }]}>S'inscrire</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 60,
    marginBottom: 30,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
    borderRadius: 10,
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
    marginBottom: 30,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 25,
  },
  forgotPasswordText: {
    fontSize: 14,
  },
  error: {
    marginBottom: 15,
    textAlign: "center",
  },
  loginButton: {
    marginTop: 10,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  footerText: {
    fontSize: 15,
  },
  footerLink: {
    fontSize: 15,
    fontWeight: "600",
  },
});
