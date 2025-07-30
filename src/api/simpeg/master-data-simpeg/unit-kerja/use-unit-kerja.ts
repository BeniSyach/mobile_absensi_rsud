import { createQuery } from 'react-query-kit';

import { client } from '../../../common';
import type { UnitKerjaResponse } from './types';

export const useUnitKerjaSimpeg = createQuery<
  UnitKerjaResponse,
  {
    page: number;
    limit?: number;
    search: string;
  }
>({
  queryKey: ['useUnitKerjaSimpeg'],
  fetcher: async ({ page, limit = 10, search }) => {
    const response = await client.get('/aggregation/unit-kerja', {
      params: {
        page,
        per_page: limit,
        search,
      },
    });

    return response.data;
  },
});
