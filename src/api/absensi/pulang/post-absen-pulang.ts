import type { AxiosError } from 'axios';
import axios from 'axios';
import { Platform } from 'react-native';
import { createMutation } from 'react-query-kit';

import { client } from '../../common';
import type { AbsenPulangResponse, AbsenPulangVariables } from './types';

export const PostAbsenPulang = createMutation<
  AbsenPulangResponse,
  AbsenPulangVariables,
  AxiosError
>({
  mutationFn: async (variables) => {
    console.log('data absen pulang', variables);
    try {
      const formData = new FormData();
      // Menambahkan field ke FormData secara manual
      formData.append('absen_masuk_id', String(variables.absen_masuk_id));
      formData.append('user_id', String(variables.user_id));
      formData.append('shift_id', String(variables.shift_id));
      formData.append('waktu_kerja_id', String(variables.waktu_kerja_id));
      formData.append('longitude', String(variables.longitude));
      formData.append('latitude', String(variables.latitude));

      if (Platform.OS === 'ios') {
        // For iOS, the URI might need to be prefixed with 'file://'
        formData.append('photo', variables.photo);
      } else {
        formData.append('photo', variables.photo);
      }

      // Mengirim request ke server
      const response = await client({
        url: '/api/absen-pulang',
        method: 'POST',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Mengembalikan response dari server
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(
          'Axios error occurred:',
          error.response?.data || error.message
        );
      } else {
        console.error('Unknown error occurred:', error);
      }
      throw error;
    }
  },
});
