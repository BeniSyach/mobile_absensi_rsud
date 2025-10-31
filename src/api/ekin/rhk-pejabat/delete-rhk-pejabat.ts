import type { AxiosError } from 'axios';
import axios from 'axios';
import { createMutation } from 'react-query-kit';

import { client } from '../../common';
import { type SaveRHKResponsePost } from './types';

type DeleteRhkVariables = {
  id: number;
};

export const DeleteRHKPejabat = createMutation<
  SaveRHKResponsePost,
  DeleteRhkVariables,
  AxiosError
>({
  mutationFn: async ({ id }) => {
    try {
      const response = await client({
        url: `/ekinerja-new/rhk-pejabat/${id}`,
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
