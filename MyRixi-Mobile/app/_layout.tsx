import { useEffect, useState } from 'react';
import { Slot, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RootLayout() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkToken();
  }, []);

  const checkToken = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        router.replace('/login');
      } else {
        router.replace('/');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return null; // Ou un composant de chargement
  }

  return <Slot />;
}