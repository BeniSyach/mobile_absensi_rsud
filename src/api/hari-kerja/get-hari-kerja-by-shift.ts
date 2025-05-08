import { type AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { getMessage } from '@/lib/message-storage';

import { client } from '../common';
import type { HariKerjaResponse } from './types';

export const useGetWaktuKerjaByShiftAndOPD = createQuery<
  HariKerjaResponse,
  void,
  AxiosError
>({
  queryKey: ['getWaktuKerjaByShiftAndOPD'] as const,
  fetcher: async () => {
    const storedMessage = getMessage();
    const response = await client({
      url: `/secured/absen-waktu-kerja`,
      method: 'GET',
      params: {
        shift_id: storedMessage?.data.shift_absen_id,
        _t: Date.now(),
      },
    });
    return response.data;
  },
});
