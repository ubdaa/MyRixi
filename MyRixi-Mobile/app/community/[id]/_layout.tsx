import { Tabs } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import { useCommunity } from '@/contexts/CommunityContext';

export default function CommunityLayout() {
  const { id } = useLocalSearchParams();
  const { communities } = useCommunity();

  const community = communities.find((c) => c.id === id);

  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "Aperçu",
          // Vous pouvez personnaliser avec des icônes, etc.
        }}
      />
      <Tabs.Screen
        name="posts"
        options={{
          title: "Publications",
        }}
      />
      <Tabs.Screen
        name="chats"
        options={{
          title: "Discussions",
        }}
      />
      <Tabs.Screen
        name="members"
        options={{
          title: "Membres",
        }}
      />
    </Tabs>
  );
}