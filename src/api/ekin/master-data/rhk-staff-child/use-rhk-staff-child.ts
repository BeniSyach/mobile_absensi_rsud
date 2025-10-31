import { useInfiniteQuery } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client } from '../../../common';
import type { RhkStaffChildResponse } from './types';

type Variables = {
  page?: number;
  limit?: number;
  search?: string;
  nik?: string;
};

type UseInfiniteRHKChildParams = {
  page?: number;
  limit?: number;
  search?: string;
  nik?: string;
};

export const useRhkStaffChildInfinite = ({
  limit,
  search,
  nik,
}: UseInfiniteRHKChildParams) => {
  return useInfiniteQuery({
    queryKey: ['useRhkStaffChildInfinite', limit, search, nik],
    queryFn: async ({ pageParam = 1 }) => {
      if (!nik) throw new Error('NIK Dibutuhkan');
      const response = await client({
        url: `/aggregation/rhk-staff-child`,
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

    getNextPageParam: (lastPage: RhkStaffChildResponse) => {
      if (lastPage?.pagination?.page < lastPage?.pagination?.last_page) {
        return (lastPage.pagination?.page ?? 0) + 1;
      }
      return undefined;
    },
    getPreviousPageParam: (firstPage: RhkStaffChildResponse) => {
      if (firstPage?.pagination?.page > 1) {
        return firstPage.pagination?.page - 1;
      }
      return undefined;
    },
    enabled: !!nik, // Hanya run query jika userId ada
    staleTime: 1000 * 60 * 5, // Cache selama 5 menit
  });
};

export const GetRhkStaffChild = createQuery<
  RhkStaffChildResponse,
  Variables,
  AxiosError
>({
  queryKey: ['getRhkStaffChild'] as const,
  fetcher: async (variables) => {
    const response = await client({
      url: `/aggregation/rhk-staff-child`,
      method: 'GET',
      params: variables,
    });
    return response.data;
  },
});
