import type { AxiosError } from 'axios';
import axios from 'axios';
import { createMutation } from 'react-query-kit';

import { client } from '../common';
import type { EditUserResponse, EditUserVariables } from './types';

export const PutUser = createMutation<
  EditUserResponse,
  EditUserVariables,
  AxiosError
>({
  mutationFn: async (variables) => {
    try {
      const response = await client({
        url: `/api/users/${variables.id}`,
        method: 'PUT',
        data: variables,
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
