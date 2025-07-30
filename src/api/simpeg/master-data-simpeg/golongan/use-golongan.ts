import { createQuery } from 'react-query-kit';

import { client } from '../../../common';
import type { GolonganRuangResponse } from './types';

export const useGolonganRuangSimpeg = createQuery<
  GolonganRuangResponse,
  {
    page: number;
    limit?: number;
    search: string;
  }
>({
  queryKey: ['useGolonganRuangSimpeg'],
  fetcher: async ({ page, limit = 10, search }) => {
    const response = await client.get('/aggregation/golongan-ruang', {
      params: {
        page,
        per_page: limit,
        search,
      },
    });

    return response.data;
  },
});
