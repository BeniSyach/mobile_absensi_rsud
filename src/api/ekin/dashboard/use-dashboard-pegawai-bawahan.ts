import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client } from '../../common';
import type { RekapStatusResponse } from './types';

export const GetDashboardPegawaiBawahan = createQuery<
  RekapStatusResponse,
  void,
  AxiosError
>({
  queryKey: ['getDashboardPegawaiBawahan'] as const,
  fetcher: async () => {
    const response = await client({
      url: '/ekinerja-new/dashboard/pegawai_bawahan',
      method: 'GET',
    });
    return response.data;
  },
});
