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
      const nik = variables.nik.replace(/['"]/g, '');

      // jalankan dua request bersamaan
      await axios.post<LoginResponse>(
        `https://ekin-deliserdangsehat.deliserdangkab.go.id/api/login-mobile`,
        {
          nik,
          password: variables.password,
          device_token: variables.device_token,
        }
      );

      const responseMain = await axios.post<LoginResponse>(
        `${Env.API_URL}/auth-mobile/login`,
        {
          nik,
          password: variables.password,
          device_token: variables.device_token,
        }
      );

      return responseMain.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error('Server Error:', error.response.data);
          throw new Error(
            `Server responded with error: ${JSON.stringify(error.response.data)}`
          );
        } else if (error.request) {
          console.error('No response received:', error.request);
          throw new Error('No response received from server');
        } else {
          console.error('Axios config error:', error.message);
          throw new Error(`Axios error: ${error.message}`);
        }
      } else {
        throw new Error(`Unexpected error: ${String(error)}`);
      }
    }
  },
});
