import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client } from '../common';
import type { GenderResponse } from './types'; // Import tipe yang sudah dibuat

export const GetGender = createQuery<GenderResponse[], void, AxiosError>({
  queryKey: ['getGender'] as const,
  fetcher: async () =>
    client({
      url: '/api/gender',
      method: 'GET',
    }).then((response) => response.data),
});
