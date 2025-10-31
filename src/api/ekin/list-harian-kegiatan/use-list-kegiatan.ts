import { useInfiniteQuery } from '@tanstack/react-query';

import { client } from '../../common';
import type { KegiatanResponse } from './types';

interface UseInfiniteKegiatanParams {
  userId: string | undefined;
  limit?: number;
  tanggalAwal: string;
  tanggalAkhir: string;
  search: string;
}

export const useInfiniteKegiatanHarianByUser = ({
  userId,
  limit = 10,
  tanggalAwal,
  tanggalAkhir,
  search,
}: UseInfiniteKegiatanParams) => {
  return useInfiniteQuery({
    // Query key yang dynamic - auto refetch saat berubah
    queryKey: [
      'getKegiatanHarianByUser',
      userId,
      tanggalAwal,
      tanggalAkhir,
      search,
      limit,
    ],
    queryFn: async ({ pageParam = 1 }) => {
      if (!userId) throw new Error('User ID is required');

      const response = await client.get<KegiatanResponse>(
        '/aggregation/kegiatan-harian',
        {
          params: {
            nik: userId,
            page: pageParam,
            limit,
            tanggal_awal: tanggalAwal,
            tanggal_akhir: tanggalAkhir,
            search,
          },
        }
      );
      return response.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage: KegiatanResponse) => {
      if (lastPage?.pagination?.page < lastPage?.pagination?.last_page) {
        return (lastPage.pagination?.page ?? 0) + 1;
      }
      return undefined;
    },
    getPreviousPageParam: (firstPage: KegiatanResponse) => {
      if (firstPage?.pagination?.page > 1) {
        return firstPage.pagination.page - 1;
      }
      return undefined;
    },
    enabled: !!userId, // Hanya run query jika userId ada
    staleTime: 1000 * 60 * 5, // Cache selama 5 menit
  });
};
