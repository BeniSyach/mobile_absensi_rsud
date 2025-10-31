import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client } from '../../common';
import { type ExportTPPPegawaiParams } from './types';

export const ExportTPPPejabat = createQuery<
  ArrayBuffer,
  ExportTPPPegawaiParams,
  AxiosError
>({
  queryKey: ['ExportTPPPejabat'] as const,
  fetcher: async (variables) => {
    const response = await client({
      url: '/ekinerja-new/export-tpp-pejabat-bulanan',
      method: 'GET',
      params: variables,
      responseType: 'arraybuffer', // ⬅️ penting!
    });

    return response.data;
  },
});
