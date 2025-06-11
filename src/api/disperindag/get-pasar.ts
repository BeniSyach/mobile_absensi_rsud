import axios, { type AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import type { MasterDataPasar } from './types'; // Pastikan kamu sudah buat type-nya

type MasterDataPasartype = MasterDataPasar[];

export const useMasterDataPasardisperindag = createQuery<
  MasterDataPasartype,
  void,
  AxiosError
>({
  queryKey: ['GetMasterDataPasar'],
  fetcher: async () => {
    const response = await axios.get(
      'https://pihps.deliserdangkab.go.id/api/pasar'
    );
    return response.data;
  },
});
