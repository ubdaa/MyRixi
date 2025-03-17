import { AuthProvider } from "@/contexts/AuthContext";
import { CommunityProvider } from "@/contexts/CommunityContext";
import { ProfileProvider } from "@/contexts/ProfileContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <AuthProvider>
          <ProfileProvider>
            <CommunityProvider>
              {children}
            </CommunityProvider>
          </ProfileProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}