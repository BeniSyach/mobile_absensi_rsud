import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { client } from '../common';
import type { EditUserResponse, EditUserVariables } from './types';

export const PutUser = createMutation<
  EditUserResponse,
  EditUserVariables,
  AxiosError
>({
  mutationFn: async (variables) =>
    client({
      url: `/api/users/${variables.id}`, // Menyertakan ID dalam URL
      method: 'PUT',
      data: variables, // Mengirimkan data user yang diupdate
    }).then((response) => response.data),
});
