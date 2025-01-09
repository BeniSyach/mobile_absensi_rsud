import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client } from '../../common';
import type { AbsenMasukDanPulangByUserResponse } from './types';
export const useGetAllAbsenMasukByUser = createQuery<
  AbsenMasukDanPulangByUserResponse[],
  { userId: number | undefined },
  AxiosError
>({
  queryKey: ['getAllAbsenMasukByUser'],
  fetcher: async ({ userId }) => {
    const response = await client.get(`/api/absen-masuk/user/${userId}`);
    return response.data;
  },
});
