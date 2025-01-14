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
      const mimeType = 'image/jpeg'; // Set correct MIME type
      const file = {
        uri: variables.photo,
        type: mimeType,
        name: variables.name,
      };
      const formData = new FormData();
      // Menambahkan field ke FormData secara manual
      formData.append('user_id', String(variables.user_id));
      formData.append('shift_id', String(variables.shift_id));
      formData.append('waktu_kerja_id', String(variables.waktu_kerja_id));
      formData.append('longitude', String(variables.longitude));
      formData.append('latitude', String(variables.latitude));

      if (Platform.OS === 'ios') {
        // For iOS, the URI might need to be prefixed with 'file://'
        formData.append('photo', {
          uri: file.uri.startsWith('file://') ? file.uri : `file://${file.uri}`,
          type: file.type,
          name: file.name,
        } as any);
      } else {
        formData.append('photo', file as any);
      }

      console.log('data post absen masuk', formData);
      console.log('Photo URI:', variables.photo);
      console.log('MimeType:', variables.mimeType);
      console.log('File Object:', file);

      // Mengirim request ke server
      const response = await client({
        url: '/api/absen-masuk',
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
