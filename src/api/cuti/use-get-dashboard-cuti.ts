import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client } from '../common';
import type { StatistikCutiResponse } from './types';

interface Variables {
  nik: string;
}

export const useGetDashboardCuti = createQuery<
  StatistikCutiResponse,
  Variables,
  AxiosError
>({
  queryKey: ['useGetDashboardCuti'],
  fetcher: async ({ nik }) => {
    const year = new Date().getFullYear(); // 👈 tahun sekarang

    try {
      const res = await client({
        url: `/aggregation/statistik-cuti/pegawai/${nik}`,
        method: 'GET',
        params: { _t: Date.now(), tahun: year },
      });

      return res.data;
    } catch (error) {
      const err = error as AxiosError;

      if (err.code === 'ERR_NETWORK' || err.message === 'Network Error') {
        throw new Error('jaringan error');
      }

      if (err.code === 'ECONNABORTED') {
        throw new Error('Jaringan Time Out');
      }

      throw err;
    }
  },
});
