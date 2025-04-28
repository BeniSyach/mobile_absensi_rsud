import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client } from '../common';
import type { Pagination } from './types'; // pastikan Pagination berisi data SPT
// Misalnya Pagination<SPTData> jika kamu pakai generic

export const useGetAllSPTByUser = createQuery<
  Pagination,
  { userId: number | undefined; page: number; limit?: number },
  AxiosError
>({
  queryKey: ['getAllSPTByUser'],
  fetcher: async ({ userId, page, limit = 10 }) => {
    if (!userId) throw new Error('User ID is required');

    const url = '/secured/spt';
    console.log('Request URL:', url);
    console.log('Request Params:', { nik: userId, page, limit });

    const response = await client.get(url, {
      params: { nik: userId, page, limit },
    });

    console.log('Full Response Object:', response);
    console.log('Response Data:', response.data);

    // Ubah ini sesuai dengan struktur respons API-mu
    return response.data.data.data.data;
  },
});
