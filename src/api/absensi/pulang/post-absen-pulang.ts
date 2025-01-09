import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { client } from '../../common';
import type { AbsenPulangResponse, AbsenPulangVariables } from './types';

export const PostAbsenPulang = createMutation<
  AbsenPulangResponse,
  AbsenPulangVariables,
  AxiosError
>({
  mutationFn: async (variables) =>
    client({
      url: '/api/absen-pulang',
      method: 'POST',
      data: variables,
    }).then((response) => response.data),
});
