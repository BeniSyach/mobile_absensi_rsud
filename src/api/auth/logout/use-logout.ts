import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { client } from '../../common';
import type { LogoutResponse } from './types';

export const DeleteUser = createMutation<
  LogoutResponse,
  number, // ID dari user yang akan dihapus
  AxiosError
>({
  mutationFn: async (id) =>
    client({
      url: `/api/users/${id}`,
      method: 'DELETE',
    }).then((response) => response.data),
});
