import axios, { AxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://10.0.2.2:5106/v1';

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
    config.headers.Authorization = `bearer ${token}`;
  }
  return config;
});

export const apiPostRequest = async <T>(url: string, formData: FormData, config: AxiosRequestConfig): Promise<T> => {
  try {
    const response = await api.post(`${API_URL}${url}`, formData, config);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const apiGetRequest = async <T>(url: string, config: AxiosRequestConfig): Promise<T> => {
  try {
    const response = await api.get(`${API_URL}${url}`, config);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const apiPutRequest = async <T>(url: string, formData: FormData, config: AxiosRequestConfig): Promise<T> => {
  try {
    const response = await api.put(`${API_URL}${url}`, formData, config);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const apiDeleteRequest = async <T>(url: string, config: AxiosRequestConfig): Promise<T> => {
  try {
    const response = await api.delete(`${API_URL}${url}`, config);
    return response.data;
  } catch (error) {
    throw error;
  }
}