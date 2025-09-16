import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client } from '../../common';

export const useCheckPasswordUser = createQuery<AxiosError>({
  queryKey: ['useCheckPasswordUser'],
  fetcher: async () =>
    client({
      url: `/auth-mobile/check-password-status`,
      method: 'POST',
      params: { _t: Date.now() },
    }).then((res) => res.data),
});
