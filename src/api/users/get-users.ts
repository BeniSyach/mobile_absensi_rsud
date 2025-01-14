import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client } from '../common';
import type { GetUserDetailResponse } from './types';

export const GetUser = createQuery<GetUserDetailResponse, number, AxiosError>({
  queryKey: ['getUser'] as const,
  fetcher: async (userId) =>
    client({
      url: `/api/users/${userId}`,
      method: 'GET',
    }).then((response) => response.data),
});
