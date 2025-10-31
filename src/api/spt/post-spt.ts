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
      throw new Error('id User masih kosong.');
    }

    formData.append('id_user', variables.id_user.toString());
    formData.append('tanggal_spt', variables.tanggal_spt);
    formData.append('waktu_spt', variables.waktu_spt.slice(0, 5));
    formData.append('lama_acara', variables.lama_acara.toString());
    formData.append('lokasi_spt', variables.lokasi_spt);
    formData.append('opd_id', variables.opd_id ?? '');
    formData.append('file_spt', {
      uri: variables.file_spt.uri,
      type: mimeType,
      name: variables.file_spt.name,
    } as any);

    try {
      const response = await client({
        url: '/absensi/spt',
        method: 'POST',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;

      if (!axiosError.response) {
        console.error(
          'Jaringan Error: Tidak ada koneksi atau server tidak merespon'
        );
        throw new Error('Jaringan Error: Periksa koneksi internet Anda.');
      }

      // lempar ulang error non-network agar bisa ditangani onError
      throw error;
    }
  },
});
