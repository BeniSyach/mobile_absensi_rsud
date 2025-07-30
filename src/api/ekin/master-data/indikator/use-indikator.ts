import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client } from '../../../common';
import type { IndikatorResponse } from './types';

type Variables = {
  kode_unit_kerja: string;
  page?: number;
  limit?: number;
  search?: string;
};

export const GetIndikatorByUnitKerja = createQuery<
  IndikatorResponse,
  Variables,
  AxiosError
>({
  queryKey: ['getIndikatorByUnitKerja'] as const,
  fetcher: async (variables) => {
    const response = await client({
      url: '/ekinerja/indikator/by-unit-kerja',
      method: 'GET',
      params: variables,
    });
    return response.data;
  },
});
