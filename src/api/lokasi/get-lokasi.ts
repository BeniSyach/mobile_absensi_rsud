import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client } from '../common'; // Sesuaikan path `client` dengan proyek Anda
import type { Location } from './types';

export const useGetLocationDetail = createQuery<
  Location,
  { id: number },
  AxiosError
>({
  queryKey: ['getLocationDetail'] as const,
  fetcher: async ({ id }) => {
    const response = await client({
      url: `/api/locations/${id}`,
      method: 'GET',
    });
    return response.data;
  },
});
