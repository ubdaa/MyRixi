import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';

export default function Index() {
  const { isLoading, token } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      router.replace(token ? '/home' : '/login');
    }
  }, [isLoading, token]);

  return null; // ou un composant de chargement
}