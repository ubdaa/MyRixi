import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';
import { apiGetRequest } from '@/services/api';

export default function Index() {
  const { isLoading, token } = useAuth();

  // on appelle /auth/check-token pour vérifier si le token est valide
  // et on redirige vers /home ou /login en fonction du résultat
  useEffect(() => {
    const checkToken = async () => {
      try {
        const reponse = await apiGetRequest('/auth/check-token', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if ((reponse as { message?: string }).message) {
          router.replace('/home');
        }

        router.replace('/login');
      } catch (error) {
        console.error('Error checking token:', error);
        // Si le token est invalide, on redirige vers /login
        router.replace('/login');
      }
    };

    if (token) {
      checkToken();
    }
  }, [token]);

  return null; // ou un composant de chargement
}