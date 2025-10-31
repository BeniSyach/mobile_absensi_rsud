import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client } from '../../common';
import type { LastAbsenStatusResponse } from './types';

interface Variables {
  nik: string;
  shift_id: number;
}

export const useStatusAbsenUser = createQuery<
  LastAbsenStatusResponse,
  Variables,
  AxiosError
>({
  queryKey: ['GetStatusAbsenUser'],
  fetcher: async ({ nik, shift_id }) => {
    try {
      const res = await client({
        url: `/absensi/status-absen-user/${nik}/${shift_id}`,
        method: 'GET',
        params: { _t: Date.now() },
      });
      return res.data;
    } catch (error) {
      const err = error as AxiosError;

      // kalau error jaringan (tidak ada response sama sekali)
      if (err.code === 'ERR_NETWORK' || err.message === 'Network Error') {
        throw new Error('jaringan error');
      }

      // kalau timeout (bisa beda tergantung config axios)
      if (err.code === 'ECONNABORTED') {
        throw new Error('Jaringan Time Out');
      }

      // lempar error asli kalau bukan error jaringan
      throw err;
    }
  },
});
