import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client } from '../../../common';
import type { RhkStaffChildResponse } from './types';

type Variables = {
  page?: number;
  limit?: number;
  search?: string;
};

export const GetRhkStaffChild = createQuery<
  RhkStaffChildResponse,
  Variables,
  AxiosError
>({
  queryKey: ['getRhkStaffChild'] as const,
  fetcher: async (variables) => {
    const response = await client({
      url: '/ekinerja/rhk-staff-child',
      method: 'GET',
      params: variables,
    });
    return response.data;
  },
});
