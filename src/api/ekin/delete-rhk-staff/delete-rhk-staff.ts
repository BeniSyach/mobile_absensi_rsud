import type { AxiosError } from 'axios';
import axios from 'axios';
import { createMutation } from 'react-query-kit';

import { client } from '../../common';
import { type DeleteRHKStaffResponse } from './types';

type DeleteRhkVariables = {
  id: number;
};

export const DeleteRHKStaff = createMutation<
  DeleteRHKStaffResponse,
  DeleteRhkVariables,
  AxiosError
>({
  mutationFn: async ({ id }) => {
    try {
      const response = await client({
        url: `/ekinerja/rhk-staff/${id}`,
        method: 'DELETE',
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
