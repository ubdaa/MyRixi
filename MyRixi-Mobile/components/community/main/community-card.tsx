import React, { useCallback, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ViewStyle,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GlassCard } from "@/components/ui/GlassCard";
import { useTheme } from "@/contexts/ThemeContext";
import { Community } from "@/types/community";
import { fetchCommunityMembers } from "@/services/communityService";

interface CommunityCardProps {
  community: Community;
  onPress: (id: string | number) => void;
  style?: ViewStyle;
}

export function CommunityCard({
  community,
  onPress,
  style,
}: CommunityCardProps) {
  const { theme } = useTheme();
  const [totalMembers, setTotalMembers] = useState(0);

  const loadMembers = useCallback(
    async () => {
      if (!community.id || Array.isArray(community.id)) return;

      try {
        const response = await fetchCommunityMembers(community.id, 1, 1, "");

        setTotalMembers(response.totalCount);
      } catch (error) {
        console.error("Failed to load community members:", error);
      } finally {
      }
    },
    [community.id]
  );

  useEffect(() => {
    loadMembers();
  }, []);

  return (
    <TouchableOpacity onPress={() => onPress(community.id)}>
      <GlassCard style={styles.card}>
        <View style={styles.content}>
          <Image
            source={{
              uri: community.coverUrl || "https://via.placeholder.com/60",
            }}
            style={styles.icon}
          />

          <View style={styles.info}>
            <Text
              style={[styles.name, { color: theme.colors.textPrimary }]}
              numberOfLines={1}
            >
              {community.name}
            </Text>

            <Text
              style={[
                styles.description,
                { color: theme.colors.textSecondary },
              ]}
              numberOfLines={2}
            >
              {community.description || "Pas de description"}
            </Text>

            <View style={styles.metaContainer}>
              <View style={styles.metaItem}>
                <Ionicons
                  name="people-outline"
                  size={14}
                  color={theme.colors.textSecondary}
                />
                <Text
                  style={[
                    styles.metaText,
                    { color: theme.colors.textSecondary },
                  ]}
                >
                  {totalMembers} membres
                </Text>
              </View>

              {community.isPrivate && (
                <View style={styles.metaItem}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={14}
                    color={theme.colors.technoBlue}
                  />
                  <Text
                    style={[
                      styles.metaText,
                      { color: theme.colors.technoBlue },
                    ]}
                  >
                    Privé
                  </Text>
                </View>
              )}
            </View>
          </View>

          <Ionicons
            name="chevron-forward"
            size={20}
            color={theme.colors.textSecondary}
            style={styles.arrow}
          />
        </View>
      </GlassCard>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
  },
  card: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginRight: 12,
  },
  info: {
    flex: 1,
    marginRight: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    marginBottom: 6,
  },
  metaContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
  },
  metaText: {
    fontSize: 12,
    marginLeft: 4,
  },
  arrow: {
    marginLeft: "auto",
  },
});
