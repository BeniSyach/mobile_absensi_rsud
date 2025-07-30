import { createQuery } from 'react-query-kit';

import { client } from '../../../common';
import type { JabatanResponseSimpeg } from './types';

export const useJabatanSimpeg = createQuery<
  JabatanResponseSimpeg,
  {
    page: number;
    limit?: number;
    search: string;
  }
>({
  queryKey: ['useJabatanSimpeg'],
  fetcher: async ({ page, limit = 10, search }) => {
    const response = await client.get('/aggregation/jabatan', {
      params: {
        page,
        per_page: limit,
        search,
      },
    });

    return response.data;
  },
});
