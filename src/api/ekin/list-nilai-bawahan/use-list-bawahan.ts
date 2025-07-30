import { createQuery } from 'react-query-kit';

import { client } from '../../common';
import type { RekapKegiatanHarianResponse } from './types';

export const useListBawahan = createQuery<
  RekapKegiatanHarianResponse,
  {
    nik_atasan: string | undefined;
    page: number;
    limit?: number;
    search: string;
  }
>({
  queryKey: ['useListBawahan'],
  fetcher: async ({ nik_atasan, page, limit = 10, search }) => {
    if (!nik_atasan) throw new Error('User ID is required');

    const response = await client.get(
      '/ekinerja/kegiatan-harian/check-status-verifikasi-bawahan',
      {
        params: {
          nik_atasan,
          page,
          per_page: limit,
          search,
        },
      }
    );

    return response.data;
  },
});
