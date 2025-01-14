import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { client } from '../common';
import type { ResetPasswordResponse, ResetPasswordVariables } from './types';

export const ResetPasswordUser = createMutation<
  ResetPasswordResponse,
  ResetPasswordVariables,
  AxiosError
>({
  mutationFn: async (variables) =>
    client({
      url: '/api/reset-password', // URL API untuk reset password
      method: 'PUT',
      data: variables, // Variabel yang berisi password lama, baru, dan konfirmasi
    }).then((response) => response.data),
});
