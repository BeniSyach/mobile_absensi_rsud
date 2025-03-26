import { Env } from '@env';
import axios from 'axios';
import { router } from 'expo-router';
import { Alert } from 'react-native';

import { useAuth } from '@/lib';
import { type TokenType } from '@/lib/auth/utils';
import { getMessage } from '@/lib/message-storage';

const refreshToken = async (currentToken: TokenType): Promise<TokenType> => {
  try {
    const response = await axios.post(`${Env.API_URL}/auth/refresh`, {
      refresh_token: currentToken.refresh,
    });
    return {
      access: response.data.data.access_token,
      refresh: response.data.data.refresh_token,
    };
  } catch (error) {
    handleSessionExpired();
    throw error;
  }
};

const client = axios.create({
  baseURL: Env.API_URL,
});

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

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Jika error 401 dan belum mencoba refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refresh = useAuth.getState().token?.refresh;
        if (!refresh) {
          useAuth.getState().signOut();
          return Promise.reject(error);
        }

        // Panggil refreshToken untuk mendapatkan token baru
        const response = await refreshToken({ access: '', refresh });

        const newToken = {
          access: response.access,
          refresh: response.refresh,
        };

        // Simpan token baru ke Zustand
        useAuth.getState().signIn(newToken);

        // Perbarui header Authorization dengan token baru
        originalRequest.headers['Authorization'] = `Bearer ${newToken.access}`;

        // Ulangi request yang gagal dengan token baru
        return client(originalRequest);
      } catch (refreshError) {
        console.error('Refresh token failed:', refreshError);
        useAuth.getState().signOut();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

const handleSessionExpired = async () => {
  try {
    const userNik = getMessage()?.data.nik;
    if (userNik) {
      await axios.post(`${Env.API_URL}/auth/reset-login`, { nik: userNik });
    }
  } catch (resetError) {
    console.error('Failed to reset login:', resetError);
  }

  useAuth.getState().signOut();
  router.replace('/onboarding');
  Alert.alert(
    'Sesi Berakhir',
    'Silakan login kembali untuk melanjutkan.',
    [{ text: 'OK' }],
    { cancelable: false }
  );
};

export { client };
