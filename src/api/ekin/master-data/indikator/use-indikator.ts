import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client } from '../../../common';
import type { IndikatorResponse } from './types';

type Variables = {
  id_unit_kerja: number;
};

export const GetIndikatorByUnitKerja = createQuery<
  IndikatorResponse,
  Variables,
  AxiosError
>({
  queryKey: ['getIndikatorByUnitKerja'] as const,
  fetcher: async ({ id_unit_kerja }) => {
    const response = await client({
      url: '/ekinerja/indikator/by-unit-kerja',
      method: 'GET',
      params: { id_unit_kerja },
    });
    return response.data;
  },
});
