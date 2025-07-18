import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client } from '../common';
import type { Pagination } from './types'; // pastikan Pagination berisi data SPT
// Misalnya Pagination<SPTData> jika kamu pakai generic

export const useViewSPT = createQuery<
  Pagination,
  { userId: number | undefined; file: string | undefined },
  AxiosError
>({
  queryKey: ['useViewSPT'],
  fetcher: async ({ userId, file }) => {
    if (!userId) throw new Error('User ID is required');

    const url = `/secured/spt/file/${file}/${userId}`;

    const response = await client.get(url);

    // Ubah ini sesuai dengan struktur respons API-mu
    return response.data;
  },
});
