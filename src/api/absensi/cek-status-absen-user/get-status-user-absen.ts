import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client } from '../../common';
import type { LastAbsenStatusResponse } from './types';

export const GetStatusAbsenUser = createQuery<
  LastAbsenStatusResponse,
  number,
  AxiosError
>({
  queryKey: ['GetStatusAbsenUser'] as const,
  fetcher: async () =>
    client({
      url: `/secured/absen-status`,
      method: 'GET',
      params: {
        _t: Date.now(),
      },
    }).then((response) => response.data),
});
