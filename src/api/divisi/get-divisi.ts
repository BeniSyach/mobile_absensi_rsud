import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client } from '../common';
import type { DivisiResponse } from './types'; // Import tipe yang sudah dibuat

export const GetDivisi = createQuery<DivisiResponse[], void, AxiosError>({
  queryKey: ['getDivisi'] as const,
  fetcher: async () =>
    client({
      url: '/api/divisi',
      method: 'GET',
    }).then((response) => response.data),
});
