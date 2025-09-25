import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client } from '../../common';
import type { CheckPasswordChangeResponse } from './types';

interface Variables {
  nik: string;
  shift_id: number;
}

export const useCheckPasswordUser = createQuery<
  CheckPasswordChangeResponse,
  Variables,
  AxiosError
>({
  queryKey: ['useCheckPasswordUser'],
  fetcher: async () =>
    client({
      url: `/auth-mobile/check-password-status`,
      method: 'POST',
      params: { _t: Date.now() },
    }).then((res) => res.data),
});
