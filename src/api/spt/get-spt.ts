import { createInfiniteQuery } from 'react-query-kit';

import { client } from '../common';
import { type SptResponse } from './types';

export const useInfiniteSPTByUser = createInfiniteQuery<
  SptResponse,
  { userId: string | undefined; limit?: number },
  Error,
  number
>({
  queryKey: ['getAllSPTByUser'],
  fetcher: async (variables, { pageParam = 1 }) => {
    const { userId, limit = 10 } = variables;

    if (!userId) throw new Error('User ID is required');

    const url = `/aggregation/spt/pegawai/${userId}`;

    const response = await client.get(url, {
      params: {
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
