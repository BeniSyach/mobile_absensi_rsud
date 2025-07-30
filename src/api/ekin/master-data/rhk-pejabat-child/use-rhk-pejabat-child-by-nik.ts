import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client } from '../../../common';
import type { RhkPejabatResponse } from './types';

type Variables = {
  page?: number;
  limit?: number;
  nik?: string;
};

export const useRhkPejabatChildByNik = createQuery<
  RhkPejabatResponse,
  Variables,
  AxiosError
>({
  queryKey: ['useRhkPejabatChildByNik'] as const,
  fetcher: async (variables) => {
    const response = await client({
      url: `/ekinerja/rhk-pejabat-child/by-nik/${variables.nik}`,
      method: 'GET',
      params: variables,
    });
    return response.data;
  },
});
