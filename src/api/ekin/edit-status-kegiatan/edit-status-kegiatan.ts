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
        url: `/ekinerja-new/kegiatan-harian/verifikasi/update-status/${variables.id}`,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        data: variables,
      });

      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        // Cek apakah ini error jaringan
        if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
          throw new Error('jaringan error');
        }

        if (error.code === 'ECONNABORTED') {
          throw new Error('timeout jaringan');
        }

        console.error(
          'Axios error occurred:',
          error.response?.data || error.message
        );
        throw error.response?.data ?? error;
      } else {
        console.error('Unknown error occurred:', error);
        throw error;
      }
    }
  },
});
