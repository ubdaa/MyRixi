import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';
import { apiGetRequest } from '@/services/api';

interface TokenCheckResponse {
  message?: string;
}

export default function Index() {
  const { isLoading, token } = useAuth();

  // on appelle /auth/check-token pour vérifier si le token est valide
  // et on redirige vers /home ou /login en fonction du résultat
  useEffect(() => {
    const checkToken = async () => {
      try {
        const reponse = await apiGetRequest<TokenCheckResponse>('/auth/check-token', {});

        console.log('Token check response:', reponse);
        if (reponse.message)
          return true;
        return false;
      } catch (error) {
        return false;
      }
    };

    if (!isLoading) {
      checkToken().then(isValidToken => {
        router.replace(isValidToken ? '/home' : '/login');
      });
    }

  }, [isLoading, token]);

  return null;
}