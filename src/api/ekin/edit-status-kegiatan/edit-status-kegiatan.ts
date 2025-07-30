import type { AxiosError } from 'axios';
import axios from 'axios';
import { createMutation } from 'react-query-kit';

import { client } from '../../common';
import type {
  putStatusKegiatanVariable,
  UpdateStatusKegiatanHarianResponse,
} from './types';

export const PutStatusKegaiatan = createMutation<
  UpdateStatusKegiatanHarianResponse,
  putStatusKegiatanVariable,
  AxiosError
>({
  mutationFn: async (variables) => {
    try {
      const response = await client({
        url: `/ekinerja/kegiatan-harian/verifikasi/update-status/${variables.id}`,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        data: variables,
      });

      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(
          'Axios error occurred:',
          error.response?.data || error.message
        );
        throw error.response?.data;
      } else {
        console.error('Unknown error occurred:', error);
        throw error;
      }
    }
  },
});
