import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client } from '../../common';
import type { CpnsResponse } from './types';

export const GetCpns = createQuery<CpnsResponse, number, AxiosError>({
  queryKey: ['getCpns'] as const,
  fetcher: async () =>
    client({
      url: `/secured/cpns`,
      method: 'GET',
    }).then((response) => response.data),
});
