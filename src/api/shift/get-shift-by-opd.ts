import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { getMessage } from '@/lib/message-storage';

import { client } from '../common';
import type { ShiftResponse } from './types'; // Import tipe yang sudah dibuat

export const GetShiftsByOpd = createQuery<ShiftResponse, void, AxiosError>({
  queryKey: ['getShiftsByOpd'] as const,
  fetcher: async () => {
    const storedMessage = getMessage();
    return client({
      url: '/aggregation/shift-absen',
      method: 'GET',
      params: {
        opd_id: storedMessage?.kode_unit_kerja,
        _t: Date.now(),
      },
    }).then((response) => response.data);
  },
});
