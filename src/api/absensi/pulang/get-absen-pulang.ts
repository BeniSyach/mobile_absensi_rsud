import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client } from '../../common';
import type {
  GetAllAbsenPulangResponse,
  GetAllAbsenPulangVariables,
} from './types';

export const useGetAllAbsenPulang = createQuery<
  GetAllAbsenPulangResponse,
  GetAllAbsenPulangVariables,
  AxiosError
>({
  queryKey: ['getAllAbsenMasuk'] as const,
  fetcher: async (variables) => {
    const response = await client({
      url: '/api/absen-pulang',
      method: 'GET',
      params: variables,
    });
    return response.data;
  },
});
