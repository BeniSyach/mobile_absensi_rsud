import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client } from '../../common';
import type {
  GetAllAbsenMasukResponse,
  GetAllAbsenMasukVariables,
} from './types';

export const useGetAllAbsenMasuk = createQuery<
  GetAllAbsenMasukResponse,
  GetAllAbsenMasukVariables,
  AxiosError
>({
  queryKey: ['getAllAbsenMasuk'] as const,
  fetcher: async (variables) => {
    const response = await client({
      url: '/api/absen-masuk',
      method: 'GET',
      params: variables,
    });
    return response.data;
  },
});
