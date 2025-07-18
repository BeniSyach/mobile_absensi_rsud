import { Env } from '@env';
import axios from 'axios';
import { router } from 'expo-router'; // pastikan kamu pakai expo-router
import { Alert } from 'react-native';

import { useAuth } from '@/lib';
import { type TokenType } from '@/lib/auth/utils';

// Fungsi untuk refresh token
const refreshToken = async (currentToken: TokenType): Promise<TokenType> => {
  try {
    const response = await axios.post(`${Env.API_URL}/auth-mobile/refresh`, {
      refresh_token: currentToken.refresh,
    });

    return {
      access: response.data.access_token,
      refresh: currentToken.refresh,
    };
  } catch (error) {
    throw error;
  }
};

// Axios instance
const client = axios.create({
  baseURL: Env.API_URL,
});

// Interceptor request
client.interceptors.request.use(
  (config) => {
    const token = useAuth.getState().token?.access;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor response
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as any;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const { access, refresh } = useAuth.getState().token || {};

      if (!refresh) {
        useAuth.getState().signOut();
        router.replace('/onboarding'); // langsung ke halaman login
        return Promise.reject(error);
      }

      try {
        const newToken = await refreshToken({ access: access || '', refresh });
        useAuth.getState().signIn(newToken);

        originalRequest.headers['Authorization'] = `Bearer ${newToken.access}`;
        return client(originalRequest);
      } catch (refreshError) {
        console.error('Refresh token failed:', refreshError);

        Alert.alert(
          'Sesi Berakhir',
          'Sesi Anda telah berakhir. Silakan login kembali.'
        );

        useAuth.getState().signOut();
        router.replace('/onboarding'); // redirect ke root
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export { client };
