import useChannel from "@/hooks/useChannel";
import { Post } from "@/types/post";
import { useTheme } from "@/contexts/ThemeContext";
import { useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import { View, StyleSheet, Text, ScrollView } from "react-native";
import { usePosts } from "@/hooks/usePosts";
import { FloatingActionButton } from "@/components/ui/FloatingActionButton";
import { Ionicons } from "@expo/vector-icons";

function DraftCard({ draft }: { draft: Post }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{draft.title}</Text>
      <Text style={styles.cardContent}>{draft.content}</Text>
    </View>
  );
}

export default function PostDrafts() {
  const { theme } = useTheme();
  const { communityId } = useLocalSearchParams();
  
  const { drafts, loading, refreshDrafts, createDraft } = usePosts();
  const [draftsList, setDraftsList] = useState<Post[]>([]);

  useEffect(() => {
    if (communityId) {
      refreshDrafts();
    }
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background1 }]}>

      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={{ color: theme.colors.textPrimary }}>Chargement...</Text>
        </View>
      ) : drafts.length > 0 ? (
        <ScrollView style={{ width: "100%" }}>
          {drafts.map((draft) => (
            <DraftCard key={draft.id} draft={draft} />
          ))}
        </ScrollView>
      ) : (
        <Text style={{ color: theme.colors.textPrimary }}>Aucun brouillon trouvé</Text>
      )}

      <FloatingActionButton
        icon="add"        
        onPress={() => {
          createDraft();
        }}
        style={{ position: "absolute", bottom: 30, right: 20 }}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    margin: 8,
    borderRadius: 8,
    width: "90%",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  cardContent: {
    fontSize: 14,
    color: "#555",
  },
});