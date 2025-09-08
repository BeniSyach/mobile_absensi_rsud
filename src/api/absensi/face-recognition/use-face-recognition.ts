import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client } from '../../common';
import type { UseFaceUserResponse } from './types';

interface Variables {
  nik: string;
}

export const useFaceRecognition = createQuery<
  UseFaceUserResponse,
  Variables,
  AxiosError
>({
  queryKey: ['useFaceRecognition'],
  fetcher: async ({ nik }) =>
    client({
      url: `/absensi/cek-photo-wajah/${nik}`,
      method: 'GET',
      params: { _t: Date.now() },
    }).then((res) => res.data),

  staleTime: 0,
  refetchOnMount: 'always',
  refetchOnWindowFocus: true,
  placeholderData: undefined,
});
