import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client } from '../../common';
import type { KeluargaResponse } from './types';

export const GetKeluarga = createQuery<KeluargaResponse, number, AxiosError>({
  queryKey: ['GetKeluarga'] as const,
  fetcher: async () =>
    client({
      url: `/secured/keluarga`,
      method: 'GET',
    }).then((response) => response.data),
});
