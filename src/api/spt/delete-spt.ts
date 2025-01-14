import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { client } from '../common';
import type { DeleteSPTResponse } from './types';

export const DeleteSPT = createMutation<
  DeleteSPTResponse,
  number, // ID dari SPT yang akan dihapus
  AxiosError
>({
  mutationFn: async (id) =>
    client({
      url: `/api/spt/${id}`,
      method: 'DELETE',
    }).then((response) => response.data),
});
