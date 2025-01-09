import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { client } from '../common';
import type { ResetPasswordResponse, ResetPasswordVariables } from './types';

export const ResetPassword = createMutation<
  ResetPasswordResponse,
  ResetPasswordVariables,
  AxiosError
>({
  mutationFn: async (variables) =>
    client({
      url: '/api/users/reset-password', // URL API untuk reset password
      method: 'POST',
      data: variables, // Variabel yang berisi password lama, baru, dan konfirmasi
    }).then((response) => response.data),
});
