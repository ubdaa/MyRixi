import useChannel from "@/hooks/useChannel";
import { Post } from "@/types/post";
import { useTheme } from "@/contexts/ThemeContext";
import { useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import { View, StyleSheet, Text, ScrollView, RefreshControl, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { usePosts } from "@/hooks/usePosts";
import { FloatingActionButton } from "@/components/ui/FloatingActionButton";
import { Ionicons } from "@expo/vector-icons";
import { GlassCard } from "@/components/ui/GlassCard";

function DraftCard({ draft }: { draft: Post }) {
  const { theme } = useTheme();
  
  return (
    <Pressable style={styles.cardContainer}>
      <GlassCard style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={[styles.cardTitle, { color: theme.colors.textPrimary }]}>
            {draft.title || "Brouillon sans titre"}
          </Text>
          <View style={styles.iconContainer}>
            <Ionicons name="pencil" size={18} color={theme.colors.cyberPink} />
          </View>
        </View>
        <Text
          style={[styles.cardContent, { color: theme.colors.textSecondary }]} 
          numberOfLines={2}
        >
          {draft.content || "Contenu vide"}
        </Text>
        <View style={styles.cardFooter}>
          <Text style={{ color: theme.colors.textSecondary, fontSize: 12 }}>
            Dernière modification: {new Date().toLocaleDateString()}
          </Text>
        </View>
      </GlassCard>
    </Pressable>
  );
}

export default function PostDrafts() {
  const { theme } = useTheme();
  const { communityId } = useLocalSearchParams();
  
  const { drafts, loading, refreshDrafts, createDraft } = usePosts();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (communityId) {
      refreshDrafts();
    }
  }, [communityId]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshDrafts();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background1 }]} edges={["top"]}>
      <View style={[styles.container, { backgroundColor: theme.colors.background1 }]}>
        {loading && !refreshing ? (
          <View style={styles.loadingContainer}>
            <Text style={{ color: theme.colors.textPrimary }}>Chargement...</Text>
          </View>
        ) : drafts.length > 0 ? (
          <ScrollView 
            style={{ width: "100%" }}
            contentContainerStyle={styles.scrollContent}
            refreshControl={
              <RefreshControl 
                refreshing={refreshing} 
                onRefresh={handleRefresh} 
                colors={[theme.colors.cyberPink]}
                tintColor={theme.colors.cyberPink}
              />
            }
          >
            {drafts.map((draft) => (
              <DraftCard key={draft.id} draft={draft} />
            ))}
          </ScrollView>
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={48} color={theme.colors.textSecondary} />
            <Text style={[styles.emptyText, { color: theme.colors.textPrimary }]}>
              Aucun brouillon trouvé
            </Text>
            <Text style={[styles.emptySubText, { color: theme.colors.textSecondary }]}>
              Appuyez sur + pour créer un nouveau brouillon
            </Text>
          </View>
        )}

        <FloatingActionButton
          icon="add"        
          onPress={() => {
            createDraft();
          }}
          style={{ position: "absolute", bottom: 30, right: 20 }}/>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
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
  scrollContent: {
    padding: 12,
  },
  cardContainer: {
    width: "100%",
    marginBottom: 16,
  },
  card: {
    width: "100%",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
  },
  iconContainer: {
    padding: 4,
  },
  cardContent: {
    fontSize: 14,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
  }
});