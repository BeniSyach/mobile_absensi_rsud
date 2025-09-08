import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client } from '../../common';
import type { AbsenBulanIniResponse } from './types';

interface Variables {
  nik: string;
}

export const useRekapitulasiAbsenUser = createQuery<
  AbsenBulanIniResponse,
  Variables,
  AxiosError
>({
  queryKey: ['useRekapitulasiAbsenUser'],
  fetcher: async ({ nik }) =>
    client({
      url: `/absensi/data-rekapitulasi-absensi-user`,
      method: 'GET',
      params: { nik, _t: Date.now() },
    }).then((res) => res.data),
});
