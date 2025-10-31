import { createInfiniteQuery } from 'react-query-kit';

import { type AbsenResponse } from '@/api';

import { client } from '../../common';

export const useInfiniteAbsenMasukByUser = createInfiniteQuery<
  AbsenResponse,
  { userId: string | undefined; limit?: number },
  Error,
  number
>({
  queryKey: ['getAllAbsenMasukByUser'],
  fetcher: async (variables, { pageParam = 1 }) => {
    const { userId, limit = 10 } = variables;

    if (!userId) throw new Error('User ID is required');

    const url = `/aggregation/laporan/absensi/pegawai`;

    const response = await client.get(url, {
      params: {
        nik: userId,
        page: pageParam,
        limit,
      },
    });

    return response.data;
  },
  initialPageParam: 1,
  getNextPageParam: (lastPage) => {
    if (lastPage?.pagination?.page < lastPage?.pagination?.last_page) {
      return lastPage.pagination.page + 1;
    }
    return undefined;
  },
  getPreviousPageParam: (firstPage) => {
    if (firstPage?.pagination?.page > 1) {
      return firstPage.pagination.page - 1;
    }
    return undefined;
  },
});
