import axios, { type AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import type { MasterDataKomoditas } from './types'; // Pastikan kamu sudah buat type-nya

type MasterDataKomoditastype = MasterDataKomoditas[];

export const useMasterDataKomoditi = createQuery<
  MasterDataKomoditastype,
  void,
  AxiosError
>({
  queryKey: ['GetMasterDataKomoditi'],
  fetcher: async () => {
    const response = await axios.get(
      'https://pihps.deliserdangkab.go.id/api/komoditi'
    );
    return response.data;
  },
});
