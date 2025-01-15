import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { client } from '../common';
import type { PostSPTResponse, PostSPTVariables } from './types';

export const PostSPT = createMutation<
  PostSPTResponse,
  PostSPTVariables,
  AxiosError
>({
  mutationFn: async (variables) => {
    const mimeType = 'application/pdf';
    const formData = new FormData();

    // Check if id_user is defined
    if (variables.id_user === undefined) {
      throw new Error('id_user is required but was not provided.');
    }

    formData.append('id_user', variables.id_user.toString());
    formData.append('tanggal_spt', variables.tanggal_spt);
    formData.append('waktu_spt', variables.waktu_spt.slice(0, 5));
    formData.append('lama_acara', variables.lama_acara.toString());
    formData.append('lokasi_spt', variables.lokasi_spt);
    formData.append('file_spt', {
      uri: variables.file_spt.uri,
      type: mimeType,
      name: variables.file_spt.name,
    } as any);

    try {
      const response = await client({
        url: '/api/spt',
        method: 'POST',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      // Type the error as AxiosError
      const axiosError = error as AxiosError;

      // Tangkap dan log error
      if (axiosError.response) {
        console.error('Error Response:', axiosError.response.data);
      } else if (axiosError.request) {
        console.error('Error Request:', axiosError.request);
      } else {
        console.error('Error Message:', axiosError.message);
      }

      // Lempar kembali error agar bisa ditangani oleh onError
      throw error;
    }
  },
});
