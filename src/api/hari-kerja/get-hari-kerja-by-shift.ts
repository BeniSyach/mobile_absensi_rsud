import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { getMessage } from '@/lib/message-storage';

import { client } from '../common';
import type { WaktuKerjaResponse } from './types'; // Import tipe yang sudah dibuat sebelumnya

export const GetWaktuKerjaByShiftAndOPD = createQuery<
  WaktuKerjaResponse,
  { shiftId: number },
  AxiosError
>({
  queryKey: ['getWaktuKerjaByShiftAndOPD'] as const,
  fetcher: async ({ shiftId }) => {
    const storedMessage = getMessage();
    return client({
      url: `/api/waktu-kerja/shift/${shiftId}`,
      method: 'GET',
      params: {
        opd_id: storedMessage?.opd_id,
      },
    }).then((response) => response.data);
  },
});
