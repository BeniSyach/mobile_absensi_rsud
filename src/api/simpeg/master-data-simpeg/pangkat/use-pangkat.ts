import { createQuery } from 'react-query-kit';

import { client } from '../../../common';
import type { PangkatResponseSimpeg } from './types';

export const usePangkatSimpeg = createQuery<
  PangkatResponseSimpeg,
  {
    page: number;
    limit?: number;
    search: string;
  }
>({
  queryKey: ['usePangkatSimpeg'],
  fetcher: async ({ page, limit = 10, search }) => {
    const response = await client.get('/aggregation/pangkat', {
      params: {
        page,
        per_page: limit,
        search,
      },
    });

    return response.data;
  },
});
