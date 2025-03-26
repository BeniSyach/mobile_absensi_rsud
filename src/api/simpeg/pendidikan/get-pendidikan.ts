import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client } from '../../common';
import type { PendidikanResponse } from './types';

export const GetPendidikan = createQuery<
  PendidikanResponse,
  number,
  AxiosError
>({
  queryKey: ['GetPendidikan'] as const,
  fetcher: async () =>
    client({
      url: `/secured/pendidikan`,
      method: 'GET',
    }).then((response) => response.data),
});
