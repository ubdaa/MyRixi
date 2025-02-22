import axios from 'axios';

const API_URL = 'http://localhost:3000';

export const login = async (email: string, password: string) => {
  const response = await axios.post(`${API_URL}/v1/auth/login`, {
    email,
    password,
  });
  return response.data;
};

export const register = async (email: string, password: string, username: string) => {
  const response = await axios.post(`${API_URL}/v1/auth/register`, {
    email,
    password,
    username,
  });
  return response.data;
};