// use-login.ts
import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { client } from '../../common';
import type { LoginResponse, LoginVariables } from './types';

export const useLogin = createMutation<
  LoginResponse,
  LoginVariables,
  AxiosError
>({
  mutationFn: async (variables) =>
    client({
      url: '/api/login',
      method: 'POST',
      data: variables,
    }).then((response) => response.data),
});
