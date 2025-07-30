import type { AxiosError } from 'axios';
import axios from 'axios';
import { createMutation } from 'react-query-kit';

import { client } from '../../common';
import type { PostRhkResponse, PostRhkStaffVariables } from './types';

export const PostRHKStaff = createMutation<
  PostRhkResponse,
  PostRhkStaffVariables,
  AxiosError
>({
  mutationFn: async (variables) => {
    try {
      const response = await client({
        url: '/ekinerja/rhk-staff/store-combined',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        data: variables,
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
