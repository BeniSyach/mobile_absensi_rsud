import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client } from '../common';
import type { UpdateResponse } from './types';

export const CheckUpdateApp = createQuery<
  UpdateResponse,
  { version_code: string },
  AxiosError
>({
  queryKey: ['CheckUpdateApp'],
  fetcher: async (params) => {
    if (!params?.version_code) {
      throw new Error('version_code is required');
    }

    const response = await client({
      url: '/absensi/check-version',
      method: 'GET',
      params: {
        version_code: params.version_code,
      },
    });

    return response.data as UpdateResponse;
  },
});
