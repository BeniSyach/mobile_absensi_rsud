import { createQuery } from 'react-query-kit';

import { client } from '../../common';
import type { KegiatanHarianResponseByNIK } from './types';

export const useGetKegiatanHarianByUser = createQuery<
  KegiatanHarianResponseByNIK,
  {
    userId: string | undefined;
    page: number;
    limit?: number;
    tanggalAwal: string;
    tanggalAkhir: string;
    search: string;
  }
>({
  queryKey: ['getKegiatanHarianByUser'],
  fetcher: async ({
    userId,
    page,
    limit = 10,
    tanggalAwal,
    tanggalAkhir,
    search,
  }) => {
    if (!userId) throw new Error('User ID is required');

    const response = await client.get(
      '/ekinerja/kegiatan-harian/filter-by-nik',
      {
        params: {
          nik: userId,
          page,
          per_page: limit,
          tanggalAwal,
          tanggalAkhir,
          search,
        },
      }
    );

    return response.data;
  },
});
