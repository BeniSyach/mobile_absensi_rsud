import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client } from '../../common';
import type { UserDataEkin } from './types'; // Import tipe yang sudah dibuat

export const UseProfileEkin = createQuery<UserDataEkin, void, AxiosError>({
  queryKey: ['UseProfileEkin'] as const,
  fetcher: async () =>
    client({
      url: '/ekinerja-new/profile',
      method: 'GET',
      params: { _t: Date.now() },
    }).then((response) => response.data),
});
