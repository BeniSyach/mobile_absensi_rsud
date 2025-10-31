import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client } from '../../../common';
import type { RhkStaffResponse } from './types';

type Variables = {
  page?: number;
  limit?: number;
};

export const GetRhkStaff = createQuery<RhkStaffResponse, Variables, AxiosError>(
  {
    queryKey: ['getRhkStaff'] as const,
    fetcher: async (variables) => {
      const response = await client({
        url: '/aggregation/rhk-staff',
        method: 'GET',
        params: variables,
      });
      return response.data;
    },
  }
);
