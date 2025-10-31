import { useInfiniteQuery } from '@tanstack/react-query';
import { createQuery } from 'react-query-kit';

import { client } from '../../../common';
import type { DetailKegiatanResponse } from './types';

interface UseInfiniteListDetailKegiatanParams {
  nik: string | undefined;
  page: number;
  limit?: number;
  status: string;
}

export const useGetListDetailKegiatanInfinite = ({
  nik,
  page,
  limit,
  status,
}: UseInfiniteListDetailKegiatanParams) => {
  return useInfiniteQuery({
    // Query key yang dynamic - auto refetch saat berubah
    queryKey: ['useGetListDetailKegiatanInfinite', nik, page, limit, status],
    queryFn: async ({ pageParam = 1 }) => {
      if (!nik) throw new Error('Nik Anda Dibutuhkan');

      const response = await client.get<DetailKegiatanResponse>(
        '/aggregation/kegiatan-harian-pejabat',
        {
          params: {
            nik,
            page: pageParam,
            per_page: limit,
            status,
          },
        }
      );

      return response.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage: DetailKegiatanResponse) => {
      if (
        lastPage?.pagination?.current_page < lastPage?.pagination?.last_page
      ) {
        return (lastPage.pagination?.current_page ?? 0) + 1;
      }
      return undefined;
    },
    getPreviousPageParam: (firstPage: DetailKegiatanResponse) => {
      if (firstPage?.pagination?.current_page > 1) {
        return firstPage.pagination.current_page - 1;
      }
      return undefined;
    },
    enabled: !!nik, // Hanya run query jika userId ada
    staleTime: 1000 * 60 * 5, // Cache selama 5 menit
  });
};

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
      '/ekinerja-new/kegiatan-harian/check-status-kegiatan-harian',
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
