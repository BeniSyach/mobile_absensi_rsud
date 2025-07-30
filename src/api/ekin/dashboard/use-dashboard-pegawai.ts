import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client } from '../../common';
import type { RekapStatusResponse } from './types';

export const GetDashboardPegawai = createQuery<
  RekapStatusResponse,
  void,
  AxiosError
>({
  queryKey: ['getDashboardPegawai'] as const,
  fetcher: async () => {
    const response = await client({
      url: '/ekinerja/dashboard/pegawai',
      method: 'GET',
    });
    return response.data;
  },
});
