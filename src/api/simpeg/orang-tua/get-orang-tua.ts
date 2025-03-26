import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client } from '../../common';
import type { OrangTuaResponse } from './types';

export const GetOrangTua = createQuery<OrangTuaResponse, number, AxiosError>({
  queryKey: ['GetOrangTua'] as const,
  fetcher: async () =>
    client({
      url: `/secured/orang-tua`,
      method: 'GET',
    }).then((response) => response.data),
});
