import type { AxiosError } from 'axios';
import axios from 'axios';
import { createMutation } from 'react-query-kit';

import { client } from '../../common';
import { type UpdateAtasanResponse, type UpdateAtasanVariables } from './types';

export const UpdateAtasanUser = createMutation<
  UpdateAtasanResponse,
  UpdateAtasanVariables,
  AxiosError
>({
  mutationFn: async (variables) => {
    try {
      const response = await client({
        url: '/ekinerja/users/update-atasan',
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        data: variables,
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error:', error.response?.data || error.message);
        throw error.response?.data ?? error;
      } else {
        console.error('Unexpected error:', error);
        throw error;
      }
    }
  },
});
