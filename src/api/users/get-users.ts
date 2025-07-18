import { useQuery } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import { client } from '../common';
import type { ApiResponse } from './types';

export const useGetUser = (nik: string) =>
  useQuery<ApiResponse, AxiosError>({
    queryKey: ['getUser', nik],
    queryFn: async () =>
      client({
        url: `/aggregation/pegawai/${nik}`,
        method: 'GET',
      }).then((res) => res.data),
    enabled: !!nik, // hanya jalankan jika nik tersedia
  });
