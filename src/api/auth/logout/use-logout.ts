import { Env } from '@env';
import type { AxiosError } from 'axios';
import axios from 'axios';
import { createMutation } from 'react-query-kit';

import { getToken } from '@/lib/auth/utils';

import type { LogoutResponse } from './types';

export const LogoutUser = createMutation<LogoutResponse, void, AxiosError>({
  mutationFn: async () => {
    const token = await getToken();

    const response = await axios({
      url: `${Env.API_URL}/auth-mobile/logout`,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token.access}`,
      },
      data: {
        refreshToken: token.refresh, // dikirim di body
      },
    }).catch((error) => {
      console.error('Logout API error 1:', error);
    });

    return response?.data;
  },
});
