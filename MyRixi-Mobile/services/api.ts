import axios, { AxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token aux requêtes
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const apiPostRequest = async <T>(config: AxiosRequestConfig): Promise<T> => {
  try {
    const response = await api.post(config.url!, config.data);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const apiGetRequest = async <T>(config: AxiosRequestConfig): Promise<T> => {
  try {
    const response = await api.get(config.url!);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const apiPutRequest = async <T>(config: AxiosRequestConfig): Promise<T> => {
  try {
    const response = await api.put(config.url!, config.data);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const apiDeleteRequest = async <T>(config: AxiosRequestConfig): Promise<T> => {
  try {
    const response = await api.delete(config.url!);
    return response.data;
  } catch (error) {
    throw error;
  }
}