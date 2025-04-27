import React from "react";
import { StyleSheet, View, ScrollView, Pressable } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Text } from "react-native";
import { NeoButton } from "@/components/ui/NeoButton";

// Type definition for FAQItem props
interface FAQItemProps {
  question: string;
  answer: string;
  theme: any;
}

// Composant pour un élément de FAQ
const FAQItem = ({ question, answer, theme }: FAQItemProps) => {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <View
      style={[
        styles.faqItem,
        {
          backgroundColor: theme.colors.background2,
          borderColor: theme.colors.divider,
        },
      ]}
    >
      <View
        style={styles.faqQuestion}
        onTouchEnd={() => setExpanded(!expanded)}
      >
        <Text
          style={[styles.questionText, { color: theme.colors.textPrimary }]}
        >
          {question}
        </Text>
        <Ionicons
          name={expanded ? "chevron-up" : "chevron-down"}
          size={20}
          color={theme.colors.textPrimary}
        />
      </View>
      {expanded && (
        <View style={styles.faqAnswer}>
          <Text
            style={[styles.answerText, { color: theme.colors.textSecondary }]}
          >
            {answer}
          </Text>
        </View>
      )}
    </View>
  );
};

export default function FAQScreen() {
  const { theme } = useTheme();
  const router = useRouter();

  // Liste des questions fréquentes
  const faqItems = [
    {
      question: "Comment créer un compte ?",
      answer:
        "Pour créer un compte, téléchargez l'application MyRixi, ouvrez-la et appuyez sur 'S'inscrire'. Remplissez ensuite le formulaire avec votre email, votre nom d'utilisateur et votre mot de passe, puis validez votre inscription.",
    },
    {
      question: "Comment réinitialiser mon mot de passe ?",
      answer:
        "Pour réinitialiser votre mot de passe, allez sur l'écran de connexion et appuyez sur 'Mot de passe oublié'. Entrez votre email et suivez les instructions envoyées à votre adresse pour créer un nouveau mot de passe.",
    },
    {
      question: "Est-ce que l'application est gratuite ?",
      answer:
        "Oui, l'application MyRixi est entièrement gratuite à télécharger et à utiliser. Certaines fonctionnalités premium pourraient nécessiter un abonnement dans le futur, mais toutes les fonctionnalités de base resteront gratuites.",
    },
    {
      question: "Comment contacter le support ?",
      answer:
        "Vous pouvez contacter notre équipe de support via la page 'Contact' dans les paramètres de l'application, ou en envoyant un email directement à support@myrixi.com.",
    },
    {
      question: "Comment supprimer mon compte ?",
      answer:
        "Pour supprimer votre compte, allez dans les paramètres, sélectionnez 'Compte', puis 'Supprimer mon compte'. Vous devrez confirmer cette action et entrer votre mot de passe pour des raisons de sécurité.",
    },
    {
      question: "Mes données sont-elles sécurisées ?",
      answer:
        "Oui, nous prenons la sécurité très au sérieux. Toutes vos données sont cryptées et stockées de manière sécurisée. Nous ne partageons jamais vos informations personnelles avec des tiers sans votre consentement explicite.",
    },
  ];

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background1 }]}
    >
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
          FAQ
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}
        >
          Foire aux questions
        </Text>

        <Text
          style={[styles.description, { color: theme.colors.textSecondary }]}
        >
          Retrouvez les réponses aux questions les plus fréquemment posées. Si
          vous ne trouvez pas votre réponse, n'hésitez pas à nous contacter
          directement.
        </Text>

        <View style={styles.faqList}>
          {faqItems.map((item, index) => (
            <FAQItem
              key={index}
              question={item.question}
              answer={item.answer}
              theme={theme}
            />
          ))}
        </View>

        <View style={styles.contactSection}>
          <Text
            style={[styles.contactText, { color: theme.colors.textSecondary }]}
          >
            Vous n'avez pas trouvé votre réponse ?
          </Text>
          <NeoButton
            title="Nous contacter"
            onPress={() => router.push("/settings/contact")}
            variant="primary"
            accentColor={theme.colors.technoBlue}
            size="medium"
            style={styles.contactButton}
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 24,
  },
  faqList: {
    marginBottom: 24,
  },
  faqItem: {
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    overflow: "hidden",
  },
  faqQuestion: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  questionText: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
  faqAnswer: {
    padding: 16,
    paddingTop: 0,
  },
  answerText: {
    fontSize: 14,
    lineHeight: 20,
  },
  contactSection: {
    alignItems: "center",
    marginVertical: 24,
    padding: 16,
  },
  contactText: {
    fontSize: 16,
    marginBottom: 16,
  },
  contactButton: {
    minWidth: 200,
  },
});
