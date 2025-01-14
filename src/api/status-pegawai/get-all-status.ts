import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client } from '../common';
import type { StatusResponse } from './types'; // Import tipe yang sudah dibuat

export const GetStatus = createQuery<StatusResponse[], void, AxiosError>({
  queryKey: ['getStatus'] as const,
  fetcher: async () =>
    client({
      url: '/api/status-pegawai',
      method: 'GET',
    }).then((response) => response.data),
});
