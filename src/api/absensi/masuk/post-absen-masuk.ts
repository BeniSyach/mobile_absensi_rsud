import type { AxiosError } from 'axios';
import axios from 'axios';
import { Platform } from 'react-native';
import { createMutation } from 'react-query-kit';

import { client } from '../../common';
import type { AbsenMasukResponse, AbsenMasukVariables } from './types';

export const PostAbsenMasuk = createMutation<
  AbsenMasukResponse,
  AbsenMasukVariables,
  AxiosError
>({
  mutationFn: async (variables) => {
    try {
      const file = {
        uri: variables.photo.uri,
        type: variables.photo.type ?? 'image/jpeg',
        name: variables.photo.name ?? `photo_${Date.now()}.jpg`,
      };
      const formData = new FormData();
      // Menambahkan field ke FormData secara manual
      formData.append('nik', String(variables.user_id));
      formData.append('shift_id', String(variables.shift_id));
      formData.append('waktu_kerja_id', String(variables.waktu_kerja_id));
      formData.append('longitude', String(variables.longitude));
      formData.append('latitude', String(variables.latitude));
      formData.append('kode_unit_kerja', String(variables.kode_unit_kerja));

      if (Platform.OS === 'ios') {
        // For iOS, the URI might need to be prefixed with 'file://'
        formData.append('photo', file as any);
      } else {
        formData.append('photo', file as any);
      }

      // Mengirim request ke server
      const response = await client({
        url: '/absensi/absen-masuk',
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
