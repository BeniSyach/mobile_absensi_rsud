import { createQuery } from 'react-query-kit';

import { client } from '../../common';
import type { ApiResponseKegiatanHarianPejabat } from './types';

export const useGetKegiatanHarianPejabatByUser = createQuery<
  ApiResponseKegiatanHarianPejabat,
  {
    userId: string | undefined;
    page: number;
    limit?: number;
    tanggal_awal: string;
    tanggal_akhir: string;
    search: string;
  }
>({
  queryKey: ['useGetKegiatanHarianPejabatByUser'],
  fetcher: async ({
    userId,
    page,
    limit = 10,
    tanggal_awal,
    tanggal_akhir,
    search,
  }) => {
    if (!userId) throw new Error('User ID is required');

    const response = await client.get(
      '/ekinerja/kegiatan-harian-pejabat/filter-by-nik',
      {
        params: {
          nik: userId,
          page,
          per_page: limit,
          tanggal_awal,
          tanggal_akhir,
          search,
        },
      }
    );

    return response.data;
  },
});
