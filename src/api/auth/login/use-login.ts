// use-login.ts
import { type AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { client } from '../../common';
import type { LoginResponse, LoginVariables } from './types';

export const useLogin = createMutation<
  LoginResponse,
  LoginVariables,
  AxiosError
>({
  mutationFn: async (variables) => {
    try {
      const response = await client({
        url: '/api/login',
        method: 'POST',
        data: variables,
      });

      // Mengembalikan data jika berhasil
      return response.data;
    } catch (error) {
      // Menangani kesalahan dan melempar error
      throw error; // Lempar kembali error agar bisa ditangani oleh React Query
    }
  },
});
