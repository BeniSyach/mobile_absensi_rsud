import type { AxiosError } from 'axios';
import axios from 'axios';
import { createMutation } from 'react-query-kit';

import { client } from '../../common';
import type { OtpRequest, ResetPasswordResponse } from './types';

export const PostVerifyOTP = createMutation<
  ResetPasswordResponse,
  OtpRequest,
  AxiosError
>({
  mutationFn: async (variables) => {
    try {
      const response = await client({
        url: '/auth-mobile/verify-otp',
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
