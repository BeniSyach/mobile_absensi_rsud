import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client } from '../../../common';
import type { SatuanResponse } from './types';

type Variables = {
  page?: number;
  limit?: number;
  search?: string;
};

export const GetSatuanEkin = createQuery<SatuanResponse, Variables, AxiosError>(
  {
    queryKey: ['getSatuanEkin'] as const,
    fetcher: async (variables) => {
      const response = await client({
        url: '/aggregation/satuan',
        method: 'GET',
        params: variables,
      });
      return response.data;
    },
  }
);
