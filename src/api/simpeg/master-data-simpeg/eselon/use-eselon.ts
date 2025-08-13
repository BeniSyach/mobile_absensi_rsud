import { createQuery } from 'react-query-kit';

import { client } from '../../../common';
import type { GetEselonResponse } from './types';

export const useEselonSimpeg = createQuery<
  GetEselonResponse,
  {
    page: number;
    limit?: number;
    search: string;
  }
>({
  queryKey: ['useEselonSimpeg'],
  fetcher: async ({ page, limit = 10, search }) => {
    const response = await client.get('/aggregation/eselon', {
      params: {
        page,
        per_page: limit,
        search,
      },
    });

    return response.data;
  },
});
