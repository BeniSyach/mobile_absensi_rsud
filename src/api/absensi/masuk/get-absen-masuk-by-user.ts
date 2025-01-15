import { createQuery } from 'react-query-kit';

import { client } from '../../common';
import type { AbsenMasukDanPulangByUserResponse } from './types';

export const useGetAllAbsenMasukByUser = createQuery<
  AbsenMasukDanPulangByUserResponse[],
  { userId: number | undefined; page: number; limit?: number }
>({
  queryKey: ['getAllAbsenMasukByUser'],
  fetcher: async ({ userId, page, limit = 10 }) => {
    if (!userId) throw new Error('User ID is required');
    const response = await client.get(`/api/absen-masuk/user/${userId}`, {
      params: { page, limit },
    });
    return response.data.data;
  },
});
