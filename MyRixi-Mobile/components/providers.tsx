import { AuthProvider } from "@/contexts/AuthContext";
import { CommunityProvider } from "@/contexts/CommunityContext";
import { ProfileProvider } from "@/contexts/ProfileContext";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <ProfileProvider>
          <CommunityProvider>
            {children}
          </CommunityProvider>
        </ProfileProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}