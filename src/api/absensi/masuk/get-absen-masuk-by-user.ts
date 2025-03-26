import { createQuery } from 'react-query-kit';

import { client } from '../../common';
import type { Pagination } from './types';

export const useGetAllAbsenMasukByUser = createQuery<
  Pagination,
  { userId: number | undefined; page: number; limit?: number }
>({
  queryKey: ['getAllAbsenMasukByUser'],
  fetcher: async ({ userId, page, limit = 10 }) => {
    if (!userId) throw new Error('User ID is required');
    const response = await client.get(`/secured/absen-masuk/list`, {
      params: { page, limit },
    });
    return response.data.data.data.data;
  },
});
