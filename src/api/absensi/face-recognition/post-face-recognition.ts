import type { AxiosError } from 'axios';
import axios from 'axios';
import { Platform } from 'react-native';
import { createMutation } from 'react-query-kit';

import { client } from '../../common';
import {
  type FaceRegisterError,
  type FaceRegisterSuccess,
  type FaceRegisterVariables,
} from './types';

export type FaceRegisterResponse = FaceRegisterSuccess | FaceRegisterError;

// ✅ Mutation
export const postFaceRecognition = createMutation<
  FaceRegisterResponse,
  FaceRegisterVariables,
  AxiosError
>({
  mutationFn: async (variables) => {
    try {
      const formData = new FormData();

      // kirim user_id
      formData.append('nik', variables.nik);
      formData.append(
        'embedding',
        JSON.stringify(Array.from(variables.embedding))
      );
      // kirim semua foto dengan key "photos"
      variables.photos.forEach((p, idx) => {
        const file = {
          uri: Platform.OS === 'ios' ? p.uri.replace('file://', '') : p.uri,
          type: p.type ?? 'image/jpeg',
          name: p.name ?? `photo_${idx}_${Date.now()}.jpg`,
        };
        formData.append('photos', file as any);
      });

      // request ke backend Laravel
      const response = await client({
        url: '/absensi/register-photo-wajah',
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
        throw error.response?.data;
      } else {
        console.error('Unknown error occurred:', error);
        throw error;
      }
    }
  },
});
