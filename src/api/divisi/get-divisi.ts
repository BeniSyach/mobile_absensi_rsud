import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { getMessage } from '@/lib/message-storage';

import { client } from '../common';
import type { DivisiResponse } from './types'; // Import tipe yang sudah dibuat

export const GetDivisi = createQuery<DivisiResponse[], void, AxiosError>({
  queryKey: ['getDivisi'] as const,
  fetcher: async () => {
    const storedMessage = getMessage();
    return client({
      url: '/api/divisi',
      method: 'GET',
      params: {
        opd_id: storedMessage?.opd_id,
      },
    }).then((response) => response.data);
  },
});
