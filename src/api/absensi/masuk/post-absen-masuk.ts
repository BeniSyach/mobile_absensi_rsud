import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { client } from '../../common';
import type { AbsenMasukResponse, AbsenMasukVariables } from './types';

export const PostAbsenMasuk = createMutation<
  AbsenMasukResponse,
  AbsenMasukVariables,
  AxiosError
>({
  mutationFn: async (variables) =>
    client({
      url: '/api/absen-masuk',
      method: 'POST',
      data: variables,
    }).then((response) => response.data),
});
