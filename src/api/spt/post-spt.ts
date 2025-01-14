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
    // Membuat FormData untuk mengunggah file
    const formData = new FormData();
    formData.append('tanggal_spt', variables.tanggal_spt);
    formData.append('waktu_spt', variables.waktu_spt);
    formData.append('lama_acara', variables.lama_acara.toString());
    formData.append('lokasi_spt', variables.lokasi_spt);
    formData.append('file_spt', {
      uri: variables.file_spt,
      type: mimeType,
      name: variables.name,
    } as any); // Variabel file

    console.log('data post spt', formData);
    // Kirim FormData ke endpoint API
    return client({
      url: '/api/spt',
      method: 'POST',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then((response) => response.data);
  },
});
