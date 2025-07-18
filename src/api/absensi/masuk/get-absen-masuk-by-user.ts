import { createQuery } from 'react-query-kit';

import { client } from '../../common';
import type { AbsenResponse } from './types';

export const useGetAllAbsenMasukByUser = createQuery<
  AbsenResponse,
  { userId: string | undefined; page: number; limit?: number }
>({
  queryKey: ['getAllAbsenMasukByUser'],
  fetcher: async ({ userId, page, limit = 10 }) => {
    if (!userId) throw new Error('User ID is required');
    const url = `/aggregation/laporan/absensi/pegawai`;

    const response = await client.get(url, {
      params: { nik: userId, page, limit },
    });

    return response.data;
  },
});
