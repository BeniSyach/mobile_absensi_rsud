import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client } from '../common';
import type { SptResponse } from './types'; // pastikan Pagination berisi data SPT
// Misalnya Pagination<SPTData> jika kamu pakai generic

export const useGetAllSPTByUser = createQuery<
  SptResponse,
  { userId: string | undefined; page: number; limit?: number },
  AxiosError
>({
  queryKey: ['getAllSPTByUser'],
  fetcher: async ({ userId, page, limit = 10 }) => {
    if (!userId) throw new Error('User ID is required');

    const url = `/aggregation/spt/pegawai/${userId}`;

    const response = await client.get(url, {
      params: { page, limit },
    });

    // Ubah ini sesuai dengan struktur respons API-mu
    return response.data;
  },
});
