import { useInfiniteQuery } from '@tanstack/react-query';

import { client } from '../common';
import type { PengajuanCutiVerifResponse } from './types';

interface UseInfiniteCutiVerifParams {
  userId?: string | undefined;
  limit?: number;
  search?: string;
  start_date?: string;
  end_date?: string;
  kode_unit_kerja?: string;
}

export const useInfiniteCutiPegawaiVerif = ({
  userId,
  limit = 10,
  search,
  start_date,
  end_date,
  kode_unit_kerja,
}: UseInfiniteCutiVerifParams) => {
  return useInfiniteQuery({
    // Query key yang dynamic - auto refetch saat berubah
    queryKey: [
      'useInfiniteCutiPegawaiVerif',
      search,
      limit,
      start_date,
      end_date,
      kode_unit_kerja,
    ],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await client.get<PengajuanCutiVerifResponse>(
        '/aggregation/cuti/verif',
        {
          params: {
            nik_verifikator: userId,
            page: pageParam,
            limit,
            search,
            start_date,
            end_date,
            kode_unit_kerja,
          },
        }
      );
      return response.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage: PengajuanCutiVerifResponse) => {
      if (lastPage?.pagination?.page < lastPage?.pagination?.last_page) {
        return (lastPage.pagination?.page ?? 0) + 1;
      }
      return undefined;
    },
    getPreviousPageParam: (firstPage: PengajuanCutiVerifResponse) => {
      if (firstPage?.pagination?.page > 1) {
        return firstPage.pagination.page - 1;
      }
      return undefined;
    },
    staleTime: 1000 * 60 * 5, // Cache selama 5 menit
  });
};
