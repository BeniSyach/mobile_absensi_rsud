import { Env } from '@env';
import axios, { type AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import type { LoginResponse, LoginVariables } from './types';

export const useLogin = createMutation<
  LoginResponse,
  LoginVariables,
  AxiosError
>({
  mutationFn: async (variables) => {
    try {
      const response = await axios.post<LoginResponse>(
        `${Env.API_URL}/auth/login`,
        {
          nik: variables.nik.replace(/['"]/g, ''),
          password: variables.password,
          device_token: variables.device_token,
        }
      );

      return response.data; // Mengembalikan response sesuai tipe LoginResponse
    } catch (error) {
      // Pakai axios.isAxiosError untuk akses properti lebih aman
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // Server merespons dengan kode error (misalnya 400, 500)
          console.error('Server Error:', error.response.data);
          throw new Error(
            `Server responded with error: ${JSON.stringify(error.response.data)}`
          );
        } else if (error.request) {
          // Request berhasil dikirim tapi tidak ada respons
          console.error('No response received:', error.request);
          throw new Error('No response received from server');
        } else {
          // Error lainnya (mungkin karena konfigurasi axios atau runtime)
          console.error('Axios config error:', error.message);
          throw new Error(`Axios error: ${error.message}`);
        }
      } else {
        // Bukan error dari axios (error biasa)
        throw new Error(`Unexpected error: ${String(error)}`);
      }
    }
  },
});
