import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { getMessage } from '@/lib/message-storage';

import { client } from '../common';
import type { GetShiftResponseArray } from './types'; // Import tipe yang sudah dibuat

export const GetShiftsByOpd = createQuery<
  GetShiftResponseArray,
  void,
  AxiosError
>({
  queryKey: ['getShiftsByOpd'] as const,
  fetcher: async () => {
    const storedMessage = getMessage();
    return client({
      url: '/api/shift',
      method: 'GET',
      params: {
        opd_id: storedMessage?.opd_id,
      },
    }).then((response) => response.data);
  },
});
