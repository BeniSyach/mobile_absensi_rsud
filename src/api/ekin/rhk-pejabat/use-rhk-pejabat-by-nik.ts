import { useInfiniteQuery } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client } from '../../common';
import type { RhkResponseRHKPejabat } from './types';

type Variables = {
  page?: number;
  limit?: number;
  nik: string;
  search: string;
};

type UseInfiniteRHKPejabatChildParams = {
  page?: number;
  limit?: number;
  search?: string;
  nik?: string;
};

export const useRhkPejabatChildInfinite = ({
  limit,
  search,
  nik,
}: UseInfiniteRHKPejabatChildParams) => {
  return useInfiniteQuery({
    queryKey: ['useRhkPejabatChildInfinite', limit, search, nik],
    queryFn: async ({ pageParam = 1 }) => {
      if (!nik) throw new Error('NIK Dibutuhkan');
      const response = await client({
        url: `/aggregation/rhk-pejabat-child`,
        method: 'GET',
        params: {
          nik,
          page: pageParam,
          per_page: limit,
          search,
        },
      });
      return response.data;
    },

    initialPageParam: 1,

    getNextPageParam: (lastPage: RhkResponseRHKPejabat) => {
      if (
        lastPage?.pagination?.current_page < lastPage?.pagination?.last_page
      ) {
        return (lastPage.pagination?.current_page ?? 0) + 1;
      }
      return undefined;
    },
    getPreviousPageParam: (firstPage: RhkResponseRHKPejabat) => {
      if (firstPage?.pagination?.current_page > 1) {
        return firstPage.pagination.current_page - 1;
      }
      return undefined;
    },
    enabled: !!nik, // Hanya run query jika userId ada
    staleTime: 1000 * 60 * 5, // Cache selama 5 menit
  });
};

export const useRHKPejabatByNIK = createQuery<
  RhkResponseRHKPejabat,
  Variables,
  AxiosError
>({
  queryKey: ['useRHKPejabatByNIK'] as const,
  fetcher: async (variables) => {
    const response = await client({
      url: `/aggregation/rhk-pejabat-child`,
      method: 'GET',
      params: variables,
    });
    return response.data;
  },
});
