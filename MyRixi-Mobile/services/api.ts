import axios, { AxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Définissez une URL de base cohérente
export const BASE_URL = 'https://api.myrixi.com/v1';
// export const BASE_URL = 'http://172.20.10.2:5000/v1';
//export const BASE_URL = 'http://192.168.1.162:5000/v1';
const API_URL = 'https://api.myrixi.com/v1';

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
    console.log('POST API_URL', `${API_URL}${url}`);
    console.log('POST formData', formData);
    console.log('POST config', config);
    const response = await api.post(`${API_URL}${url}`, formData, config);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const apiGetRequest = async <T>(url: string, config: AxiosRequestConfig): Promise<T> => {
  try {
    console.log('GET API_URL', `${API_URL}${url}`);
    const response = await api.get(`${API_URL}${url}`, config);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const apiPutRequest = async <T>(url: string, formData: FormData, config: AxiosRequestConfig): Promise<T> => {
  try {
    console.log('PUT API_URL', `${API_URL}${url}`);
    console.log('PUT formData', formData);
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