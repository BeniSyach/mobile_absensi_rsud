import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client } from '../common';
import type { WaktuKerjaResponse } from './types'; // Import tipe yang sudah dibuat sebelumnya

export const GetWaktuKerjaByShift = createQuery<
  WaktuKerjaResponse,
  { shiftId: number },
  AxiosError
>({
  queryKey: ['getWaktuKerjaByShift'] as const,
  fetcher: async ({ shiftId }) =>
    client({
      url: `/api/waktu-kerja/shift/${shiftId}`,
      method: 'GET',
    }).then((response) => response.data),
});
