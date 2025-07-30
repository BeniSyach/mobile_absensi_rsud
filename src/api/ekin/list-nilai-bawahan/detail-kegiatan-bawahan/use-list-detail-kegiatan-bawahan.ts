import { createQuery } from 'react-query-kit';

import { client } from '../../../common';
import type { DetailKegiatanResponse } from './types';

export const useListDetailKegiatan = createQuery<
  DetailKegiatanResponse,
  {
    nik: string | undefined;
    page: number;
    limit?: number;
    status: string;
  }
>({
  queryKey: ['useListDetailKegiatan'],
  fetcher: async ({ nik, page, limit = 10, status }) => {
    if (!nik) throw new Error('User ID is required');

    const response = await client.get(
      '/ekinerja/kegiatan-harian/check-status-kegiatan-harian',
      {
        params: {
          nik,
          page,
          per_page: limit,
          status,
        },
      }
    );

    return response.data;
  },
});
