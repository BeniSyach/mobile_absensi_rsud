import { Env } from '@env';
import axios from 'axios';
import { Alert } from 'react-native';

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
    const signOut = useAuth.getState().signOut;
    Alert.alert(
      'Sesi Berakhir',
      'Sesi login Anda telah berakhir. Anda akan logout.',
      [
        {
          text: 'OK',
          onPress: () => {
            signOut(); // Logout setelah menekan OK
          },
        },
      ],
      { cancelable: false } // Memastikan pengguna tidak bisa menutup alert tanpa menekan OK
    );
  }
};

// Membuat instance axios dengan interceptor untuk meng-handle token refresh otomatis
const client = axios.create({
  baseURL: Env.API_URL,
});

// Menangani request agar selalu menyertakan token dari zustand
client.interceptors.request.use(
  async (config) => {
    const token = useAuth.getState().token;
    if (!token) return config;

    // Ensure token is TokenType
    const accessToken: TokenType =
      typeof token === 'string'
        ? { access: token, refresh: '' } // Include refresh token
        : token;

    if (useAuth.getState().isTokenNearExpiration(accessToken)) {
      const newToken = await refreshToken(accessToken);
      useAuth.getState().signIn(newToken);
      config.headers['Authorization'] = `Bearer ${newToken.access}`;
    } else {
      config.headers['Authorization'] = `Bearer ${accessToken.access}`;
    }

    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    Alert.alert(
      'Sesi Berakhir',
      'Sesi login Anda telah berakhir. Anda akan logout.',
      [
        {
          text: 'OK',
          onPress: () => {
            const signOut = useAuth.getState().signOut;
            signOut(); // Logout setelah menekan OK
          },
        },
      ],
      { cancelable: false } // Memastikan pengguna tidak bisa menutup alert tanpa menekan OK
    );

    return Promise.reject(error);
  }
);

export { client };
