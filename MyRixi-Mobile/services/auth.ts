import { apiPostRequest } from '@/services/api';

interface AuthResponse {
  token?: string;
  message?: string;
  requiresEmailConfirmation?: boolean;
}

export const login = async (email: string, password: string) => {
  const response = await apiPostRequest<AuthResponse>('/auth/login', 
    { email, password } as any, 
    { headers: { 'Content-Type': 'application/json' } }
  );
  return response;
};

export const register = async (email: string, password: string, username: string) => {
  const response = await apiPostRequest<AuthResponse>('/auth/register', 
    { email, password, username } as any, 
    { headers: { 'Content-Type': 'application/json' } }
  );
  return response;
};