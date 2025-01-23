import type { AxiosError } from 'axios';
import axios from 'axios';
import { createMutation } from 'react-query-kit';

import { client } from '../common';
import type { UploadPhotoResponse, UploadPhotoVariables } from './types';

export const UploadPhoto = createMutation<
  UploadPhotoResponse,
  UploadPhotoVariables,
  AxiosError
>({
  mutationFn: async (variables) => {
    try {
      const formData = new FormData();
      formData.append('photo', {
        uri: variables.photo,
        name: variables.name,
        type: variables.mimeType,
      } as any);
      const response = await client({
        url: '/api/upload-photo',
        method: 'POST',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
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
