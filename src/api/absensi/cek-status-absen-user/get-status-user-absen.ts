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
  fetcher: async ({ nik, shift_id }) =>
    client({
      url: `/absensi/status-absen-user/${nik}/${shift_id}`,
      method: 'GET',
      params: { _t: Date.now() },
    }).then((res) => res.data),
});
