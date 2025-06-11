import axios, { type AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import type { HargaKomoditiPasarRataRata } from './types'; // Pastikan kamu sudah buat type-nya

type DataHariIni = HargaKomoditiPasarRataRata[];

export const useDataHariIni = createQuery<DataHariIni, void, AxiosError>({
  queryKey: ['GetDataHariIni'],
  fetcher: async () => {
    const response = await axios.get(
      'https://pihps.deliserdangkab.go.id/api/harga-rata-komoditi-hari-ini'
    );
    return response.data;
  },
});
