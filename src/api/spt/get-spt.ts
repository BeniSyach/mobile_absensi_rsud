import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client } from '../common';
import type { GetAllSPTResponse } from './types';

export const GetAllSPT = createQuery<GetAllSPTResponse, void, AxiosError>({
  queryKey: ['getAllSPT'] as const,
  fetcher: async () =>
    client({
      url: '/api/spt',
      method: 'GET',
    }).then((response) => response.data),
});
