import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client } from '../common';
import type { ApiResponse } from './types';

export const GetUser = createQuery<ApiResponse, number, AxiosError>({
  queryKey: ['getUser'] as const,
  fetcher: async () =>
    client({
      url: `/secured/profile`,
      method: 'GET',
    }).then((response) => response.data),
});
