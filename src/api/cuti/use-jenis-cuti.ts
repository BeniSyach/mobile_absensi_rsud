import { useInfiniteQuery } from '@tanstack/react-query';

import { client } from '../common';
import type { JenisCutiResponse } from './types';

interface UseInfiniteJenisCutiParams {
  limit?: number;
  search?: string;
}

export const useInfiniteJenisCutiPegawai = ({
  limit = 10,
  search,
}: UseInfiniteJenisCutiParams) => {
  return useInfiniteQuery({
    // Query key yang dynamic - auto refetch saat berubah
    queryKey: ['useInfiniteCutiPegawai', search, limit],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await client.get<JenisCutiResponse>(
        '/aggregation/jenis-cuti',
        {
          params: {
            page: pageParam,
            limit,
            search,
          },
        }
      );
      return response.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage: JenisCutiResponse) => {
      if (lastPage?.pagination?.page < lastPage?.pagination?.last_page) {
        return (lastPage.pagination?.page ?? 0) + 1;
      }
      return undefined;
    },
    getPreviousPageParam: (firstPage: JenisCutiResponse) => {
      if (firstPage?.pagination?.page > 1) {
        return firstPage.pagination.page - 1;
      }
      return undefined;
    },
    staleTime: 1000 * 60 * 5, // Cache selama 5 menit
  });
};
