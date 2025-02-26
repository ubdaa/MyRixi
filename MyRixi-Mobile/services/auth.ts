import axios from 'axios';
import { Platform } from 'react-native';

const API_URL = Platform.OS === "android" ? 'http://10.0.2.2:5000/v1' : 'http://172.20.10.2:5000/v1';

export const login = async (email: string, password: string) => {
  const response = await axios.post(`${API_URL}/auth/login`, {
    email,
    password,
  });
  return response.data;
};

export const register = async (email: string, password: string, username: string) => {
  const response = await axios.post(`${API_URL}/auth/register`, {
    email,
    password,
    username,
  });
  return response.data;
};