import { Env } from '@env';
import axios from 'axios';

import { useAuth } from '@/lib/auth'; // Import dari zustand untuk mendapatkan token
import { type TokenType } from '@/lib/auth/utils';

// Fungsi untuk melakukan refresh token
const refreshToken = async (currentToken: TokenType) => {
  try {
    const response = await axios.post(`${Env.API_URL}/api/refresh`, null, {
      headers: {
        Authorization: `Bearer ${currentToken.access}`, // Use access token
      },
    });

    // Mengembalikan token baru
    return response.data.token;
  } catch (error) {
    console.error('Gagal memperbarui token:', error);
    throw error;
  }
};

// Membuat instance axios dengan interceptor untuk meng-handle token refresh otomatis
const client = axios.create({
  baseURL: Env.API_URL,
});

// Menangani request agar selalu menyertakan token dari zustand
client.interceptors.request.use(
  async (config) => {
    const token = useAuth.getState().token; // Ambil token dari zustand

    if (token && useAuth.getState().isTokenNearExpiration(token)) {
      // Jika token hampir kedaluwarsa (misalnya kurang dari 10 menit), refresh token terlebih dahulu
      const newToken = await refreshToken(token);
      useAuth.getState().signIn(newToken); // Simpan token baru ke zustand
      config.headers['Authorization'] = `Bearer ${newToken}`; // Ganti token di header
    } else if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export { client };
