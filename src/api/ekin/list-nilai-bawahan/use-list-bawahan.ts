import { useInfiniteQuery } from '@tanstack/react-query';

import { client } from '../../common';
import type { RekapKegiatanHarianResponse } from './types';

interface UseInfiniteListBawahanParams {
  nik_atasan: string | undefined;
  limit?: number;
  search: string;
}

export const useListBawahanInfinite = ({
  nik_atasan,
  limit,
  search,
}: UseInfiniteListBawahanParams) => {
  return useInfiniteQuery({
    queryKey: ['useListBawahanInfinite', nik_atasan, search, limit],
    queryFn: async ({ pageParam = 1 }) => {
      if (!nik_atasan) throw new Error('NIK Atasan Dibutuhkan');

      const response = await client.get<RekapKegiatanHarianResponse>(
        'ekinerja-new/kegiatan-harian/check-status-verifikasi-bawahan',
        {
          params: {
            nik_atasan,
            page: pageParam,
            per_page: limit,
            search,
          },
        }
      );
      console.log('data list bawahan', response.data);
      return response.data;
    },

    initialPageParam: 1,

    getNextPageParam: (lastPage: RekapKegiatanHarianResponse) => {
      if (
        lastPage?.pagination?.current_page < lastPage?.pagination?.last_page
      ) {
        return (lastPage.pagination?.current_page ?? 0) + 1;
      }
      return undefined;
    },
    getPreviousPageParam: (firstPage: RekapKegiatanHarianResponse) => {
      if (firstPage?.pagination?.current_page > 1) {
        return firstPage.pagination.current_page - 1;
      }
      return undefined;
    },
    enabled: !!nik_atasan, // Hanya run query jika userId ada
    staleTime: 1000 * 60 * 5, // Cache selama 5 menit
  });
};
