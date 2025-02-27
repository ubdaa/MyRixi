import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { Profile } from '@/types/profile';
import { fetchUserProfile } from '@/services/profileService';

export interface ProfileContextType {
  profile: Profile | null;
  communityProfile: Profile | null;
  loading: boolean;
  error: string | null;
  fetchProfile: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [communityProfile, setCommunityProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchUserProfile();
      setProfile(response);
    } catch (err) {
      setError('Failed to fetch profile');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    profile,
    communityProfile,
    loading,
    error,
    fetchProfile,
  }

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}