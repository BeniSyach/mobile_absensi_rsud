import { createQuery } from 'react-query-kit';

import { client } from '../../common';
import type { PegawaiResponse } from './types';

export const usePegawaiSimpeg = createQuery<
  PegawaiResponse,
  {
    page: number;
    limit?: number;
    search: string;
  }
>({
  queryKey: ['usePegawaiSimpeg'],
  fetcher: async ({ page, limit = 10, search }) => {
    const response = await client.get('/aggregation/pegawai', {
      params: {
        page,
        per_page: limit,
        search,
      },
    });

    return response.data;
  },
});
