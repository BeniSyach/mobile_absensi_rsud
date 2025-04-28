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
    const url = `/secured/absen-masuk/list`;
    console.log('Request URL:', url);
    console.log('Request Params:', { nik: userId, page, limit });

    const response = await client.get(url, {
      params: { nik: userId, page, limit },
    });

    console.log('Full Response Object:', response);
    console.log('Response Data:', response.data);
    console.log('Nested Response Data:', response.data.data.data.data);
    return response.data.data.data.data;
  },
});
