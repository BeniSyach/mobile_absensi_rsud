import axios, { type AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import type { MasterDataUmkmResponse } from './types'; // Pastikan kamu sudah buat type-nya

export const useGetMasterDataUmkm = createQuery<
  MasterDataUmkmResponse,
  void,
  AxiosError
>({
  queryKey: ['getMasterDataUmkm'],
  fetcher: async () => {
    const response = await axios.get(
      'https://diskopukm.deliserdangkab.go.id/API/deliserdangsehat/DataMaster'
    );
    return response.data;
  },
});
