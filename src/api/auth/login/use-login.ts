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
        variables
      );

      return response.data; // Mengembalikan response sesuai tipe LoginResponse
    } catch (error) {
      throw error; // Tetap melempar error agar bisa ditangani oleh React Query
    }
  },
});
