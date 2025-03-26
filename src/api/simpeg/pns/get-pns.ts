import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client } from '../../common';
import type { PnsResponse } from './types';

export const GetPns = createQuery<PnsResponse, number, AxiosError>({
  queryKey: ['getPns'] as const,
  fetcher: async () =>
    client({
      url: `/secured/pns`,
      method: 'GET',
    }).then((response) => response.data),
});
