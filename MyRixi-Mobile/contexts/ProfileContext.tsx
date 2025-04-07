import React, { createContext, useState, useContext, useCallback, ReactNode } from 'react';
import { fetchUserProfile } from '@/services/profileService';
import { ProfileDto } from '@/types/profile';

interface ProfileContextType {
  profile: ProfileDto | null;
  loading: boolean;
  error: string | null;
  fetchProfile: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType>({
  profile: null,
  loading: false,
  error: null,
  fetchProfile: async () => {},
});

export const useProfile = () => useContext(ProfileContext);

interface ProfileProviderProps {
  children: ReactNode;
}

export const ProfileProvider: React.FC<ProfileProviderProps> = ({ children }) => {
  const [profile, setProfile] = useState<ProfileDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedProfile = await fetchUserProfile();
      setProfile(fetchedProfile);
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <ProfileContext.Provider value={{ profile, loading, error, fetchProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};