import { type AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { getMessage } from '@/lib/message-storage';

import { client } from '../common';
import type { ShiftWaktuResponse } from './types';

export const useGetWaktuKerjaByShiftAndOPD = createQuery<
  ShiftWaktuResponse,
  void,
  AxiosError
>({
  queryKey: ['getWaktuKerjaByShiftAndOPD'] as const,
  fetcher: async () => {
    const storedMessage = getMessage();
    const response = await client({
      url: `/aggregation/waktu-kerja/shift/${storedMessage?.shift_absen_id}`,
      method: 'GET',
      params: {
        _t: Date.now(),
      },
    });
    return response.data;
  },
});
