import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client } from '../common';
import type { GetAllSPTResponse } from './types';

export const GetAllSPTbyUser = createQuery<
  GetAllSPTResponse[],
  { userId: number | undefined },
  AxiosError
>({
  queryKey: ['getAllSPTbyUser'],
  fetcher: async ({ userId }) => {
    const response = await client.get(`/api/spt/user/${userId}`);
    return response.data;
  },
});
