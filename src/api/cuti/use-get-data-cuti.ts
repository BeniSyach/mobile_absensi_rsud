import { useInfiniteQuery } from '@tanstack/react-query';

import { client } from '../common';
import type { PengajuanCutiResponse } from './types';

interface UseInfiniteCutiParams {
  userId: string | undefined;
  limit?: number;
  search?: string;
}

export const useInfiniteCutiPegawai = ({
  userId,
  limit = 10,
  search,
}: UseInfiniteCutiParams) => {
  return useInfiniteQuery({
    // Query key yang dynamic - auto refetch saat berubah
    queryKey: ['useInfiniteCutiPegawai', userId, search, limit],
    queryFn: async ({ pageParam = 1 }) => {
      if (!userId) throw new Error('User ID is required');

      const response = await client.get<PengajuanCutiResponse>(
        '/aggregation/cuti',
        {
          params: {
            nik: userId,
            page: pageParam,
            limit,
            search,
          },
        }
      );
      return response.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage: PengajuanCutiResponse) => {
      if (lastPage?.pagination?.page < lastPage?.pagination?.last_page) {
        return (lastPage.pagination?.page ?? 0) + 1;
      }
      return undefined;
    },
    getPreviousPageParam: (firstPage: PengajuanCutiResponse) => {
      if (firstPage?.pagination?.page > 1) {
        return firstPage.pagination.page - 1;
      }
      return undefined;
    },
    enabled: !!userId, // Hanya run query jika userId ada
    staleTime: 1000 * 60 * 5, // Cache selama 5 menit
  });
};
