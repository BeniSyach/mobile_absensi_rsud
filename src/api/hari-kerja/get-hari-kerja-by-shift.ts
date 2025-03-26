import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client } from '../common';
import type { HariKerjaResponse } from './types'; // Import tipe yang sudah dibuat sebelumnya

export const GetWaktuKerjaByShiftAndOPD = createQuery<
  HariKerjaResponse,
  { shiftId: number },
  AxiosError
>({
  queryKey: ['getWaktuKerjaByShiftAndOPD'] as const,
  fetcher: async ({ shiftId }) => {
    return client({
      url: `/secured/absen-waktu-kerja`,
      method: 'GET',
      params: {
        shift_id: shiftId,
      },
    }).then((response) => response.data);
  },
});
