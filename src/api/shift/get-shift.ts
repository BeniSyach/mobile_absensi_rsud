import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client } from '../common';
import type { GetShiftResponseArray } from './types'; // Import tipe yang sudah dibuat

export const GetShifts = createQuery<GetShiftResponseArray, void, AxiosError>({
  queryKey: ['getShifts'] as const,
  fetcher: async () =>
    client({
      url: '/api/shift',
      method: 'GET',
    }).then((response) => response.data),
});
